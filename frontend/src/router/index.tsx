import { createBrowserRouter } from "react-router-dom";

import AuthPage from "@/pages/AuthPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import MyCardsCreatePage from "@/pages/MyCardsCreatePage";
import MyCardsEditPage from "@/pages/MyCardsEditPage";
import MyCardsLayout from "@/pages/MyCardsLayout";
import MyCardsPage from "@/pages/MyCardsPage";
import NotFoundPage from "@/pages/NotFound";
import SettingsPage from "@/pages/SettingsPage";
import { PrivateRoute } from "@/components/PrivateRoute";

import { PATHS } from "./paths";

export const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        ),
      },
      {
        path: PATHS.LOGIN,
        element: <LoginPage />,
      },
      {
        path: PATHS.AUTH,
        element: <AuthPage />,
      },
      {
        path: PATHS.SETTINGS,
        element: (
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        ),
      },
      {
        path: PATHS.MY_CARDS,
        element: (
          <PrivateRoute>
            <MyCardsLayout />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <MyCardsPage />,
          },
          {
            path: PATHS.MY_CARDS_CREATE,
            element: <MyCardsCreatePage />,
          },
          {
            path: PATHS.MY_CARDS_EDIT,
            element: <MyCardsEditPage />,
          },
        ],
      },
      {
        path: PATHS.NOT_FOUND,
        element: <NotFoundPage />,
      },
    ],
  },
]);
