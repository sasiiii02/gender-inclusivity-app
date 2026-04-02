import { useEffect, useMemo, useState } from "react";
import CourseForm from "../../components/teacher/CourseForm";
import CourseTable from "../../components/teacher/CourseTable";
import * as trainingApi from "../../api/trainingApi";

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
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
      status: "Active",
    }),
    []
  );

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      if (editing?._id) {
        await trainingApi.updateCourse(editing._id, payload);
      } else {
        await trainingApi.createCourse(payload);
      }
      closeForm();
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
    try {
      await trainingApi.deleteCourse(courseId);
      await fetchCourses();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Manage Courses
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Create, edit, and deactivate courses.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-4 py-2 rounded-xl transition-colors"
        >
          + Add course
        </button>
      </div>

      {error ? (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          ⚠️ {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border border-stone-200 rounded-2xl p-4 bg-white animate-pulse"
            />
          ))}
        </div>
      ) : (
        <CourseTable
          courses={courses}
          onEdit={openEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editing ? "Edit Course" : "Add Course"}
              </h3>
              <button
                type="button"
                onClick={closeForm}
                className="text-stone-400 hover:text-stone-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-5">
              <CourseForm
                initialValues={editing ? editing : emptyInitialValues}
                submitLabel={editing ? "Save Changes" : "Create"}
                isSubmitting={saving}
                onCancel={closeForm}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoursesPage;

