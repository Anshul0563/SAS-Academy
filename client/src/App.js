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
import AdminUsers from "./Pages/admin/adminUsers";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminResults from "./pages/admin/AdminResults";
import AdminSettings from "./pages/admin/AdminSettings";

import AddTest from "./Pages/admin/AddTest";
import AdminTests from "./Pages/admin/AdminTests";
import EditTest from "./Pages/admin/EditTest";
import StatsCard from "./components/admin/StatsCard";

// Layout
import Layout from "./components/Layout";

// Context
import { ExamProvider } from "./context/ExamContext";
import ForgotPassword from "./Pages/ForgotPassword";

// 🔐 USER PROTECT - Separate token
const UserPrivateRoute = ({ children }) => {
  const userToken = localStorage.getItem("userToken");
  return userToken ? children : <Navigate to="/" />;
};

// 🔐 ADMIN PROTECT - Separate token
const AdminPrivateRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  const adminUser = adminToken ? JSON.parse(localStorage.getItem("adminUser") || '{}') : {};
  return adminToken && adminUser.role === "admin" ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <ExamProvider>
      <Router>
        <Routes>

          {/* PUBLIC AUTH */}
          <Route path="/" element={<Auth />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* RESULT */}
          <Route path="/result" element={<Result />} />

          {/* USER PANEL - Separate token */}
          <Route element={
            <UserPrivateRoute>
              <Layout />
            </UserPrivateRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dictations" element={<DictationList />} />
            <Route path="/transcription" element={<TranscriptionList />} />
            <Route path="/typing-settings/:id" element={<TestSettings />} />
            <Route path="/transcription-view/:id" element={<TranscriptionView />} />
          </Route>

          {/* TYPING TEST */}
          <Route path="/typing/:id" element={
            <UserPrivateRoute>
              <TypingTest />
            </UserPrivateRoute>
          } />

          {/* DICTATION PLAYER */}
          <Route path="/dictation/:id" element={
            <UserPrivateRoute>
              <DictationPlayer />
            </UserPrivateRoute>
          } />

          {/* ADMIN PANEL - Completely isolated */}
          <Route element={
            <AdminPrivateRoute>
              <AdminLayout />
            </AdminPrivateRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="tests" element={<AdminTests />} />
            <Route path="add-test" element={<AddTest />} />
            <Route path="edit-test/:id" element={<EditTest />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="results" element={<AdminResults />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>


          {/* CATCH ALL */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Router>
    </ExamProvider>
  );
}

export default App;
