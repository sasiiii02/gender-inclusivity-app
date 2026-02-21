import Report from "../models/Report.js";
import CaseStatus from "../models/CaseStatus.js";

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