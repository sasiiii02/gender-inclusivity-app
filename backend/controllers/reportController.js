import { createReportService, getAllReportsService, getMyReportsService, updateReportStatusService,addReportResponseService,getAllReportResponsesService, getResponsesByReportService, getReportTimelineService,closeReportService, getReportStatsService, getReportCategoriesService, getCaseStatusesService, createReportCategoryService, deleteReportCategoryService, updateReportPriorityService, getUserNotificationsService, markNotificationAsReadService} from "../services/reportService.js";

// JSON body — POST /api/reports (integration / API clients without multipart)
export const createReportJson = async (req, res) => {
  try {
    if (!req.body.evidence) {
      req.body.evidence = [];
    }
    const report = await createReportService(req);
    res.status(201).json({
      success: true,
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller for managing user reports and admin responses

// Get all report statuses
export const getReportStatuses = async (req, res) => {
    try {
        const statuses = await getCaseStatusesService();
        res.status(200).json({
            success: true,
            statuses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Create a new report category
export const createReportCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await createReportCategoryService(name);
        res.status(201).json({
            success: true,
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete a report category
export const deleteReportCategory = async (req, res) => {
    try {
        await deleteReportCategoryService(req.params.id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Create a new report
export const createReport = async (req,res) =>{
    try {
        // If files are uploaded via multer, they will be in req.files
        if (req.files && req.files.length > 0) {
            req.body.evidence = req.files.map(file => `/uploads/evidence/${file.filename}`);
        }
        
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
    if (error.message === "Report not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === "Cannot modify a closed report") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
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
      req.user._id,
      req.user.role === "admin"
    );

    res.status(200).json({
      count: responses.length,
      responses,
    });
  } catch (error) {
    if (error.message?.includes("Not authorized")) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
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

// Admin - update report priority
export const updateReportPriority = async (req, res) => {
    try {
        const { priority } = req.body;
        const report = await updateReportPriorityService(req.params.id, priority);
        res.status(200).json({
            success: true,
            report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// User - get notifications
export const getMyNotifications = async (req, res) => {
    try {
        const notifications = await getUserNotificationsService(req.user._id);
        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// User - mark notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await markNotificationAsReadService(req.params.id, req.user._id);
        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};