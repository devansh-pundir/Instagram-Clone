import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const Private = () => {
  const check = localStorage.getItem("User");
  return check ? <Outlet /> : <Navigate to="/register" />;
};

export default Private;
