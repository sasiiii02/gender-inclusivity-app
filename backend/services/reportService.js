import Report from "../models/Report.js";
import CaseStatus from "../models/CaseStatus.js";
import ReportResponse from "../models/ReportResponse.js";
import ReportStatusHistory from "../models/ReportStatusHistory.js";

export const createReportService = async(req)=>{
    const {
        title,
        description,
        categoryId,
        isAnonymous,
        location,
        incidentDate,
        priority,
    } = await req.body;
    // find the default status
    const pendingStatus = await CaseStatus.findOne({name:"Pending"});

    if(!pendingStatus){
        throw new Error("Default status not found");
    }
    const report = await Report.create({
        title,
        description,
        categoryId,
        reportedBy: isAnonymous ? null : req.user._id,
        isAnonymous,
        location,
        incidentDate,
        priority,
        statusId:pendingStatus._id,
    }) 

    return report;

}


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
export const updateReportStatusService = async (reportId, statusId) => {
const report = await Report.findById(reportId);

    if (!report) {
    throw new Error("Report not found");
    }

    report.statusId = statusId;

    await report.save();

    return await report.populate("statusId", "name");
};

export const addReportResponseService = async (
    reportId,
    adminId,
    message
) => {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new Error("Report not found");
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
export const getResponsesByReportService = async (reportId, userId) => {
    const report = await Report.findById(reportId);

    if (!report) {
    throw new Error("Report not found");
    }

  // Security check
    if (report.reportedBy.toString() !== userId.toString()) {
    throw new Error("Not authorized to view these responses");
    }

    return await ReportResponse.find({ reportId })
    .populate("respondedBy", "name email")
    .sort({ createdAt: 1 });
};
