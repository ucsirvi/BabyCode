import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { StudentProvider } from './context/StudentContext';
import ProtectedRoute from './components/ProtectedRoute';
import StudentList from './pages/StudentList';
import StudentDetail from './pages/StudentDetail';
import AddStudent from './pages/AddStudent';
import Login from './pages/Login';
import Register from './pages/Register';
import MobileNav from './components/MobileNav';
import Layout from './components/layout/Layout';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <StudentProvider>
            <Layout>

              <MobileNav
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
              />

              <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <StudentList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/students/:id"
                    element={
                      <ProtectedRoute>
                        <StudentDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/new"
                    element={
                      <ProtectedRoute>
                        <AddStudent />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </main>
            </Layout>

            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </StudentProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
