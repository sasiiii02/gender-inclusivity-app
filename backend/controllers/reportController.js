import { createReportService } from "../services/reportService.js";


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