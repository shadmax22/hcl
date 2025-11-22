import { AddDoctorModal } from "@/components/Doctors/AddDoctors";
import {
    ClipboardDocumentCheckIcon,
    UserGroupIcon,
    UserPlusIcon,
    UsersIcon
} from "@heroicons/react/24/outline";
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Typography
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import api from "../../../../axios.js";

export function AdminDashboard() {
    const [stats, setStats] = useState({
        total_doctors: 0,
        total_patients: 0,
        active_patients: 0,
    });
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            // Fetch statistics
            const statsResponse = await api.get("/v1/admin/statistics");
            if (statsResponse.data && statsResponse.data.statistics) {
                setStats({
                    total_doctors: statsResponse.data.statistics.doctors || 0,
                    total_patients: statsResponse.data.statistics.patients || 0,
                    active_patients: statsResponse.data.statistics.patients || 0,
                });
            }

            // Fetch doctors
            const doctorsResponse = await api.get("/v1/admin/doctors");
            if (doctorsResponse.data && doctorsResponse.data.doctors) {
                const doctorsList = doctorsResponse.data.doctors.slice(0, 3).map((doctor) => ({
                    name: doctor.user?.name || "N/A",
                    specialization: doctor.specialisation || "N/A",
                    email: doctor.user?.email || "N/A",
                    img: "/img/team-1.jpeg",
                }));
                setDoctors(doctorsList);
            }

            // Fetch all users (patients)
            const usersResponse = await api.get("/v1/admin/users");
            if (usersResponse.data && usersResponse.data.users) {
                const patientUsers = usersResponse.data.users
                    .filter((user) => user.role === "patient")
                    .slice(0, 3)
                    .map((user) => ({
                        name: user.name,
                        issue: "N/A",
                        email: user.email,
                        img: "/img/bruce-mars.jpeg",
                    }));
                setPatients(patientUsers);
            }
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const statisticsCards = [
        {
            color: "gray",
            icon: UsersIcon,
            title: "Total Doctors",
            value: stats.total_doctors,
        },
        {
            color: "gray",
            icon: UserGroupIcon,
            title: "Total Patients",
            value: stats.total_patients,
        },
        {
            color: "gray",
            icon: ClipboardDocumentCheckIcon,
            title: "Active Patients",
            value: stats.active_patients,
        },
    ];

    const recent_patients = patients.slice(0, 2).map((patient, index) => ({
        name: patient.name,
        age: 25,
        img: "/img/team-1.jpeg",
        date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }),
    }));



    // --------------------------------------------------------------------------

    return (
        <div className="mt-12">
            {/* ---------------------------------------------------------------------- */}
            {/* STATISTICS CARDS */}
            {/* ---------------------------------------------------------------------- */}
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
                {statisticsCards.map(({ icon, title, value }) => (
                    <Card
                        key={title}
                        className="border border-blue-gray-100 shadow-sm p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography variant="h6" color="blue-gray">
                                    {title}
                                </Typography>
                                <Typography variant="h4" color="blue-gray" className="mt-2">
                                    {value}
                                </Typography>
                            </div>
                            {React.createElement(icon, {
                                className: "w-10 h-10 text-blue-500",
                            })}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* ---------------------------------------------------------------------- */}
                {/* DOCTORS LIST */}
                {/* ---------------------------------------------------------------------- */}
                <Card className="xl:col-span-2 border border-blue-gray-100 shadow-sm">
                    <CardHeader
                        floated={false}
                        shadow={false}
                        color="transparent"
                        className="m-0 flex items-center justify-between p-6"
                    >
                        <div>
                            <Typography variant="h6" color="blue-gray">
                                Doctors List
                            </Typography>
                            <Typography variant="small" className="text-blue-gray-600">
                                Total {stats.total_doctors} registered doctors
                            </Typography>
                        </div>

                        <Button color="blue" size="sm" className="flex items-center gap-2" onClick={AddDoctorModal} >
                            <UserPlusIcon className="h-4 w-4" /> Add New Doctor
                        </Button>
                    </CardHeader>

                    <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {["Doctor", "Specialization", "Email"].map((el) => (
                                        <th
                                            key={el}
                                            className="border-b border-blue-gray-50 py-3 px-6 text-left"
                                        >
                                            <Typography
                                                variant="small"
                                                className="text-[11px] font-medium uppercase text-blue-gray-400"
                                            >
                                                {el}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="py-3 px-6 text-center">
                                            <Typography variant="small" color="blue-gray">
                                                Loading doctors...
                                            </Typography>
                                        </td>
                                    </tr>
                                ) : doctors.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-3 px-6 text-center">
                                            <Typography variant="small" color="blue-gray">
                                                No doctors found
                                            </Typography>
                                        </td>
                                    </tr>
                                ) : (
                                    doctors.map(
                                        ({ name, specialization, email, img }, index) => (
                                            <tr key={index}>
                                                <td className="py-3 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar src={img} alt={name} size="sm" />
                                                        <Typography className="font-normal" color="blue-gray">
                                                            {name}
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6">{specialization}</td>
                                                <td className="py-3 px-6">{email}</td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>

                {/* ---------------------------------------------------------------------- */}
                {/* RECENT PATIENTS */}
                {/* ---------------------------------------------------------------------- */}
                <Card className="border border-blue-gray-100 shadow-sm">
                    <CardHeader floated={false} shadow={false} className="p-6">
                        <Typography variant="h6" color="blue-gray">
                            Recent Patients Onboarded
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-600">
                            New patients added this week
                        </Typography>
                    </CardHeader>

                    <CardBody className="pt-0">
                        {loading ? (
                            <Typography variant="small" color="blue-gray" className="text-center py-3">
                                Loading...
                            </Typography>
                        ) : recent_patients.length === 0 ? (
                            <Typography variant="small" color="blue-gray" className="text-center py-3">
                                No recent patients
                            </Typography>
                        ) : (
                            recent_patients.map(
                                ({ name, age, img, date }, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 border-b border-blue-gray-50 py-3 last:border-none"
                                    >
                                        <Avatar src={img} alt={name} size="sm" />
                                        <div>
                                            <Typography variant="small" color="blue-gray">
                                                {name}
                                            </Typography>
                                            <Typography className="text-xs text-blue-gray-500">
                                                Age {age} • {date}
                                            </Typography>
                                        </div>
                                    </div>
                                )
                            )
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* ---------------------------------------------------------------------- */}
            {/* ALL PATIENTS LIST */}
            {/* ---------------------------------------------------------------------- */}
            <div className="mt-12">
                <Card className="border border-blue-gray-100 shadow-sm">
                    <CardHeader floated={false} shadow={false} className="p-6">
                        <Typography variant="h6" color="blue-gray" className="mb-2">
                            All Patients
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-600">
                            Total {stats.total_patients} registered patients
                        </Typography>
                    </CardHeader>

                    <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {["Name", "Issue", "Email"].map((h) => (
                                        <th
                                            key={h}
                                            className="border-b border-blue-gray-50 py-3 px-6 text-left"
                                        >
                                            <Typography
                                                variant="small"
                                                className="text-[11px] font-medium uppercase text-blue-gray-400"
                                            >
                                                {h}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="py-3 px-6 text-center">
                                            <Typography variant="small" color="blue-gray">
                                                Loading patients...
                                            </Typography>
                                        </td>
                                    </tr>
                                ) : patients.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-3 px-6 text-center">
                                            <Typography variant="small" color="blue-gray">
                                                No patients found
                                            </Typography>
                                        </td>
                                    </tr>
                                ) : (
                                    patients.map(
                                        ({ name, issue, email, img }, index) => (
                                            <tr key={index}>
                                                <td className="py-3 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar src={img} alt={name} size="sm" />
                                                        <Typography color="blue-gray">{name}</Typography>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6">{issue}</td>
                                                <td className="py-3 px-6">{email}</td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default AdminDashboard;
