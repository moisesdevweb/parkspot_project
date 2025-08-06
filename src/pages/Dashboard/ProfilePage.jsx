// src/pages/Dashboard/ProfilePage.jsx
import React from "react";
import DashboardLayout from "../../components/DasboardGeneral/DashboardLayout";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <DashboardLayout
      user={user}
      onProfile={() => navigate("/dashboard/profile")}
      onLogout={() => { /* lógica logout */ navigate("/login"); }}
      onNavigate={navigate}
    >
      <Profile />
    </DashboardLayout>
  );
}