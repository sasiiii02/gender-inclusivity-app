import mongoose from "mongoose";

const reportCategorySchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
    }
)

const CaseStatus = mongoose.model("CaseStatus",reportCategorySchema);
export default CaseStatus;