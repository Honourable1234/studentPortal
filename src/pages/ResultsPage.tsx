import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentSession } from '../context/useStudentSession';

const gradeFor = (score: number): string => {
  if (score >= 70) return 'A';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 45) return 'D';
  return 'F';
};

const scoreColor = (score: number): string => {
  if (score >= 70) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 50) return 'text-yellow-600';
  if (score >= 45) return 'text-orange-500';
  return 'text-red-600';
};

const ResultsPage = () => {
  const { student, logout } = useStudentSession();
  const navigate = useNavigate();

  const average = useMemo(() => {
    if (!student || student.courses.length === 0) return 0;
    const total = student.courses.reduce((sum, course) => sum + course.score, 0);
    return total / student.courses.length;
  }, [student]);

  if (!student) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Welcome, {student.name}</h1>
            <p className="text-sm text-gray-500">Matric Number: {student.matric_number}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>

        <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">Course Name</th>
                <th className="px-4 py-2 font-medium text-gray-700">Score</th>
                <th className="px-4 py-2 font-medium text-gray-700">Grade</th>
              </tr>
            </thead>
            <tbody>
              {student.courses.map((course, index) => (
                <tr key={`${course.course_name}-${index}`} className="border-t border-gray-200">
                  <td className="px-4 py-2 text-gray-900">{course.course_name}</td>
                  <td className={`px-4 py-2 font-medium ${scoreColor(course.score)}`}>{course.score}</td>
                  <td className={`px-4 py-2 font-medium ${scoreColor(course.score)}`}>{gradeFor(course.score)}</td>
                </tr>
              ))}
              {student.courses.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                    No courses recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm font-medium text-gray-700">
          Overall Average: {average.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ResultsPage;
