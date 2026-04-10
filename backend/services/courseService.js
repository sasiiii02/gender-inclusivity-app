import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";

// 1. Create a new course
export const createCourse = async (courseData) => {
  const course = new Course(courseData);
  return await course.save();
};

// 2. Get all courses with Pagination, Search, and Filtering
export const getAllCourses = async (query) => {
  const { search, status, category, level, page = 1, limit = 10 } = query;
  const skip = (page - 1) * parseInt(limit);

  // Build the dynamic filter object
  const filter = {};
  
  if (status) {
    filter.status = status;
  }
  
  if (category) {
    filter.category = category;
  }

  if (level) {
    filter.level = level;
  }
  
  if (search) {
    // $regex allows partial matches, $options: "i" makes it case-insensitive
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  // Fetch data and populate the creator's name and email
  const courses = await Course.find(filter)
    .populate("createdBy", "name email")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 }); // Newest first

  const total = await Course.countDocuments(filter);

  const courseIds = courses.map((course) => course._id);
  let statsByCourseId = new Map();

  if (courseIds.length > 0) {
    const enrollmentStats = await Enrollment.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      {
        $group: {
          _id: "$courseId",
          enrolledCount: { $sum: 1 },
          avgCompletion: { $avg: "$progressPercentage" },
          completedCount: {
            $sum: {
              $cond: [{ $eq: ["$completionStatus", "Completed"] }, 1, 0],
            },
          },
        },
      },
    ]);

    statsByCourseId = new Map(
      enrollmentStats.map((row) => [String(row._id), row])
    );
  }

  const coursesWithStats = courses.map((courseDoc) => {
    const course = courseDoc.toObject();
    const stats = statsByCourseId.get(String(course._id));

    const enrolledCount = stats?.enrolledCount || 0;
    const avgCompletion = Number.isFinite(stats?.avgCompletion)
      ? Math.round(stats.avgCompletion)
      : 0;
    const completionRate =
      enrolledCount > 0
        ? Math.round(((stats?.completedCount || 0) / enrolledCount) * 100)
        : 0;

    return {
      ...course,
      enrolledCount,
      avgCompletion,
      completionRate,
    };
  });

  // Return clean data and pagination metadata for the React frontend
  return {
    courses: coursesWithStats,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

// 3. Get a single course by ID
export const getCourseById = async (id) => {
  // Only return active courses for this endpoint (inactive courses are "blocked")
  return await Course.findOne({ _id: id, status: "Active" });
};

// 4. Update a course
export const updateCourse = async (id, updateData) => {
  // { new: true } returns the updated document, runValidators ensures schema rules still apply
  return await Course.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

// 5. Delete a course completely and its associated data
export const deleteCourse = async (id) => {
  const deletedCourse = await Course.findByIdAndDelete(id);
  if (deletedCourse) {
    await Lesson.deleteMany({ courseId: id });
    await Enrollment.deleteMany({ courseId: id });
  }
  return deletedCourse;
};
