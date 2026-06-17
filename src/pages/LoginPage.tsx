import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findStudentByName } from '../api/students';
import { useStudentSession } from '../context/useStudentSession';

const LoginPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useStudentSession();
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const student = await findStudentByName(firstName, lastName);
      if (student) {
        login(student);
        navigate('/results');
      } else {
        setError('No student found with that name. Check spelling and try again.');
      }
    } catch {
      setError('Something went wrong while looking up your results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#3b1a4a] via-[#6b1a2a] to-[#1a1a6b]">
      {/* Blurred colour blobs for depth */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-72 w-72 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-700/40 blur-3xl" />

      {/* Glass card */}
      <div className="relative w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 px-10 py-10 shadow-2xl backdrop-blur-md">

        {/* Avatar */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/30">
          <svg className="h-14 w-14 text-white/60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div className="flex items-center gap-3 border-b border-white/40 pb-2">
            <svg className="h-5 w-5 shrink-0 text-white/60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-white placeholder-white/50 outline-none"
            />
          </div>

          {/* Last Name */}
          <div className="flex items-center gap-3 border-b border-white/40 pb-2">
            <svg className="h-5 w-5 shrink-0 text-white/60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0v2z"/>
            </svg>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-white placeholder-white/50 outline-none"
            />
          </div>

          {error && (
            <p className="text-center text-xs text-red-300">{error}</p>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-gradient-to-r from-purple-700 to-blue-600 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg transition hover:from-purple-600 hover:to-blue-500 disabled:opacity-60"
          >
            {loading ? 'Checking...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
