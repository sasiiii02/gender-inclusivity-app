import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import EnrolledStudentsTable from "../../components/teacher/EnrolledStudentsTable";
import * as trainingApi from "../../api/trainingApi";

const EnrolledStudentsPage = () => {
  console.log("[Training] EnrolledStudentsPage rendered");
  const { courseId: routeCourseId } = useParams();

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(routeCourseId || "");

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchCourses = async () => {
    setLoadingCourses(true);
    setError("");
    try {
      const res = await trainingApi.getAllCourses({ page: 1, limit: 100 });
      const fetchedCourses = res.data?.data?.courses || [];
      setCourses(fetchedCourses);

      if (!selectedCourseId && fetchedCourses.length > 0) {
        setSelectedCourseId(fetchedCourses[0]._id);
      }
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchStudents = async (id) => {
    if (!id) {
      setStudents([]);
      return;
    }
    setLoadingStudents(true);
    setError("");
    try {
      const res = await trainingApi.getStudentsByCourse(id);
      setStudents(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load enrolled students.");
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchStudents(selectedCourseId);
    } else {
      setStudents([]);
    }
  }, [selectedCourseId]);

  const filteredStudents = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    const normalizedStatus = statusFilter.toLowerCase();

    return students.filter((studentItem) => {
      const name = studentItem.student?.name || "";
      const email = studentItem.student?.email || "";
      const status = (studentItem.completionStatus || "In Progress").toLowerCase();

      const matchesKeyword = keyword
        ? `${name} ${email}`.toLowerCase().includes(keyword)
        : true;
      const matchesStatus =
        normalizedStatus === "all"
          ? true
          : normalizedStatus === "completed"
            ? status === "completed"
            : status !== "completed";

      return matchesKeyword && matchesStatus;
    });
  }, [students, searchTerm, statusFilter]);

  const studentStats = useMemo(() => {
    const total = students.length;
    const completed = students.filter(
      (studentItem) =>
        (studentItem.completionStatus || "").toLowerCase() === "completed"
    ).length;
    const inProgress = total - completed;
    const averageProgress = total
      ? Math.round(
        students.reduce(
          (sum, studentItem) => sum + (Number(studentItem.progress) || 0),
          0
        ) / total
      )
      : 0;

    return { total, completed, inProgress, averageProgress };
  }, [students]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          Training Module
        </h1>
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          Enrolled Students
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">
          View progress for learners enrolled in your courses.
        </p>
      </div>

      {error ? (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          ⚠️ {error}
        </div>
      ) : null}

      <div className="border border-stone-200 rounded-2xl bg-white p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-serif text-lg font-bold text-stone-900">
            Students
          </h2>

          <div className="flex items-center gap-3">
            {loadingCourses ? (
              <span className="text-sm text-stone-500">Loading courses...</span>
            ) : (
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="" disabled>Select a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            )}

            {!loadingCourses && !loadingStudents && (
              <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
                {studentStats.total} students
              </span>
            )}
          </div>
        </div>

        {!loadingStudents && selectedCourseId ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-stone-500">Total</p>
              <p className="text-lg font-bold text-stone-900">{studentStats.total}</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-green-700">Completed</p>
              <p className="text-lg font-bold text-green-800">{studentStats.completed}</p>
            </div>
            <div className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-violet-700">In Progress</p>
              <p className="text-lg font-bold text-violet-800">{studentStats.inProgress}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-amber-700">Avg. Progress</p>
              <p className="text-lg font-bold text-amber-800">{studentStats.averageProgress}%</p>
            </div>
          </div>
        ) : null}

        {!selectedCourseId && !loadingCourses ? (
          <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-5 text-center">
            Please select a course to view enrolled students.
          </div>
        ) : loadingStudents ? (
          <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-5 text-center">
            Fetching students…
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student name or email..."
                className="w-full sm:max-w-sm rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="all">All statuses</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              {(searchTerm.trim() || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="text-sm font-semibold text-amber-700 hover:text-amber-800"
                >
                  Clear filters
                </button>
              )}
            </div>
            {!filteredStudents.length ? (
              <div className="text-sm text-stone-600 bg-stone-50 border border-stone-200 rounded-2xl p-5 text-center">
                No students match your current filters.
              </div>
            ) : (
              <EnrolledStudentsTable students={filteredStudents} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EnrolledStudentsPage;

