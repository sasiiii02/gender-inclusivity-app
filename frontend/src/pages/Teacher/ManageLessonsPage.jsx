import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LessonForm from "../../components/teacher/LessonForm";
import LessonTable from "../../components/teacher/LessonTable";
import * as trainingApi from "../../api/trainingApi";

const ManageLessonsPage = () => {
  console.log("[Training] ManageLessonsPage rendered");
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const openEdit = (lesson) => {
    setEditingLesson(lesson);
  };

  const fetchLessons = async () => {
    if (!courseId) {
      setLessons([]);
      setLoading(false);
      setError("Missing courseId in route.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
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
    setSaving(true);
    setError("");
    try {
      if (editingLesson?._id) {
        await trainingApi.updateLesson(editingLesson._id, payload);
        setSuccess("Lesson updated successfully.");
      } else {
        await trainingApi.addLesson(courseId, payload);
        setSuccess("Lesson created successfully.");
      }
      setEditingLesson(null);
      await fetchLessons();
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
      setSuccess("Lesson deleted successfully.");
      await fetchLessons();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to delete lesson.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            Training Module - Manage Lessons Page
          </h1>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Manage Lessons
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Add and update lesson content per course.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-stone-900 hover:bg-stone-800 text-white font-medium px-4 py-2 rounded-xl transition-colors"
        >
          Back
        </button>
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
            {editingLesson ? "Edit Lesson" : "Add Lesson"}
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Course: <span className="font-semibold">{courseId || "—"}</span>
          </p>

          <div className="mt-4">
            <LessonForm
              initialData={editingLesson || emptyLessonValues}
              submitLabel={saving ? "Saving…" : editingLesson ? "Update Lesson" : "Add Lesson"}
              onSubmit={saving ? null : handleSubmit}
            />
            {editingLesson ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => setEditingLesson(null)}
                className="mt-3 w-full rounded-xl px-3 py-2 text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors disabled:opacity-60"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-2 border border-stone-200 rounded-2xl bg-white p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="font-serif text-lg font-bold text-stone-900">Lessons</h2>
            {loading ? (
              <span className="text-xs text-stone-500">Loading…</span>
            ) : (
              <span className="text-xs font-semibold text-stone-500">
                {lessons.length} lessons
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-5">
              Fetching lessons…
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-5">
              No lessons found.
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
      </div>
    </div>
  );
};

export default ManageLessonsPage;

