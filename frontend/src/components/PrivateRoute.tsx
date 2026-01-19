import { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "@/services/authService";

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();

  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};