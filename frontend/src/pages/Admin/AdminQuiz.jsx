import { useState, useEffect } from "react";
import { getAllQuizzes, createQuiz, deleteQuiz } from "../../api/adminApi";

const emptyQuestion = { question: "", options: ["", "", "", ""], correctAnswer: 0 };
const emptyForm     = { title: "", description: "", questions: [{ ...emptyQuestion }] };

const AdminQuiz = () => {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    getAllQuizzes()
      .then(res => setItems(res.data || []))
      .catch(() => setError("Failed to load quizzes."))
      .finally(() => setLoading(false));
  }, []);

  const addQuestion = () => setForm({ ...form, questions: [...form.questions, { ...emptyQuestion, options: ["","","",""] }] });
  const removeQuestion = (idx) => setForm({ ...form, questions: form.questions.filter((_, i) => i !== idx) });

  const updateQuestion = (idx, field, value) => {
    const qs = [...form.questions];
    qs[idx] = { ...qs[idx], [field]: value };
    setForm({ ...form, questions: qs });
  };

  const updateOption = (qIdx, oIdx, value) => {
    const qs = [...form.questions];
    const opts = [...qs[qIdx].options];
    opts[oIdx] = value;
    qs[qIdx] = { ...qs[qIdx], options: opts };
    setForm({ ...form, questions: qs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await createQuiz(form);
      setItems([res.data, ...items]);
      setShowForm(false);
      setForm(emptyForm);
    } catch {
      alert("Failed to create quiz.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    setDeleting(id);
    try {
      await deleteQuiz(id);
      setItems(items.filter(i => i._id !== id));
    } catch {
      alert("Failed to delete.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Quiz Management</h1>
          <p className="text-stone-500 text-sm mt-0.5">{items.length} quizzes</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <span>+</span> Create Quiz
        </button>
      </div>

      {error && <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">⚠️ {error}</div>}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card h-20 animate-pulse bg-stone-100" />)}</div>
      ) : items.length === 0 ? (
        <div className="card text-center py-12 text-stone-400">No quizzes yet.</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="divide-y divide-stone-50">
            {items.map(item => (
              <div key={item._id} className="flex items-center justify-between px-4 py-4 hover:bg-stone-50 transition-colors">
                <div>
                  <p className="font-semibold text-stone-800">{item.title}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{item.questions?.length || 0} questions</p>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deleting === item._id}
                  className="text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium py-1.5 px-3 rounded-xl transition-all ml-4"
                >
                  {deleting === item._id ? "…" : "Delete"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-4 animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="font-serif text-lg font-bold">Create Quiz</h3>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Quiz Title</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" placeholder="Quiz title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" placeholder="Short description" />
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-stone-800">Questions</p>
                  <button type="button" onClick={addQuestion} className="text-xs text-violet-600 hover:underline font-medium">+ Add Question</button>
                </div>
                {form.questions.map((q, qi) => (
                  <div key={qi} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-500 uppercase">Question {qi + 1}</span>
                      {form.questions.length > 1 && (
                        <button type="button" onClick={() => removeQuestion(qi)} className="text-xs text-rose-500 hover:underline">Remove</button>
                      )}
                    </div>
                    <input
                      required value={q.question}
                      onChange={e => updateQuestion(qi, "question", e.target.value)}
                      className="input-field bg-white"
                      placeholder="Question text"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qi}`}
                            checked={q.correctAnswer === oi}
                            onChange={() => updateQuestion(qi, "correctAnswer", oi)}
                            className="accent-violet-600"
                            title="Mark as correct answer"
                          />
                          <input
                            required value={opt}
                            onChange={e => updateOption(qi, oi, e.target.value)}
                            className="input-field bg-white text-xs py-2"
                            placeholder={`Option ${oi + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-stone-400">Select the radio button next to the correct answer.</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  {saving ? "Creating…" : "Create Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuiz;