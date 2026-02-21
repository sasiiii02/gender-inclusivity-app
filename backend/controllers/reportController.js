import { createReportService, getAllReportsService, getMyReportsService, } from "../services/reportService.js";


export const createReport = async (req,res) =>{
    try {
        const report = await createReportService(req);
        res.status(201).json({
            success:true,
            message:"Report created successfully",
            report,
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
        
    }
}

export const getAllReports = async(req,res)=>{
    try {
        const reports = await getAllReportsService();
        res.status(200).json(
            {
                success:true,
                message:"Reports fetched successfully",
                count:reports.length,
                reports,
            }
        )
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

export const getMyReports = async(req,res) =>{
    try {
        const reports = await getMyReportsService(req.user._id);
        res.status(200).json({
            success:true,
            count:reports.length,
            message:"My  Reports fetched successfully",
            reports,
        }) 
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}