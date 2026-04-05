import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    orderNumber: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
    },
    videoUrl: {
      type: String,
    },
    pdf: {
      url: String,
      publicId: String,
      originalFilename: String,
      resourceType: String,
      format: String,
      bytes: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;
