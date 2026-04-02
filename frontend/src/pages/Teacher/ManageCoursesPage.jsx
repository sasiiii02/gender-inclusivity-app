import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseForm from "../../components/teacher/CourseForm";
import CourseTable from "../../components/teacher/CourseTable";
import * as trainingApi from "../../api/trainingApi";

const ManageCoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await trainingApi.getAllCourses({
        page: 1,
        limit: 100,
      });
      setCourses(res.data?.data?.courses || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load courses.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const emptyInitialValues = useMemo(
    () => ({
      title: "",
      description: "",
      category: "",
      level: "Beginner",
      duration: "",
    }),
    []
  );

  const openEdit = (course) => {
    setEditing(course);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (editing?._id) {
        await trainingApi.updateCourse(editing._id, payload);
        setSuccess("Course updated successfully.");
      } else {
        await trainingApi.createCourse(payload);
        setSuccess("Course created successfully.");
      }
      setEditing(null);
      await fetchCourses();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course? (soft delete)")) return;
    setDeletingId(courseId);
    setError("");
    setSuccess("");
    try {
      await trainingApi.deleteCourse(courseId);
      await fetchCourses();
      setSuccess("Course deleted successfully.");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleManageLessons = (course) => {
    if (!course?._id) return;
    navigate(`/teacher/courses/${course._id}/lessons`);
  };

  const handleViewStudents = (course) => {
    if (!course?._id) return;
    navigate(`/teacher/courses/${course._id}/students`);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          Manage Courses
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">
          Create, update, and delete courses.
        </p>
      </div>

      {error ? (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          ⚠️ {error}
        </div>
      ) : null}

      {success ? (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          {success}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 border border-stone-200 rounded-2xl bg-white p-4">
          <h2 className="font-serif text-lg font-bold text-stone-900">
            {editing ? "Edit Course" : "Create Course"}
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            {editing ? "Update course details and save changes." : "Fill in details to publish a new course."}
          </p>
          <div className="mt-4">
            <CourseForm
              initialData={editing || emptyInitialValues}
              submitLabel={saving ? "Saving…" : editing ? "Update Course" : "Create Course"}
              onSubmit={saving ? null : handleSubmit}
            />
            {editing ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => setEditing(null)}
                className="mt-3 w-full rounded-xl px-3 py-2 text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors disabled:opacity-60"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="border border-stone-200 rounded-2xl p-4 bg-white animate-pulse"
                />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center">
              No courses found.
            </div>
          ) : (
            <CourseTable
              courses={courses}
              onEdit={openEdit}
              onDelete={handleDelete}
              onManageLessons={handleManageLessons}
              onViewStudents={handleViewStudents}
              deletingId={deletingId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCoursesPage;

