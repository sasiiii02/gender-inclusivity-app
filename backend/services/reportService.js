import Report from "../models/Report.js";
import CaseStatus from "../models/CaseStatus.js";
import ReportResponse from "../models/ReportResponse.js";
import ReportStatusHistory from "../models/ReportStatusHistory.js";
import ReportCategory from "../models/ReportCategory.js";
import Notification from "../models/Notification.js";

// Helper to create notifications
const createNotification = async ({ recipient, message, type, reportId }) => {
    try {
        await Notification.create({
            recipient,
            message,
            type,
            relatedReport: reportId
        });
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
};

export const getReportCategoriesService = async () => {
    return await ReportCategory.find();
};

export const getCaseStatusesService = async () => {
    return await CaseStatus.find();
};

export const createReportCategoryService = async (name) => {
    return await ReportCategory.create({ name });
};

export const deleteReportCategoryService = async (id) => {
    return await ReportCategory.findByIdAndDelete(id);
};

// Helper to mask anonymous reports
const maskReport = (report) => {
    if (!report) return report;
    const reportObj = report.toObject ? report.toObject() : report;
    if (reportObj.isAnonymous) {
        reportObj.reportedBy = { 
            _id: "anonymous",
            name: "Anonymous User", 
            email: "Hidden" 
        };
    }
    return reportObj;
};

// Create a new report
export const createReportService = async(req)=>{
    const {
        title,
        description,
        categoryId,
        isAnonymous,
        location,
        incidentDate,
        priority,
        evidence, // Array of file paths
    } = req.body;
    // find the default status
    const pendingStatus = await CaseStatus.findOne({name:"Pending"});

    if(!pendingStatus){
        throw new Error("Default status not found");
    }

    const isAnon = isAnonymous === 'true' || isAnonymous === true;

    const report = await Report.create({
        title,
        description,
        categoryId,
        reportedBy: req.user._id, // Always store the reporter
        isAnonymous: isAnon,
        location,
        incidentDate,
        priority,
        statusId:pendingStatus._id,
        evidence: evidence || [], // Store evidence paths
    }) 

    return report;

}

// Admin - view all reports
export const getAllReportsService = async()=>{
    const reports = await Report.find()
    .populate("categoryId","name")
    .populate("statusId","name")
    .populate("reportedBy", "name email")
    .sort({ createdAt: -1 });

    // Mask anonymous reports for admin listing
    return reports.map(report => maskReport(report));
}

export const getMyReportsService = async(userId)=>{
    const reports = await Report.find({reportedBy:userId})
    .populate("categoryId","name")
    .populate("statusId","name")
    .sort({ createdAt: -1 });
    return reports;
}

// Update Report Status
export const updateReportStatusService = async (reportId, adminId,statusId) => {
const report = await Report.findById(reportId);

    if (!report) {
    throw new Error("Report not found");
    }
    if (report.isClosed) {
    throw new Error("Cannot modify a closed report");
}

    report.statusId = statusId;

    await report.save();
    await ReportStatusHistory.create({
    reportId,
    statusId,
    updatedBy: adminId,
  });


    const updated = await report.populate("statusId", "name");
    
    // Create notification for the reporter
    if (report.reportedBy) {
        await createNotification({
            recipient: report.reportedBy,
            message: `The status of your report "${report.title}" has been updated to "${updated.statusId.name}".`,
            type: 'status_update',
            reportId: report._id
        });
    }

    return maskReport(updated);
};
// Add response to a report 
export const addReportResponseService = async (
    reportId,
    adminId,
    message
) => {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new Error("Report not found");
  }
  if (report.isClosed) {
  throw new Error("Cannot modify a closed report");
}

  const response = await ReportResponse.create({
    reportId,
    respondedBy: adminId,
    message,
  });

  // Create notification for the reporter
  if (report.reportedBy) {
      await createNotification({
          recipient: report.reportedBy,
          message: `Administrative staff has responded to your report: "${report.title}".`,
          type: 'response',
          reportId: report._id
      });
  }

  // Optionally update status automatically
  report.statusId = report.statusId; // or set to resolved status id
  await report.save();

  return response;
};

//view all report responses

export const getAllReportResponsesService = async()=>{
    const response = await ReportResponse.find()
    .populate("reportId", "title description")
    .populate("respondedBy", "name email");
    return response;
}


// Student - view responses for one of their reports
export const getResponsesByReportService = async (reportId, userId, isAdmin = false) => {
    const report = await Report.findById(reportId);

    if (!report) {
    throw new Error("Report not found");
    }

  // Security check: Allow if admin OR if it matches the reporter
    if (!isAdmin) {
        if (!report.reportedBy || report.reportedBy.toString() !== userId.toString()) {
            throw new Error("Not authorized to view these responses");
        }
    }

    return await ReportResponse.find({ reportId })
    .populate("respondedBy", "name email")
    .sort({ createdAt: 1 });
};

/**
 * Fetch notifications for a specific user.
 */
export const getUserNotificationsService = async (userId) => {
    return await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(20);
};

/**
 * Mark a notification as read.
 */
export const markNotificationAsReadService = async (notificationId, userId) => {
    return await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true },
        { new: true }
    );
};

/**
 * Update the priority of a report (Admin only).
 */
export const updateReportPriorityService = async (reportId, priority) => {
    const report = await Report.findById(reportId);
    if (!report) throw new Error("Report not found");
    
    report.priority = priority;
    await report.save();
    return maskReport(report);
};

// Get report timeline (status changes + responses)
export const getReportTimelineService = async (reportId, userId, isAdmin) => {
  const report = await Report.findById(reportId).populate(
    "reportedBy",
    "name"
  );

  if (!report) {
    throw new Error("Report not found");
  }

  // If not admin, verify ownership
  if (!isAdmin && (!report.reportedBy || report.reportedBy._id.toString() !== userId.toString())) {
    throw new Error("Not authorized to view this report timeline");
  }

  // 1️⃣ Report creation event
  // Use "Anonymous" if the report is flagged, regardless of who is viewing
  const reporterName = report.isAnonymous ? "Anonymous" : (report.reportedBy?.name || "Anonymous User");

  const creationEvent = {
    type: "report_created",
    message: "Report submitted",
    user: reporterName,
    date: report.createdAt,
  };

  // 2️⃣ Status history
  const statusHistory = await ReportStatusHistory.find({ reportId })
    .populate("statusId", "name")
    .populate("updatedBy", "name")
    .sort({ createdAt: 1 });

  const statusEvents = statusHistory.map((item) => ({
    type: "status_update",
    status: item.statusId?.name || "Unknown Status",
    updatedBy: item.updatedBy?.name || "System",
    date: item.createdAt,
  }));

  // 3️⃣ Responses
  const responses = await ReportResponse.find({ reportId })
    .populate("respondedBy", "name")
    .sort({ createdAt: 1 });

  const responseEvents = responses.map((item) => ({
    type: "response",
    message: item.message,
    respondedBy: item.respondedBy?.name || "Admin",
    date: item.createdAt,
  }));

  //  Merge all events
  const timeline = [creationEvent, ...statusEvents, ...responseEvents];

  // Sort by date
  timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

  return timeline;
};

// Admin - close a report
export const closeReportService = async (reportId, adminId) => {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new Error("Report not found");
  }

  report.isClosed = true;
  report.closedAt = new Date();
  report.closedBy = adminId;

  await report.save();

  return maskReport(report);
};

// Admin - reopen a report
export const getReportStatsService = async () => {
  const totalReports = await Report.countDocuments();

  const closedReports = await Report.countDocuments({ isClosed: true });

  const openReports = await Report.countDocuments({ isClosed: false });

  const highPriorityReports = await Report.countDocuments({
    priority: "High",
  });

  // Group by status
  const reportsByStatus = await Report.aggregate([
    {
      $lookup: {
        from: "casestatuses", // make sure this matches your collection name
        localField: "statusId",
        foreignField: "_id",
        as: "status",
      },
    },
    { $unwind: "$status" },
    {
      $group: {
        _id: "$status.name",
        count: { $sum: 1 },
      },
    },
  ]);

  // Group by category
  const reportsByCategory = await Report.aggregate([
    {
      $lookup: {
        from: "reportcategories", // make sure correct collection name
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $group: {
        _id: "$category.name",
        count: { $sum: 1 },
      },
    },
  ]);

  // Group by priority
  const reportsByPriority = await Report.aggregate([
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalReports,
    openReports,
    closedReports,
    highPriorityReports,
    reportsByStatus,
    reportsByCategory,
    reportsByPriority,
  };
};