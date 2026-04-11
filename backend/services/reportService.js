import Report from "../models/Report.js";
import CaseStatus from "../models/CaseStatus.js";
import ReportResponse from "../models/ReportResponse.js";
import ReportStatusHistory from "../models/ReportStatusHistory.js";
import ReportCategory from "../models/ReportCategory.js";

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
    const report = await Report.create({
        title,
        description,
        categoryId,
        reportedBy: isAnonymous === 'true' || isAnonymous === true ? null : req.user._id,
        isAnonymous: isAnonymous === 'true' || isAnonymous === true,
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
    return reports;
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


    return await report.populate("statusId", "name");
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
  if (!isAdmin && report.reportedBy._id.toString() !== userId.toString()) {
    throw new Error("Not authorized to view this report timeline");
  }

  // 1️⃣ Report creation event
  const creationEvent = {
    type: "report_created",
    message: "Report submitted",
    user: report.reportedBy.name,
    date: report.createdAt,
  };

  // 2️⃣ Status history
  const statusHistory = await ReportStatusHistory.find({ reportId })
    .populate("statusId", "name")
    .populate("updatedBy", "name")
    .sort({ createdAt: 1 });

  const statusEvents = statusHistory.map((item) => ({
    type: "status_update",
    status: item.statusId.name,
    updatedBy: item.updatedBy.name,
    date: item.createdAt,
  }));

  // 3️⃣ Responses
  const responses = await ReportResponse.find({ reportId })
    .populate("respondedBy", "name")
    .sort({ createdAt: 1 });

  const responseEvents = responses.map((item) => ({
    type: "response",
    message: item.message,
    respondedBy: item.respondedBy.name,
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

  return report;
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