import mongoose from 'mongoose';
import User from './User.js';
import ReportCategory from './ReportCategory.js';
import CaseStatus from './CaseStatus.js';

const reportSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        categoryId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ReportCategory",
            required:true,
        },
        reportedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null,
        },
        isAnonymous:{
            type:Boolean,
            default:false,
        },
        location:{
            type:String,
        },
        incidentDate:{
            type:Date,
        },
        priority:{
            type:String,
            enum:["Low","Medium","High"],
            default:"Low",
        },
        statusId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"CaseStatus",
            required:true
        },
    },
    {
        timestamps:true,
    }
    
)

const Report = mongoose.model("Report",reportSchema);
export default Report;