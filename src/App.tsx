import { Route, Routes } from 'react-router-dom';
import { StudentSessionProvider } from './context/StudentSessionContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <StudentSessionProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </StudentSessionProvider>
  );
}

export default App
