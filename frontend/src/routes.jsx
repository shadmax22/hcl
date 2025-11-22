import {
  ServerStackIcon,
  RectangleStackIcon,
  UserGroupIcon,
  TableCellsIcon,
} from "@heroicons/react/24/solid";
import { AdminDashboard, DoctorsList, AddDoctor } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import SignUpPatient from "./pages/auth/patient/sign-up";

const icon = {
  className: "w-5 h-5 text-inherit",
};

// Helper function to get user role from localStorage
export const getUserRole = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role || null;
    }
  } catch (error) {
    console.error("Error getting user role:", error);
  }
  return null;
};

// Get filtered routes based on user role
export const getRoutes = () => {
  const userRole = getUserRole();
  
  // Admin routes - show admin dashboard and doctors list
  if (userRole === "admin") {
    return [
      {
        layout: "dashboard",
        pages: [
          {
            icon: <UserGroupIcon {...icon} />,
            name: "Dashboard",
            path: "/admin",
            element: <AdminDashboard />,
          },
          {
            icon: <TableCellsIcon {...icon} />,
            name: "Doctors List",
            path: "/doctors",
            element: <DoctorsList />,
          },
        ],
      },
    ];
  }
  
  // Default: no dashboard routes (or you can add other roles here)
  return [
    {
      layout: "dashboard",
      pages: [],
    },
  ];
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Dashboard",
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Doctors List",
        path: "/doctors",
        element: <DoctorsList />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/patients/signup",
        element: <SignUpPatient />,
      },
    ],
  },
];

export default routes;
