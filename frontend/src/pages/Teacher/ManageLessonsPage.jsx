import { useEffect, useMemo, useState } from "react";
import LessonForm from "../../components/teacher/LessonForm";
import LessonTable from "../../components/teacher/LessonTable";
import * as trainingApi from "../../api/trainingApi";

const ManageLessonsPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const emptyLessonValues = useMemo(
    () => ({
      title: "",
      content: "",
      orderNumber: "",
      duration: "",
    }),
    []
  );

  const fetchCourses = async () => {
    setLoadingCourses(true);
    setError("");
    try {
      const res = await trainingApi.getAllCourses({
        page: 1,
        limit: 100,
      });
      const list = res.data?.data?.courses || [];
      setCourses(list);
      setSelectedCourseId((prev) => prev || list[0]?._id || "");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load courses.");
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchLessons = async (courseId) => {
    if (!courseId) return;
    setLoadingLessons(true);
    setError("");
    try {
      const res = await trainingApi.getLessonsByCourse(courseId);
      setLessons(res.data?.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load lessons.");
      setLessons([]);
    } finally {
      setLoadingLessons(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchLessons(selectedCourseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseId]);

  const openCreate = () => {
    setEditingLesson(null);
    setShowForm(true);
  };

  const openEdit = (lesson) => {
    setEditingLesson(lesson);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingLesson(null);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      if (!selectedCourseId) throw new Error("Select a course first.");

      if (editingLesson?._id) {
        await trainingApi.updateLesson(editingLesson._id, payload);
      } else {
        await trainingApi.addLessonToCourse(selectedCourseId, payload);
      }
      closeForm();
      await fetchLessons(selectedCourseId);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save lesson.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;
    setDeletingId(lessonId);
    setError("");
    try {
      await trainingApi.deleteLesson(lessonId);
      await fetchLessons(selectedCourseId);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to delete lesson.");
    } finally {
      setDeletingId(null);
    }
  };

  const selectedCourseTitle = courses.find((c) => c._id === selectedCourseId)?.title;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Manage Lessons
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Add and update lesson content per course.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          disabled={!selectedCourseId}
          className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
        >
          + Add lesson
        </button>
      </div>

      {error ? (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          ⚠️ {error}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-stone-700">Course</label>
        {loadingCourses ? (
          <div className="text-sm text-stone-500">Loading courses…</div>
        ) : (
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="border border-stone-200 rounded-2xl bg-white p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-serif text-lg font-bold text-stone-900">
            {selectedCourseTitle ? `Lessons • ${selectedCourseTitle}` : "Lessons"}
          </h2>
          {loadingLessons ? (
            <span className="text-xs text-stone-500">Loading…</span>
          ) : (
            <span className="text-xs font-semibold text-stone-500">
              {lessons.length} lessons
            </span>
          )}
        </div>

        {loadingLessons ? (
          <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-5">
            Fetching lessons…
          </div>
        ) : (
          <LessonTable
            lessons={lessons}
            onEdit={openEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingLesson ? "Edit Lesson" : "Add Lesson"}
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
              <LessonForm
                initialValues={editingLesson || emptyLessonValues}
                submitLabel={editingLesson ? "Save Changes" : "Add Lesson"}
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

export default ManageLessonsPage;

