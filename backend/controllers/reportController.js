import { createReportService, getAllReportsService, getMyReportsService, updateReportStatusService,addReportResponseService,getAllReportResponsesService, getResponsesByReportService, getReportTimelineService,closeReportService, getReportStatsService, getReportCategoriesService} from "../services/reportService.js";

// Controller for managing user reports and admin responses

// Create a new report
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

// Get all report categories
export const getReportCategories = async (req, res) => {
    try {
        const categories = await getReportCategoriesService();
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Admin - view all reports
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
// User - view my reports
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


// Admin - update report status
export const updateReportStatus = async (req, res) => {
    try {
    const { statusId } = req.body;

    const updatedReport = await updateReportStatusService(
        req.params.id,
        req.user._id,
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
// Admin - add response to a report
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
// Student - view responses for one of their reports
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
// Get report timeline (status changes + responses)
export const getReportTimeline = async (req, res) => {
  try {
    const timeline = await getReportTimelineService(
      req.params.id,
      req.user._id,
      req.user.role === "admin"
    );

    res.status(200).json({
      count: timeline.length,
      timeline,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Admin - close a report
export const closeReport = async (req, res) => {
  try {
    const report = await closeReportService(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      message: "Report closed successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Admin - get report statistics
export const getReportStats = async (req, res) => {
  try {
    const stats = await getReportStatsService();

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};