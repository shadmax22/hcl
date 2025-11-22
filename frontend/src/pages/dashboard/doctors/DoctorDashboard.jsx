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

import React from "react";

export function DoctorDashboard() {

    // --------------------------------------------------------------------------
    // ALL DOCTOR DATA FROM ONE SOURCE
    // --------------------------------------------------------------------------
    const doctor_data = {
        doctor: {
            name: "Dr. Ritesh Sharma",
            specialization: "Cardiologist",
            email: "ritesh@hospital.com",
            img: "/img/team-1.jpeg",
        },

        stats: {
            assigned_patients: 18,
            total_patients: 1080,
            active_patients: 860,
        },

        assigned_patients: [
            { name: "Shad Ali", age: 20, issue: "Chest Tightness", img: "/img/bruce-mars.jpeg", last_visit: "21 Nov 2025" },
            { name: "Rahul Verma", age: 32, issue: "Chest Pain", img: "/img/team-2.jpeg", last_visit: "20 Nov 2025" },
            { name: "Aman Gupta", age: 25, issue: "Irregular Heartbeat", img: "/img/team-3.jpeg", last_visit: "19 Nov 2025" },
        ],

        active_patients: [
            { name: "Sara Khan", issue: "High BP", time: "Currently Under Treatment", img: "/img/team-4.jpeg" },
            { name: "Anil Kumar", issue: "High Cholesterol", time: "Review Tomorrow", img: "/img/team-2.jpeg" },
            { name: "Ravi Prakash", issue: "Shortness of Breath", time: "Today", img: "/img/team-1.jpeg" },
        ],

        all_patients: [
            { name: "Aman Gupta", issue: "Heart Palpitations", email: "aman@gmail.com", img: "/img/team-1.jpeg" },
            { name: "Priya Sharma", issue: "Fever", email: "priya@gmail.com", img: "/img/team-3.jpeg" },
            { name: "Mohit Yadav", issue: "Back Pain", email: "mohit@gmail.com", img: "/img/team-2.jpeg" },
            { name: "Sara Khan", issue: "High BP", email: "sara@gmail.com", img: "/img/team-4.jpeg" },
        ],
    };


    const statisticsCards = [
        {
            color: "gray",
            icon: UserGroupIcon,
            title: "Assigned Patients",
            value: doctor_data.stats.assigned_patients,
        },
        {
            color: "gray",
            icon: UsersIcon,
            title: "All Patients",
            value: doctor_data.stats.total_patients,
        },
        {
            color: "gray",
            icon: ClipboardDocumentCheckIcon,
            title: "Active Cases",
            value: doctor_data.stats.active_patients,
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
                                {doctor_data.assigned_patients.map(({ name, age, issue, img, last_visit }, index) => (
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
                                ))}
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
                        {doctor_data.active_patients.map(({ name, issue, time, img }, index) => (
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
                        ))}
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
                                {doctor_data.all_patients.map(({ name, issue, email, img }, index) => (
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
                                ))}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </div>

        </div>
    );
}

export default DoctorDashboard;