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
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [courseToDeactivate, setCourseToDeactivate] = useState(null);
  const [deactivatingId, setDeactivatingId] = useState(null);
  const [courseToActivate, setCourseToActivate] = useState(null);
  const [activatingId, setActivatingId] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setEditing(null);
    setShowForm(false);
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
      setShowForm(false);
      await fetchCourses();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  const handleManageLessons = (course) => {
    if (!course?._id) return;
    navigate(`/teacher/courses/${course._id}/lessons`);
  };

  const handleConfirmDeactivate = async () => {
    if (!courseToDeactivate?._id) return;
    const id = courseToDeactivate._id;
    setDeactivatingId(id);
    setError("");
    try {
      await trainingApi.deactivateCourse(id);
      setCourseToDeactivate(null);
      await fetchCourses();
      setSuccess("Course deactivated. It is now inactive and no longer available for enrollment.");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to deactivate course.");
    } finally {
      setDeactivatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete?._id) return;
    const id = courseToDelete._id;
    setDeletingId(id);
    setError("");
    try {
      await trainingApi.deleteCourse(id);
      setCourseToDelete(null);
      await fetchCourses();
      setSuccess("Course completely deleted. All associated lessons and enrollments were removed.");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleConfirmActivate = async () => {
    if (!courseToActivate?._id) return;
    const id = courseToActivate._id;
    setActivatingId(id);
    setError("");
    try {
      await trainingApi.activateCourse(id);
      setCourseToActivate(null);
      await fetchCourses();
      setSuccess("Course activated. It is now active and available for enrollment.");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to activate course.");
    } finally {
      setActivatingId(null);
    }
  };

  const filteredCourses = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return courses;

    return courses.filter((course) => {
      const haystack = [course.title, course.category, course.level, course.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [courses, searchTerm]);

  const metrics = useMemo(() => {
    const total = courses.length;
    const active = courses.filter(
      (course) => `${course.status || "Active"}`.toLowerCase() === "active"
    ).length;
    const enrolled = courses.reduce((sum, course) => {
      const candidates = [
        course?.studentsCount,
        course?.totalStudents,
        course?.enrolledCount,
        course?.enrollmentsCount,
        Array.isArray(course?.students) ? course.students.length : null,
        Array.isArray(course?.enrollments) ? course.enrollments.length : null,
      ];
      const count = candidates.find((value) => Number.isFinite(Number(value)));
      return sum + (count ? Number(count) : 0);
    }, 0);

    const completionValues = courses
      .map((course) => Number(course.avgCompletion ?? course.completionRate))
      .filter((value) => Number.isFinite(value));
    const avgCompletion = completionValues.length
      ? Math.round(completionValues.reduce((a, b) => a + b, 0) / completionValues.length)
      : 0;

    return { total, active, enrolled, avgCompletion };
  }, [courses]);

  return (
    <div className="animate-fade-in">
      <div className="rounded-2xl border border-stone-200 bg-white text-stone-900 p-5 sm:p-6 space-y-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manage Courses</h1>
            <p className="text-sm text-stone-500 mt-0.5">Teacher &gt; Courses</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="self-start rounded-xl bg-violet-600 px-4 py-2 text-base font-semibold text-white hover:bg-violet-700 transition-colors"
          >
            + Add course
          </button>
        </div>

        {error ? (
          <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
            {success}
          </div>
        ) : null}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total courses", value: metrics.total },
            { label: "Active", value: metrics.active },
            { label: "Enrolled", value: metrics.enrolled },
            { label: "Avg completion", value: `${metrics.avgCompletion}%` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-center"
            >
              <p className="text-3xl leading-none font-bold">{stat.value}</p>
              <p className="text-sm text-stone-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {showForm ? (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-form-title"
            onClick={() => closeForm()}
          >
            <div
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-slide-up my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <h2 id="course-form-title" className="text-lg font-bold text-stone-900">
                  {editing ? "Edit course" : "Add course"}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="text-stone-400 hover:text-stone-600 text-2xl leading-none disabled:opacity-50"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-stone-500 mb-4">
                  {editing
                    ? "Update the selected course details."
                    : "Fill in the details to publish a new course."}
                </p>
                <CourseForm
                  initialData={editing || emptyInitialValues}
                  submitLabel={saving ? "Saving..." : editing ? "Update course" : "Create course"}
                  loading={saving}
                  onSubmit={saving ? null : handleSubmit}
                />
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="mt-3 w-full rounded-xl px-3 py-2 text-sm font-semibold border border-stone-300 bg-white hover:bg-stone-100 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {courseToDeactivate ? (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="deactivate-course-title"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-slide-up">
              <h3 id="deactivate-course-title" className="text-lg font-bold text-stone-900 mb-2">
                Deactivate course?
              </h3>
              <p className="text-stone-500 text-sm mb-5">
                <span className="font-semibold text-stone-800">{courseToDeactivate.title}</span> will
                be set to <span className="font-semibold text-stone-800">Inactive</span>. Students
                cannot enroll, and the course will be hidden from views that only show active courses.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!deactivatingId) setCourseToDeactivate(null);
                  }}
                  disabled={!!deactivatingId}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold border border-stone-300 bg-white hover:bg-stone-100 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeactivate}
                  disabled={deactivatingId === courseToDeactivate._id}
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-60"
                >
                  {deactivatingId === courseToDeactivate._id ? "Deactivating…" : "Deactivate"}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {courseToActivate ? (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="activate-course-title"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-slide-up">
              <h3 id="activate-course-title" className="text-lg font-bold text-stone-900 mb-2">
                Activate course?
              </h3>
              <p className="text-stone-500 text-sm mb-5">
                <span className="font-semibold text-stone-800">{courseToActivate.title}</span> will
                be set to <span className="font-semibold text-stone-800">Active</span>. Students
                will be able to enroll and view the course.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!activatingId) setCourseToActivate(null);
                  }}
                  disabled={!!activatingId}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold border border-stone-300 bg-white hover:bg-stone-100 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmActivate}
                  disabled={activatingId === courseToActivate._id}
                  className="flex-1 rounded-xl bg-lime-600 px-4 py-3 text-sm font-semibold text-white hover:bg-lime-700 transition-colors disabled:opacity-60"
                >
                  {activatingId === courseToActivate._id ? "Activating…" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {courseToDelete ? (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-course-title"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-slide-up">
              <h3 id="delete-course-title" className="text-lg font-bold text-rose-600 mb-2">
                Delete course permanently?
              </h3>
              <p className="text-stone-500 text-sm mb-5">
                Are you sure you want to completely delete <span className="font-semibold text-stone-800">{courseToDelete.title}</span>? This action is irreversible and will also delete all associated lessons and enrollments.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!deletingId) setCourseToDelete(null);
                  }}
                  disabled={!!deletingId}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold border border-stone-300 bg-white hover:bg-stone-100 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deletingId === courseToDelete._id}
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-60"
                >
                  {deletingId === courseToDelete._id ? "Deleting…" : "Delete Permanently"}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full sm:w-64 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-800 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="border border-stone-200 rounded-2xl p-4 bg-stone-50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <CourseTable
            courses={filteredCourses}
            onEdit={openEdit}
            onManageLessons={handleManageLessons}
            onDeactivate={setCourseToDeactivate}
            onActivate={setCourseToActivate}
            onDelete={setCourseToDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ManageCoursesPage;

