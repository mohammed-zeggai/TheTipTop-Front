import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Participer from "./pages/Participer";
import Admin from "./pages/Admin";
import Staff from "./pages/Staff";
import NotFoundPage from "./pages/NotFoundPage";
import Modifier from "./pages/Modifier";
import MentionsLegales from "./pages/MentionsLegales";
import SignupAdmin from "./pages/SignupAdmin";
const user = JSON.parse(localStorage.getItem("user"));
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      {user && user.access_level === 3 && (
        <Route path="/participer" element={<Participer />} />
      )}
      {user && <Route path="/participer/modifier" element={<Modifier />} />}
      {user && <Route path="/admin/modifier" element={<Modifier />} />}
      {user && <Route path="/staff/modifier" element={<Modifier />} />}
      {user && user.access_level === 1 && (
        <Route path="/admin" element={<Admin />} />
      )}
      {user && user.access_level === 1 && (
        <Route path="/admin/signup" element={<SignupAdmin />} />
      )}
      {user && user.access_level === 2 && (
        <Route path="/staff" element={<Staff />} />
      )}
      <Route path="/" element={<App />} />
      {!user && <Route path="signup" element={<Signup isSignUp={true} />} />}
      {!user && <Route path="login" element={<Signup isSignUp={false} />} />}
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/mentionslegales" element={<MentionsLegales />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
