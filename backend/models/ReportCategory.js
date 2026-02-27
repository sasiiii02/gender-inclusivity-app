import mongoose from "mongoose";
// Report categories for user reports 
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