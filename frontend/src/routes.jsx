import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

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
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
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
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
import {
  ServerStackIcon,
  RectangleStackIcon,
  UserGroupIcon,
  TableCellsIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { AdminDashboard, DoctorsList, AddDoctor, PatientDashboard } from "@/pages/dashboard";
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
  
  // Patient routes - show patient dashboard with tracking records
  if (userRole === "patient") {
    return [
      {
        layout: "dashboard",
        pages: [
          {
            icon: <ChartBarIcon {...icon} />,
            name: "My Health Tracking",
            path: "/patient",
            element: <PatientDashboard />,
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
