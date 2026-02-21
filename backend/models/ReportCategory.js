import mongoose from "mongoose";

const reportCategorySchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
    }
)

const ReportCategory = mongoose.model("ReportCategory", reportCategorySchema);
export default ReportCategory;
