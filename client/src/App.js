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
import Settings from "./Pages/Settings";
import TypingLearning from "./Pages/typingLearning/TypingLearning";
import AdminLayout from "./components/admin/AdminLayout.jsx.js";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx.js";
import AdminStudents from "./pages/admin/AdminStudents.jsx.js";
import AdminResults from "./pages/admin/AdminResults.jsx.js";
import AdminSettings from "./pages/admin/AdminSettings.jsx.js";


import AddTest from "./Pages/admin/AddTest";
import AdminTests from "./Pages/admin/AdminTests";
import EditTest from "./Pages/admin/EditTest";

// Layout
import Layout from "./components/Layout";

// Context
import { ExamProvider } from "./context/ExamContext";
import { getAdminAuthToken, getStoredAdminUser, getUserAuthToken } from "./utils/authStorage";


// 🔐 USER PROTECT - Separate token
const UserPrivateRoute = ({ children }) => {
  const userToken = getUserAuthToken();
  return userToken ? children : <Navigate to="/" />;
};

// 🔐 ADMIN PROTECT - Separate token
const AdminPrivateRoute = ({ children }) => {
  const adminToken = getAdminAuthToken();
  const adminUser = adminToken ? getStoredAdminUser() : {};
  return adminToken && adminUser.role === "admin" ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <ExamProvider>
      <Router>
        <Routes>

          {/* PUBLIC AUTH (separate user + admin) */}
          <Route path="/" element={<Auth />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />

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
            <Route path="/typing-learning" element={<TypingLearning />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* TYPING TEST */}
          <Route path="/typing/:id" element={
            <UserPrivateRoute>
              <TypingTest />
            </UserPrivateRoute>
          } />

          {/* RESULT */}
          <Route path="/result" element={
            <UserPrivateRoute>
              <Result />
            </UserPrivateRoute>
          } />

          {/* DICTATION PLAYER */}
          <Route path="/dictation/:id" element={
            <UserPrivateRoute>
              <DictationPlayer />
            </UserPrivateRoute>
          } />

          {/* ADMIN PANEL - Completely isolated */}
          <Route path="/admin" element={
            <AdminPrivateRoute>
              <AdminLayout />
            </AdminPrivateRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="tests" element={<AdminTests />} />
            <Route path="add-test" element={<AddTest />} />
            <Route path="edit-test/:id" element={<EditTest />} />
            <Route path="users" element={<AdminStudents />} />
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
