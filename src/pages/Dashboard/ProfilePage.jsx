// src/pages/Dashboard/ProfilePage.jsx
import React from "react";
import DashboardLayout from "../../components/DasboardGeneral/DashboardLayout";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../../utils/api";

export default function ProfilePage() {
  const user = getUser();
  const navigate = useNavigate();

  return (
    <DashboardLayout
      user={user}
      onProfile={() => navigate("/dashboard/profile")}
      onLogout={() => { clearAuth(); navigate("/login"); }}
      onNavigate={navigate}
    >
      <Profile />
    </DashboardLayout>
  );
}