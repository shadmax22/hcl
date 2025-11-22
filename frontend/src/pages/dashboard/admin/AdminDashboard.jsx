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
import React from "react";

export function AdminDashboard() {
    // --------------------------------------------------------------------------
    // ALL ADMIN DATA FROM ONE SOURCE
    // --------------------------------------------------------------------------
    const admin_data = {
        stats: {
            total_doctors: 42,
            total_patients: 1080,
            active_patients: 860,
        },

        doctors: [
            {
                name: "Dr. Ritesh Sharma",
                specialization: "Cardiologist",
                email: "ritesh@hospital.com",
                img: "/img/team-1.jpeg",
            },
            {
                name: "Dr. Meera Patel",
                specialization: "Dermatologist",
                email: "meera@hospital.com",
                img: "/img/team-2.jpeg",
            },
            {
                name: "Dr. Sanjay Gupta",
                specialization: "Neurologist",
                email: "sanjay@hospital.com",
                img: "/img/team-3.jpeg",
            },
        ],

        patients: [
            {
                name: "Rahul Verma",
                issue: "Chest Pain",
                email: "rahul@gmail.com",
                img: "/img/bruce-mars.jpeg",
            },
            {
                name: "Sara Khan",
                issue: "Fever & Cough",
                email: "sara@gmail.com",
                img: "/img/team-4.jpeg",
            },
            {
                name: "Mohit Yadav",
                issue: "Back Pain",
                email: "mohit@gmail.com",
                img: "/img/team-2.jpeg",
            },
        ],

        recent_patients: [
            {
                name: "Aman Gupta",
                age: 25,
                img: "/img/team-1.jpeg",
                date: "22 Nov 2025",
            },
            {
                name: "Priya Sharma",
                age: 30,
                img: "/img/team-3.jpeg",
                date: "21 Nov 2025",
            },
        ],
    };

    const statisticsCards = [
        {
            color: "gray",
            icon: UsersIcon,
            title: "Total Doctors",
            value: admin_data.stats.total_doctors,
        },
        {
            color: "gray",
            icon: UserGroupIcon,
            title: "Total Patients",
            value: admin_data.stats.total_patients,
        },
        {
            color: "gray",
            icon: ClipboardDocumentCheckIcon,
            title: "Active Patients",
            value: admin_data.stats.active_patients,
        },
    ];



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
                                Total {admin_data.stats.total_doctors} registered doctors
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
                                {admin_data.doctors.map(
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
                        {admin_data.recent_patients.map(
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
                            Total {admin_data.stats.total_patients} registered patients
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
                                {admin_data.patients.map(
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
