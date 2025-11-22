import {
    ClipboardDocumentCheckIcon,
    UserGroupIcon,
    UsersIcon
} from "@heroicons/react/24/outline";

import {
    Avatar,
    Card,
    CardBody,
    CardHeader,
    Typography
} from "@material-tailwind/react";

import React, { useState, useEffect } from "react";
import api from "../../../../axios.js";

export function DoctorDashboard() {
    const [doctor, setDoctor] = useState({
        name: "Dr. Unknown",
        specialization: "N/A",
        email: "N/A",
        img: "/img/team-1.jpeg",
    });
    const [stats, setStats] = useState({
        assigned_patients: 0,
        total_patients: 0,
        active_patients: 0,
    });
    const [assignedPatients, setAssignedPatients] = useState([]);
    const [allPatients, setAllPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            // Fetch doctor profile
            const profileResponse = await api.get("/v1/doctor/profile");
            if (profileResponse.data && profileResponse.data.user) {
                setDoctor({
                    name: profileResponse.data.user.name || "Dr. Unknown",
                    specialization: profileResponse.data.provider?.specialisation || "N/A",
                    email: profileResponse.data.user.email || "N/A",
                    img: "/img/team-1.jpeg",
                });
            }

            // Fetch assigned patients
            const patientsResponse = await api.get("/v1/doctor/patients");
            if (patientsResponse.data && patientsResponse.data.patients) {
                const patients = patientsResponse.data.patients;
                setStats({
                    assigned_patients: patients.length,
                    total_patients: patients.length,
                    active_patients: patients.filter((p) => p.stat === "active").length,
                });

                const formattedPatients = patients.slice(0, 3).map((patient) => ({
                    name: patient.name,
                    age: patient.DOB ? new Date().getFullYear() - new Date(patient.DOB).getFullYear() : 25,
                    issue: "N/A",
                    img: "/img/bruce-mars.jpeg",
                    last_visit: patient.created_at
                        ? new Date(patient.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                          })
                        : "N/A",
                }));
                setAssignedPatients(formattedPatients);

                const allFormatted = patients.map((patient) => ({
                    name: patient.name,
                    issue: "N/A",
                    email: patient.email,
                    img: "/img/team-1.jpeg",
                }));
                setAllPatients(allFormatted);
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
            icon: UserGroupIcon,
            title: "Assigned Patients",
            value: stats.assigned_patients,
        },
        {
            color: "gray",
            icon: UsersIcon,
            title: "All Patients",
            value: stats.total_patients,
        },
        {
            color: "gray",
            icon: ClipboardDocumentCheckIcon,
            title: "Active Cases",
            value: stats.active_patients,
        },
    ];

    const active_patients = assignedPatients.slice(0, 3).map((patient) => ({
        name: patient.name,
        issue: "N/A",
        time: "Currently Under Treatment",
        img: patient.img,
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
                {/* ASSIGNED PATIENTS */}
                {/* ---------------------------------------------------------------------- */}
                <Card className="xl:col-span-2 border border-blue-gray-100 shadow-sm">
                    <CardHeader floated={false} shadow={false} className="p-6 flex justify-between">
                        <div>
                            <Typography variant="h6" color="blue-gray">
                                Assigned Patients
                            </Typography>
                            <Typography variant="small" className="text-blue-gray-600">
                                Patients assigned to you for primary care
                            </Typography>
                        </div>
                    </CardHeader>

                    <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {["Name", "Issue", "Last Visit"].map((h) => (
                                        <th key={h} className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                            <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
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
                                ) : assignedPatients.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-3 px-6 text-center">
                                            <Typography variant="small" color="blue-gray">
                                                No assigned patients
                                            </Typography>
                                        </td>
                                    </tr>
                                ) : (
                                    assignedPatients.map(({ name, age, issue, img, last_visit }, index) => (
                                        <tr key={index}>
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-4">
                                                    <Avatar src={img} alt={name} size="sm" />
                                                    <div>
                                                        <Typography color="blue-gray">{name}</Typography>
                                                        <Typography className="text-xs text-blue-gray-500">
                                                            Age {age}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3 px-6">{issue}</td>
                                            <td className="py-3 px-6">{last_visit}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>

                {/* ---------------------------------------------------------------------- */}
                {/* ACTIVE PATIENTS */}
                {/* ---------------------------------------------------------------------- */}
                <Card className="border border-blue-gray-100 shadow-sm">
                    <CardHeader floated={false} shadow={false} className="p-6">
                        <Typography variant="h6" color="blue-gray">
                            Active Patients
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-600">
                            Patients currently under active treatment
                        </Typography>
                    </CardHeader>

                    <CardBody className="pt-0">
                        {loading ? (
                            <Typography variant="small" color="blue-gray" className="text-center py-3">
                                Loading...
                            </Typography>
                        ) : active_patients.length === 0 ? (
                            <Typography variant="small" color="blue-gray" className="text-center py-3">
                                No active patients
                            </Typography>
                        ) : (
                            active_patients.map(({ name, issue, time, img }, index) => (
                                <div key={index} className="flex items-center gap-4 border-b border-blue-gray-50 py-3 last:border-none">
                                    <Avatar src={img} size="sm" />
                                    <div>
                                        <Typography variant="small" color="blue-gray">
                                            {name}
                                        </Typography>
                                        <Typography className="text-xs text-blue-gray-500">
                                            {issue} • {time}
                                        </Typography>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardBody>
                </Card>

            </div>

            {/* ---------------------------------------------------------------------- */}
            {/* ALL PATIENTS */}
            {/* ---------------------------------------------------------------------- */}
            <div className="mt-12">
                <Card className="border border-blue-gray-100 shadow-sm">
                    <CardHeader floated={false} shadow={false} className="p-6">
                        <Typography variant="h6" color="blue-gray" className="mb-2">
                            All Patients
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-600">
                            Complete patient directory
                        </Typography>
                    </CardHeader>

                    <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {["Name", "Issue", "Email"].map((h) => (
                                        <th key={h} className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                            <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
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
                                ) : allPatients.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-3 px-6 text-center">
                                            <Typography variant="small" color="blue-gray">
                                                No patients found
                                            </Typography>
                                        </td>
                                    </tr>
                                ) : (
                                    allPatients.map(({ name, issue, email, img }, index) => (
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </div>

        </div>
    );
}

export default DoctorDashboard;