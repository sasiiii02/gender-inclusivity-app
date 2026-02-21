import mongoose from "mongoose";

const caseStatusSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
    }
)

const CaseStatus = mongoose.model("CaseStatus", caseStatusSchema);
export default CaseStatus;