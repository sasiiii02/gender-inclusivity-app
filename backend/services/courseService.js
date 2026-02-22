import Course from "../models/Course.js";

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

  // Return clean data and pagination metadata for the React frontend
  return {
    courses,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

// 3. Get a single course by ID
export const getCourseById = async (id) => {
  return await Course.findById(id).populate("createdBy", "name email");
};

// 4. Update a course
export const updateCourse = async (id, updateData) => {
  // { new: true } returns the updated document, runValidators ensures schema rules still apply
  return await Course.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

// 5. Soft Delete a course (change status to Inactive)
export const deleteCourse = async (id) => {
  // Soft delete by changing status to "Inactive"
  return await Course.findByIdAndUpdate(id, { status: "Inactive" }, { new: true });
};
