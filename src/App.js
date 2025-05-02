import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import Loader from "./components/Loader/Loader";

import "./App.css";

import ScrollToTop from "./components/ScrollTop";
import { useCRMRoutes } from "./components/RootList/CRMRootList";
import { InventoryRootList } from "./components/RootList/InventoryRootList";
import { QuotationRootList } from "./components/RootList/QuotationRootList";
import { StakeHoldersRootList } from "./components/RootList/StakeholdersRootList";
import { HRMRootList } from "./components/RootList/HRMRootList";
import { ProjectRootList } from "./components/RootList/ProjectRootList";
import { UtilsRootList } from "./components/RootList/UtilsRootList";
import { AccountsRootList } from "./components/RootList/AccountsRootList";
import { getUserLocalStorage } from "./utils/utils";
import { WhatsappRootList } from "./components/RootList/WhatsappList";

const RootLayout = lazy(() => import("./layouts/RootLayout"));
const UserLayout = lazy(() => import("./layouts/UserLayout"));
const Login = lazy(() => import("./pages/Login/Login"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));

const ForgotPassword = lazy(() =>
  import("./pages/ForgotPassword/ForgotPassword")
);
const Uicomponents = lazy(() => import("./pages/Uipage/Uicomponents"));
const ErrorPage = lazy(() => import("./UI/Error/Error"));
const Forbidden = lazy(() => import("./UI/Error/ErrorForbidden"));
const Unauthorized = lazy(() => import("./UI/Error/Unauthorized"));
const ServerError = lazy(() => import("./UI/Error/ServerError"));

function App() {
  const crmRoutes = useCRMRoutes();

  const [allowedModules, setAllowedModules] = useState([]);

useEffect(() => {
  const { token, userInfo } = getUserLocalStorage();
  
  setAllowedModules([...(userInfo?.module || []),
  // "Quotation"
   
  ]);
}, []);
console.log("userInfo",allowedModules);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />, 
      children: [
        {
          index: true,
          element: <Login />,
        },
        {
          path: "auth",
          element: <AuthLayout />,
          children: [
            {
              index: true,
              element: <Login />,
            },
            {
              path: "forgot-password",
              element: <ForgotPassword />,
            },
          ],
        },
        {
          path: "user",
          element: <UserLayout />,
          children: [ 
            { index: true, element: <Dashboard /> },
            allowedModules.includes("CRM") && { ...crmRoutes },
            allowedModules.includes("Inventory") && { ...InventoryRootList },
            allowedModules.includes("Accounts") && { ...AccountsRootList },
            allowedModules.includes("Quotation") && { ...QuotationRootList },
            allowedModules.includes("StakeHolders") && { ...StakeHoldersRootList },
            allowedModules.includes("HRM") && { ...HRMRootList },
            allowedModules.includes("Project") && { ...ProjectRootList },
            allowedModules.includes("Utils") && { ...UtilsRootList },
            allowedModules.includes("Whatsapp") && { ...WhatsappRootList },

            { path: "Uicomponents", element: <Uicomponents /> },
            { path: "forbidden", element: <Forbidden /> },
            { path: "unauthorized", element: <Unauthorized /> },
            { path: "servererror", element: <ServerError /> },
          ].filter(Boolean), // Remove `false` values from array
        },
      ],
    },
  ]);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router}>
          {/* Ensure ScrollToTop is within Router context */}
          <ScrollToTop />
        </RouterProvider>
      </Suspense>
    </>
  );
}
export default App;
