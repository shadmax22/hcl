import { Notifications, PatientPrescription } from "@/pages/dashboard";
import {
  HomeIcon,
  InformationCircleIcon,
  UserCircleIcon
} from "@heroicons/react/24/solid";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import { PatientsProfiles } from "./components/Patients/PatientsProfiles";
import { Home, PatientPrescription, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import SignUpPatient from "./pages/auth/patient/sign-up";
import HealthTrackerForm from "./pages/dashboard/healthTrackerForm";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <AdminDashboard />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "patients",
        path: "/patients",
        element: <PatientsProfiles />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },

    ],
  }
];

export default routes;
