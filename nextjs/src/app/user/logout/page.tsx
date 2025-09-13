import React from "react";
import AutoLogout from "@/components/user/Logout";

const LogoutPage: React.FC = () => {
  return <AutoLogout delay={3} redirectTo="/" />;
};

export default LogoutPage;
