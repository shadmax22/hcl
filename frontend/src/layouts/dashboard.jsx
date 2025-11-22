import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import { getRoutes, getUserRole } from "@/routes";
import { AddDoctor } from "@/pages/dashboard";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const [routes, setRoutes] = useState([]);
  const userRole = getUserRole();

  useEffect(() => {
    // Filter routes based on user role
    const filteredRoutes = getRoutes();
    setRoutes(filteredRoutes);
  }, []);

  // Redirect non-admin users
  if (userRole !== "admin") {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
        brandName="Admin Dashboard"
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route key={path} exact path={path} element={element} />
              ))
          )}
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
