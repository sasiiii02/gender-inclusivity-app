import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentQuiz } from "../../hooks/useStudentQuiz";
import QuizCard from "../../components/student/QuizCard";
import QuizJoinForm from "../../components/student/QuizJoinForm";
import LoadingSpinner from "../../components/student/LoadingSpinner";

const QUOTES = [
  { text: "Inclusion begins with understanding.", author: "— Awareness Week" },
  { text: "Every voice matters.", author: "— Global Equity Forum" },
  { text: "Respect creates safe spaces.", author: "— UNESCO" },
];

const ACTIONS = [
  {
    label: "Join New Quiz",
    bg: "#dbeafe",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    label: "Continue Quiz",
    bg: "#ccfbf1",
    route: "/student/quiz/continue",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0f766e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    label: "View Achievements",
    bg: "#f1f5f9",
    route: "/student/achievements",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#475569"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    label: "Quiz History",
    bg: "#e0e7ef",
    route: "/student/quiz/history",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1e3a5f"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="13" y2="14" />
      </svg>
    ),
  },
];

const TOPICS = [
  {
    title: "Gender Equality Basics",
    desc: "Foundational concepts around gender equity and equal rights in daily life.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1e3a5f"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M12 3l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
      </svg>
    ),
  },
  {
    title: "Respectful Communication",
    desc: "How language shapes perception and builds or breaks inclusive communities.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1e3a5f"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Breaking Stereotypes",
    desc: "Challenging assumptions and biases that limit individual potential.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1e3a5f"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    ),
  },
  {
    title: "Inclusive Language",
    desc: "Words that welcome everyone and reflect respect for all identities.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1e3a5f"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const BADGES = [
  {
    label: "Equality Explorer",
    earned: true,
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    label: "Respect Champion",
    earned: true,
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M12 2l3 7h7l-6 4.5 2.3 7-6.3-4-6.3 4 2.3-7L2 9h7z" />
      </svg>
    ),
  },
  {
    label: "Inclusive Speaker",
    earned: false,
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
  {
    label: "Awareness Master",
    earned: false,
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

const EVENTS = [
  { date: "Apr 18", title: "Inclusivity Webinar", tag: "Online" },
  { date: "Apr 25", title: "Diversity Workshop", tag: "In-person" },
  { date: "May 3", title: "Awareness Talk Session", tag: "Hybrid" },
];

const POLL_OPTIONS = ["Respect", "Equal Participation", "Safe Communication"];
const POLL_COLORS = ["#1e3a5f", "#0f766e", "#334155"];

/* ── Quote Carousel ── */
const QuoteCarousel = () => {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % QUOTES.length);
        setFade(true);
      }, 400);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        background: "#f0f9ff",
        border: "1px solid #bae6fd",
        borderRadius: 14,
        padding: "1.5rem 2rem",
        textAlign: "center",
      }}
    >
      <div style={{ opacity: fade ? 1 : 0, transition: "opacity 0.4s ease" }}>
        <p
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#0c4a6e",
            marginBottom: 6,
          }}
        >
          "{QUOTES[idx].text}"
        </p>
        <p style={{ fontSize: 13, color: "#0e7490" }}>{QUOTES[idx].author}</p>
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          marginTop: 14,
        }}
      >
        {QUOTES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{
              height: 8,
              width: i === idx ? 22 : 8,
              borderRadius: 99,
              background: i === idx ? "#0e7490" : "#bae6fd",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
};

/* ── Poll Widget ── */
const PollWidget = () => {
  const [selected, setSelected] = useState(null);
  const [votes, setVotes] = useState([42, 35, 23]);

  const handleVote = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const next = [...votes];
    next[i] += 1;
    setVotes(next);
  };
  const total = votes.reduce((a, b) => a + b, 0);

  return (
    <div>
      {POLL_OPTIONS.map((opt, i) => {
        const pct = Math.round((votes[i] / total) * 100);
        return (
          <div
            key={i}
            onClick={() => handleVote(i)}
            style={{
              position: "relative",
              height: 38,
              borderRadius: 10,
              overflow: "hidden",
              background: "#f1f5f9",
              border: `1px solid ${selected === i ? POLL_COLORS[i] : "#e2e8f0"}`,
              cursor: "pointer",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: selected !== null ? `${pct}%` : "0%",
                background: POLL_COLORS[i],
                opacity: 0.18,
                transition: "width 0.8s ease",
              }}
            />
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                fontSize: 13,
                fontWeight: 500,
                color: "#0f172a",
              }}
            >
              {opt}
            </span>
            {selected !== null && (
              <span
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#64748b",
                }}
              >
                {pct}%
              </span>
            )}
          </div>
        );
      })}
      {selected === null ? (
        <p
          style={{
            fontSize: 12,
            color: "#94a3b8",
            textAlign: "center",
            marginTop: 6,
          }}
        >
          Click an option to vote
        </p>
      ) : (
        <p
          style={{
            fontSize: 12,
            color: "#0f766e",
            textAlign: "center",
            fontWeight: 600,
            marginTop: 6,
          }}
        >
          Thank you for participating!
        </p>
      )}
    </div>
  );
};

/* ── Styles ── */
const card = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: "1.4rem",
};
const sectionLabel = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  color: "#64748b",
  marginBottom: 14,
  marginTop: "2rem",
  display: "block",
};

/* ── Main Component ── */
const StudentDashboard = () => {
  const navigate = useNavigate();
  const {
    availableQuizzes = [],
    loading,
    error,
    fetchAvailableQuizzes,
    joinQuizByLink,
    resetQuiz,
  } = useStudentQuiz();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState(null);

  useEffect(() => {
    fetchAvailableQuizzes();
    resetQuiz();
  }, []);

  const handleTakeQuiz = async (quizLink, passcode) => {
    setJoinLoading(true);
    setJoinError(null);
    try {
      const result = await joinQuizByLink(quizLink, passcode);
      if (result.studentQuiz)
        navigate(`/student/quiz/take/${result.studentQuiz._id}`);
    } catch (err) {
      setJoinError(err.response?.data?.message || "Failed to join quiz");
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "inherit",
        color: "#1a1a2e",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 1rem 3rem",
      }}
    >
      {/* ── Hero ── */}
      <div
        style={{
          background: "#d6eef8",
          borderRadius: 0,
          padding: "3.5rem 3rem 0",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "2rem",
          overflow: "hidden",
          minHeight: 280,
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 540, paddingBottom: "3rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 99,
              padding: "4px 14px",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.5px",
              color: "#4a5568",
              marginBottom: 20,
              textTransform: "uppercase",
            }}
          >
            Student Portal
          </span>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 700,
              lineHeight: 1.18,
              color: "#0f172a",
              marginBottom: "1rem",
            }}
          >
            Learn, Reflect,
            <br />
            and Grow Together
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#475569",
              lineHeight: 1.7,
              marginBottom: "1.75rem",
              maxWidth: 440,
            }}
          >
            Participate in gender inclusivity quizzes and build awareness one
            question at a time.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => setShowJoinForm(true)}
              style={{
                background: "#1e3a5f",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "11px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Join a Quiz
            </button>
            <button
              onClick={() => navigate("/student/quiz/history")}
              style={{
                background: "transparent",
                color: "#1e3a5f",
                border: "1.5px solid #1e3a5f",
                borderRadius: 8,
                padding: "11px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              View History →
            </button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "flex-end",
            flexShrink: 0,
          }}
        >
          {[
            {
              label: "AVAILABLE",
              value: availableQuizzes.length,
              sub: "Quizzes ready",
              bg: "#1e3a5f",
              h: 190,
            },
            {
              label: "COMPLETED",
              value: 0,
              sub: "All time",
              bg: "#0f766e",
              h: 160,
            },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                background: c.bg,
                color: "#fff",
                borderRadius: "14px 14px 0 0",
                padding: "1rem 1.1rem 1.25rem",
                width: 155,
                minHeight: c.h,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>
                {c.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{c.value}</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Join Form ── */}
      {showJoinForm && (
        <div style={{ ...card, marginTop: "1.5rem", borderColor: "#bfdbfe" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3 style={{ margin: 0, color: "#1e3a5f", fontWeight: 700 }}>
              Join a Quiz
            </h3>
            <button
              onClick={() => setShowJoinForm(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                color: "#9ca3af",
              }}
            >
              ✕
            </button>
          </div>
          <QuizJoinForm
            onSubmit={handleTakeQuiz}
            loading={joinLoading}
            error={joinError}
          />
        </div>
      )}

      {/* ── Stats ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          marginTop: "2rem",
        }}
      >
        {[
          {
            label: "Available Quizzes",
            value: availableQuizzes.length,
            desc: "Ready to take",
          },
          { label: "Completed", value: 0, desc: "All time" },
          { label: "Average Score", value: "—", desc: "Across all quizzes" },
          { label: "Badges Earned", value: 2, desc: "Keep going" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: "1.1rem 1.25rem",
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
              {s.desc}
            </div>
          </div>
        ))}
      </div>

      {/* ── Quote ── */}
      <div style={{ marginTop: "2rem" }}>
        <QuoteCarousel />
      </div>

      {/* ── Quick Actions ── */}
      <span style={sectionLabel}>Quick Actions</span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={() =>
              a.label === "Join New Quiz"
                ? setShowJoinForm(true)
                : navigate(a.route)
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "1rem 1.25rem",
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              cursor: "pointer",
              textAlign: "left",
              transition: "transform 0.18s, box-shadow 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: a.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {a.icon}
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
              {a.label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Learning Highlights ── */}
      <span style={sectionLabel}>Learning Highlights</span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {TOPICS.map((t, i) => (
          <div
            key={t.title}
            style={{
              ...card,
              padding: "1.25rem",
              borderTop: `3px solid ${i % 2 === 0 ? "#1e3a5f" : "#0f766e"}`,
              transition: "transform 0.18s, box-shadow 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.07)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ marginBottom: 12 }}>{t.icon}</div>
            <p
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              {t.title}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#64748b",
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              {t.desc}
            </p>
            <button
              style={{
                background: "none",
                border: "1px solid #c7d7eb",
                color: "#1e3a5f",
                borderRadius: 7,
                padding: "5px 14px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Learn More →
            </button>
          </div>
        ))}
      </div>

      {/* ── Available Quizzes ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "2rem",
          marginBottom: 14,
        }}
      >
        <span style={{ ...sectionLabel, margin: 0 }}>Available Quizzes</span>
        <span
          style={{
            background: "#e0e7ef",
            color: "#1e3a5f",
            borderRadius: 99,
            padding: "2px 10px",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {availableQuizzes.length}
        </span>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div
          style={{
            ...card,
            background: "#fff1f2",
            borderColor: "#fda4af",
            color: "#be123c",
          }}
        >
          ⚠ {error}
        </div>
      ) : availableQuizzes.length === 0 ? (
        <div style={{ ...card, textAlign: "center", padding: "3rem" }}>
          <div style={{ marginBottom: 14 }}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="13" x2="13" y2="13" />
            </svg>
          </div>
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#475569",
              marginBottom: 6,
            }}
          >
            No quizzes available right now
          </p>
          <p style={{ fontSize: 13, color: "#94a3b8" }}>
            Check back later or ask your teacher for a link.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {availableQuizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} onTakeQuiz={handleTakeQuiz} />
          ))}
        </div>
      )}

      {/* ── Progress Tracker ── */}
      <span style={sectionLabel}>Progress Tracker</span>
      <div style={card}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              label: "Available Quizzes",
              value: availableQuizzes.length,
              max: 20,
              color: "#1e3a5f",
            },
            {
              label: "Completed",
              value: 0,
              max: availableQuizzes.length || 1,
              color: "#0f766e",
            },
            {
              label: "Average Score",
              value: 0,
              max: 100,
              color: "#1e3a5f",
              suffix: "%",
            },
          ].map((s) => (
            <div key={s.label}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 13, color: "#64748b" }}>
                  {s.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>
                  {s.value}
                  {s.suffix || ""}
                </span>
              </div>
              <div
                style={{
                  background: "#e2e8f0",
                  borderRadius: 99,
                  height: 7,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.round((s.value / s.max) * 100)}%`,
                    background: s.color,
                    height: "100%",
                    borderRadius: 99,
                    transition: "width 1.2s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Badges + Events ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 18,
          marginTop: "2rem",
        }}
      >
        <div style={card}>
          <span style={{ ...sectionLabel, marginTop: 0 }}>
            Achievement Badges
          </span>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {BADGES.map((b) => (
              <div
                key={b.label}
                style={{
                  textAlign: "center",
                  padding: "1rem 0.75rem",
                  borderRadius: 12,
                  border: `1px solid ${b.earned ? "#bfdbfe" : "#e2e8f0"}`,
                  background: b.earned ? "#f0f7ff" : "#f8fafc",
                  opacity: b.earned ? 1 : 0.5,
                  transition: "transform 0.18s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.04)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  {b.icon}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: b.earned ? "#1e40af" : "#64748b",
                  }}
                >
                  {b.label}
                </div>
                {b.earned && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "#0f766e",
                      fontWeight: 600,
                      marginTop: 4,
                    }}
                  >
                    Earned
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={card}>
          <span style={{ ...sectionLabel, marginTop: 0 }}>Upcoming Events</span>
          {EVENTS.map((ev) => (
            <div
              key={ev.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: 12,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                marginBottom: 10,
                transition: "transform 0.18s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateX(4px)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              <div
                style={{
                  minWidth: 46,
                  textAlign: "center",
                  background: "#1e3a5f",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "7px 5px",
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {ev.date.split(" ").map((w, i) => (
                  <div key={i}>{w}</div>
                ))}
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#0f172a",
                    marginBottom: 3,
                  }}
                >
                  {ev.title}
                </p>
                <span
                  style={{
                    fontSize: 11,
                    background: "#e0e7ef",
                    color: "#1e3a5f",
                    padding: "2px 8px",
                    borderRadius: 99,
                    fontWeight: 600,
                  }}
                >
                  {ev.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Poll ── */}
      <span style={sectionLabel}>Quick Poll</span>
      <div style={card}>
        <p
          style={{
            fontWeight: 700,
            fontSize: 16,
            color: "#0f172a",
            marginBottom: 18,
          }}
        >
          What creates inclusive classrooms?
        </p>
        <PollWidget />
      </div>

      {/* ── Footer CTA ── */}
      <div
        style={{
          marginTop: "2rem",
          borderRadius: 18,
          background: "#1e3a5f",
          padding: "2.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 10,
          }}
        >
          Together we create safer, inclusive learning spaces.
        </p>
        <p
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          Keep building awareness — every quiz brings us closer to
          understanding.
        </p>
        <button
          onClick={() => setShowJoinForm(true)}
          style={{
            background: "#fff",
            color: "#1e3a5f",
            border: "none",
            borderRadius: 10,
            padding: "12px 28px",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          + Join Another Quiz
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
