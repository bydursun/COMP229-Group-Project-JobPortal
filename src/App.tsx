import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ManageJobs from './pages/ManageJobs';
import MyApplications from './pages/MyApplications';
import EmployerApplications from './pages/EmployerApplications';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/jobs"
                element={
                  <ProtectedRoute requiredRole="employer">
                    <ManageJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <ProtectedRoute requiredRole="jobseeker">
                    <MyApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications/manage"
                element={
                  <ProtectedRoute requiredRole="employer">
                    <EmployerApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
