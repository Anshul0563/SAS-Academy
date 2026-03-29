import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// Auth
import Auth from "./Pages/Auth";
import AdminLogin from "./Pages/AdminLogin";
import AdminRegister from "./Pages/AdminRegister";

// Student Pages
import Dashboard from "./Pages/Dashboard";
import TypingTest from "./Pages/TypingTest";
import Result from "./Pages/Result";
import DictationList from "./Pages/DictationList";
import TranscriptionList from "./Pages/TranscriptionList";
import DictationPlayer from "./Pages/DictationPlayer";
import TestSettings from "./Pages/TestSettings";
import TranscriptionView from "./Pages/TranscriptionView";

// Admin Pages
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AddTest from "./Pages/admin/AddTest";
import AdminTests from "./Pages/admin/AdminTests";
import EditTest from "./Pages/admin/EditTest";

// Layout
import Layout from "./components/Layout";

// Context
import { ExamProvider } from "./context/ExamContext";
import ForgotPassword from "./Pages/ForgotPassword";


// 🔐 USER PROTECT
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};


// 🔐 ADMIN PROTECT
const AdminRoute = ({ children }) => {
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch { }

  return user?.role === "admin"
    ? children
    : <Navigate to="/dashboard" />;
};


function App() {
  return (
    <ExamProvider>
      <Router>
        <Routes>

          {/* AUTH */}
          <Route path="/" element={<Auth />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />

          {/* RESULT */}
          <Route path="/result" element={<Result />} />


          {/* USER WITH LAYOUT */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dictations" element={<DictationList />} />
            <Route path="/transcription" element={<TranscriptionList />} />
            <Route path="/typing-settings/:id" element={<TestSettings />} />
            <Route path="/transcription-view/:id" element={<TranscriptionView />} />
          </Route>


          {/* TYPING TEST */}
          <Route
            path="/typing/:id"
            element={
              <PrivateRoute>
                <TypingTest />
              </PrivateRoute>
            }
          />


          {/* DICTATION PLAYER */}
          <Route
            path="/dictation/:id"
            element={
              <PrivateRoute>
                <DictationPlayer />
              </PrivateRoute>
            }
          />


          {/* ADMIN DASHBOARD */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </PrivateRoute>
            }
          />


          {/* ADD TEST */}
          <Route
            path="/admin/add-test"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <AddTest />
                </AdminRoute>
              </PrivateRoute>
            }
          />


          {/* ALL TESTS */}
          <Route
            path="/admin/tests"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <AdminTests />
                </AdminRoute>
              </PrivateRoute>
            }
          />


          {/* EDIT TEST */}
          <Route
            path="/admin/edit-test/:id"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <EditTest />
                </AdminRoute>
              </PrivateRoute>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Router>
    </ExamProvider>
  );
}

export default App;