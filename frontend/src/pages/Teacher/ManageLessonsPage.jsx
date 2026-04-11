import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LessonForm from "../../components/teacher/LessonForm";
import LessonCardList from "../../components/teacher/LessonCardList";
import * as trainingApi from "../../api/trainingApi";

const ManageLessonsPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState("");

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formResetKey, setFormResetKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const emptyLessonValues = useMemo(
    () => ({
      title: "",
      content: "",
      orderNumber: "",
      duration: "",
    }),
    []
  );

  useEffect(() => {
    if (!courseId) {
      setCourse(null);
      setCourseLoading(false);
      setCourseError("");
      return;
    }
    let cancelled = false;
    (async () => {
      setCourseLoading(true);
      setCourseError("");
      try {
        const res = await trainingApi.getCourseById(courseId);
        if (!cancelled) setCourse(res.data);
      } catch (e) {
        if (!cancelled) {
          setCourse(null);
          setCourseError(e?.response?.data?.message || "Could not load course details.");
        }
      } finally {
        if (!cancelled) setCourseLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const openAdd = () => {
    setSuccess("");
    setEditingLesson(null);
    setFormResetKey((k) => k + 1);
    setShowForm(true);
  };

  const openEdit = (lesson) => {
    setSuccess("");
    setEditingLesson(lesson);
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditingLesson(null);
  };

  const fetchLessons = async () => {
    if (!courseId) {
      setLessons([]);
      setLoading(false);
      setError("Missing course in the URL. Open this page from a course or the Manage Lessons menu.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await trainingApi.getLessonsByCourse(courseId);
      setLessons(res.data?.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load lessons.");
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleSubmit = async (payload) => {
    if (saving) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (editingLesson?._id) {
        await trainingApi.updateLesson(editingLesson._id, payload);
        setSuccess("Lesson updated successfully.");
      } else {
        await trainingApi.addLesson(courseId, payload);
        setSuccess("Lesson created successfully.");
      }
      setEditingLesson(null);
      setShowForm(false);
      setFormResetKey((k) => k + 1);
      await fetchLessons();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save lesson.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    const id = lessonToDelete?._id;
    if (!id) return;
    setDeletingId(id);
    setError("");
    setSuccess("");
    try {
      await trainingApi.deleteLesson(id);
      setSuccess("Lesson deleted successfully.");
      setLessonToDelete(null);
      await fetchLessons();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to delete lesson.");
    } finally {
      setDeletingId(null);
    }
  };

  const courseTitle = course?.title || (courseLoading ? "Loading…" : "Course");

  const filteredLessons = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return lessons;
    return lessons.filter((l) => {
      const orderStr =
        l.orderNumber !== null && l.orderNumber !== undefined
          ? String(l.orderNumber)
          : "";
      const durStr =
        l.duration !== null && l.duration !== undefined ? String(l.duration) : "";
      const haystack = [l.title, l.content, orderStr, durStr]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [lessons, searchTerm]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-2xl font-bold text-stone-900">Manage Lessons</h1>
          <p className="text-stone-600 text-sm mt-1">
            <span className="font-medium text-stone-800">Lessons</span>
            {courseId ? (
              <>
                {" "}
                — <span className="text-stone-800">{courseTitle}</span>
              </>
            ) : null}
          </p>
          {courseError ? (
            <p className="text-xs text-amber-700 mt-2">{courseError}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navigate("/teacher/manage-courses")}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50 transition-colors"
          >
            ← Back to courses
          </button>
          <button
            type="button"
            onClick={openAdd}
            disabled={!courseId || loading}
            className="rounded-xl border-2 border-violet-600 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            + Add lesson
          </button>
        </div>
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

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-serif text-lg font-bold text-stone-900">Lesson list</h2>
            {!loading ? (
              <span className="text-xs font-semibold text-stone-500">
                {searchTerm.trim()
                  ? `${filteredLessons.length} of ${lessons.length} ${
                      lessons.length === 1 ? "lesson" : "lessons"
                    }`
                  : `${lessons.length} ${lessons.length === 1 ? "lesson" : "lessons"}`}
              </span>
            ) : null}
          </div>
          {!loading && lessons.length > 0 ? (
            <div className="w-full sm:w-auto sm:min-w-[220px]">
              <label className="sr-only" htmlFor="lesson-search">
                Search lessons
              </label>
              <input
                id="lesson-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search lessons…"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-800 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-violet-200"
                autoComplete="off"
              />
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl border border-stone-100 bg-stone-50 animate-pulse"
              />
            ))}
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-stone-50 border border-stone-200">
            <p className="text-stone-700 font-medium">No lessons yet</p>
            <p className="text-sm text-stone-500 mt-2">
              Add your first lesson to start building this course.
            </p>
            <button
              type="button"
              onClick={openAdd}
              disabled={!courseId}
              className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              + Add lesson
            </button>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-stone-50 border border-stone-200">
            <p className="text-stone-700 font-medium">No lessons match your search</p>
            <p className="text-sm text-stone-500 mt-2">
              Try another title, order number, or word from the content.
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-4 text-sm font-semibold text-violet-700 hover:text-violet-800"
            >
              Clear search
            </button>
          </div>
        ) : (
          <LessonCardList
            lessons={filteredLessons}
            onEdit={openEdit}
            onDelete={setLessonToDelete}
            deletingId={deletingId}
          />
        )}
      </div>

      {showForm ? (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lesson-form-title"
          onClick={() => closeForm()}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-slide-up my-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 sticky top-0 bg-white z-10">
              <h2 id="lesson-form-title" className="text-lg font-bold text-stone-900">
                {editingLesson ? "Edit lesson" : "Add lesson"}
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
              {courseId ? (
                <p className="text-sm text-stone-500 mb-4">
                  Course: <span className="font-semibold text-stone-800">{courseTitle}</span>
                </p>
              ) : null}
              <LessonForm
                key={`${editingLesson?._id || "new"}-${formResetKey}`}
                initialData={editingLesson || emptyLessonValues}
                submitLabel={
                  saving ? "Saving…" : editingLesson ? "Update lesson" : "Add lesson"
                }
                onSubmit={saving ? undefined : handleSubmit}
                disabled={saving}
                loading={saving}
                error={error}
                success={success}
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

      {lessonToDelete ? (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-lesson-title"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-slide-up">
            <h3 id="delete-lesson-title" className="text-lg font-bold text-stone-900 mb-2">
              Delete lesson?
            </h3>
            <p className="text-stone-500 text-sm mb-5">
              <span className="font-semibold text-stone-800">
                {lessonToDelete.title || "This lesson"}
              </span>{" "}
              will be removed permanently. This cannot be undone.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!deletingId) setLessonToDelete(null);
                }}
                disabled={!!deletingId}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold border border-stone-300 bg-white hover:bg-stone-100 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingId === lessonToDelete._id}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-60"
              >
                {deletingId === lessonToDelete._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ManageLessonsPage;
