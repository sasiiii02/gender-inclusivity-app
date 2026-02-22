import { createReportService, getAllReportsService, getMyReportsService, updateReportStatusService,addReportResponseService,getAllReportResponsesService, getResponsesByReportService} from "../services/reportService.js";


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



export const updateReportStatus = async (req, res) => {
    try {
    const { statusId } = req.body;

    const updatedReport = await updateReportStatusService(
        req.params.id,
        statusId
    );

    res.status(200).json({
        success:true,
        message: "Report status updated successfully",
        report: updatedReport,
    });
    } catch (error) {
    res.status(500).json({
        success:false,
        message: error.message,
    });
  }
};

export const addReportResponse = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await addReportResponseService(
      req.params.id,
      req.user._id,
      message
    );

    res.status(201).json({
      message: "Response added successfully",
      response,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin - view all responses
export const getAllResponses = async (req, res) => {
  try {
    const responses = await getAllReportResponsesService();

    res.status(200).json({
      count: responses.length,
      responses,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyReportResponses = async (req, res) => {
  try {
    const responses = await getResponsesByReportService(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      count: responses.length,
      responses,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};