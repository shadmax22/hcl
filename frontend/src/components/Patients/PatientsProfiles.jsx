import { PatientPrescription } from "@/pages/dashboard";
import { Button } from "@material-tailwind/react";
import { useState } from "react";

const data = [
    // ---------------------------------------------------------
    // 1. SHAD ALI
    // ---------------------------------------------------------
    {
        patient: {
            name: "Shad Ali",
            age: 20,
            gender: "Male",
            avatar: "/img/bruce-mars.jpeg",
            blood_group: "O+",
            last_visit: "21 Nov 2025",
            doctor: "Dr. Ritesh Sharma",
        },

        conversations: [
            {
                sender: "doctor",
                name: "Dr. Ritesh",
                avatar: "/img/team-1.jpeg",
                message: "Hello Shad, how are you feeling today?",
                time: "10:20 AM",
            },
            {
                sender: "patient",
                name: "Shad",
                avatar: "/img/bruce-mars.jpeg",
                message: "My chest feels tight today.",
                time: "10:22 AM",
            },
            {
                sender: "doctor",
                name: "Dr. Ritesh",
                avatar: "/img/team-1.jpeg",
                message: "I will adjust your medication.",
                time: "10:25 AM",
            },
        ],

        upcoming_appointment: {
            date: "25 Nov 2025",
            time: "03:30 PM",
            doctor: "Dr. Ritesh Sharma",
            department: "Cardiology",
        },

        charts: [
            {
                title: "Daily Steps",
                description: "Activity this week",
                footer: "Updated 1 min ago",
                series: [3500, 4200, 6100, 9000, 7600, 10500, 12000],
                x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                color: "#0288d1",
            },
            {
                title: "Heartbeat",
                description: "Average Rest BPM",
                footer: "Updated 2 hours ago",
                series: [72, 76, 73, 70, 74, 72, 71],
                x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                color: "#ef5350",
            },
        ],

        goals: [
            { title: "Weight Gain", target: "65 kg", status: "active", due_date: "20 Dec 2025" },
            { title: "Daily Steps", target: "10,000", status: "completed", due_date: "15 Nov 2025" },
        ],

        prescriptions: [
            { medicine: "Paracetamol 650mg", dosage: "1 after lunch", days: "5 days", doctor: "Dr. Ritesh", date: "19 Nov 2025" },
            { medicine: "Vitamin D3", dosage: "One daily", days: "7 days", doctor: "Dr. Kumar", date: "10 Nov 2025" },
        ],
    },

    // ---------------------------------------------------------
    // 2. APSARA VERMA
    // ---------------------------------------------------------
    {
        patient: {
            name: "Apsara Verma",
            age: 22,
            gender: "Female",
            avatar: "/img/team-2.jpeg",
            blood_group: "A-",
            last_visit: "10 Nov 2025",
            doctor: "Dr. Kumar",
        },

        conversations: [
            {
                sender: "doctor",
                name: "Dr. Kumar",
                avatar: "/img/team-3.jpeg",
                message: "How is your migraine today?",
                time: "09:10 AM",
            },
            {
                sender: "patient",
                name: "Apsara",
                avatar: "/img/team-2.jpeg",
                message: "Much better, thank you.",
                time: "09:12 AM",
            },
        ],

        upcoming_appointment: {
            date: "28 Nov 2025",
            time: "01:00 PM",
            doctor: "Dr. Kumar",
            department: "Neurology",
        },

        charts: [
            {
                title: "Headache Severity",
                description: "Daily pain scale",
                footer: "Last updated today",
                series: [4, 5, 3, 2, 2, 1, 2],
                x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                color: "#ab47bc",
            },
        ],

        goals: [
            { title: "Migraine Reduction", target: "Pain < 2", status: "active", due_date: "30 Nov 2025" },
        ],

        prescriptions: [
            { medicine: "Sumatriptan", dosage: "1 tablet if pain > 4", days: "As needed", doctor: "Dr. Kumar", date: "05 Nov 2025" },
        ],
    },

    // ---------------------------------------------------------
    // 3. RAVI PRAKASH
    // ---------------------------------------------------------
    {
        patient: {
            name: "Ravi Prakash",
            age: 34,
            gender: "Male",
            avatar: "/img/team-3.jpeg",
            blood_group: "B+",
            last_visit: "05 Nov 2025",
            doctor: "Dr. Mehta",
        },

        conversations: [
            {
                sender: "patient",
                name: "Ravi",
                avatar: "/img/team-3.jpeg",
                message: "I have been coughing at night.",
                time: "11:00 AM",
            },
            {
                sender: "doctor",
                name: "Dr. Mehta",
                avatar: "/img/team-4.jpeg",
                message: "Could be seasonal allergy, let me check.",
                time: "11:05 AM",
            },
        ],

        upcoming_appointment: {
            date: "29 Nov 2025",
            time: "11:45 AM",
            doctor: "Dr. Mehta",
            department: "Pulmonology",
        },

        charts: [
            {
                title: "Respiratory Rate",
                description: "Breaths per minute",
                footer: "Updated today",
                series: [16, 18, 17, 19, 18, 17, 16],
                x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                color: "#42a5f5",
            },
        ],

        goals: [
            { title: "Cough Reduction", target: "0–1 per day", status: "active", due_date: "08 Dec 2025" },
        ],

        prescriptions: [
            { medicine: "Montelukast", dosage: "One tablet at night", days: "10 days", doctor: "Dr. Mehta", date: "05 Nov 2025" },
        ],
    },

    // ---------------------------------------------------------
    // 4. NEHA PATIL
    // ---------------------------------------------------------
    {
        patient: {
            name: "Neha Patil",
            age: 28,
            gender: "Female",
            avatar: "/img/team-4.jpeg",
            blood_group: "AB+",
            last_visit: "03 Nov 2025",
            doctor: "Dr. Sunaina",
        },

        conversations: [
            {
                sender: "doctor",
                name: "Dr. Sunaina",
                avatar: "/img/team-5.jpeg",
                message: "Have your anxiety symptoms improved?",
                time: "02:20 PM",
            },
            {
                sender: "patient",
                name: "Neha",
                avatar: "/img/team-4.jpeg",
                message: "Yes, breathing exercises helped.",
                time: "02:22 PM",
            },
        ],

        upcoming_appointment: {
            date: "30 Nov 2025",
            time: "10:00 AM",
            doctor: "Dr. Sunaina",
            department: "Psychiatry",
        },

        charts: [
            {
                title: "Anxiety Levels",
                description: "Daily mood score",
                footer: "Updated 3 hrs ago",
                series: [7, 6, 5, 4, 5, 3, 4],
                x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                color: "#ff7043",
            },
        ],

        goals: [
            { title: "Anxiety Improvement", target: "< 3 level", status: "active", due_date: "15 Dec 2025" },
        ],

        prescriptions: [
            { medicine: "Sertraline 50mg", dosage: "Daily morning", days: "30 days", doctor: "Dr. Sunaina", date: "03 Nov 2025" },
        ],
    },

    // ---------------------------------------------------------
    // 5. ARYAN SINGH
    // ---------------------------------------------------------
    {
        patient: {
            name: "Aryan Singh",
            age: 16,
            gender: "Male",
            avatar: "/img/team-5.jpeg",
            blood_group: "O-",
            last_visit: "12 Nov 2025",
            doctor: "Dr. Shashank",
        },

        conversations: [
            {
                sender: "patient",
                name: "Aryan",
                avatar: "/img/team-5.jpeg",
                message: "I feel tired quickly during football practice.",
                time: "06:30 PM",
            },
            {
                sender: "doctor",
                name: "Dr. Shashank",
                avatar: "/img/team-1.jpeg",
                message: "We'll check your iron levels.",
                time: "06:45 PM",
            },
        ],

        upcoming_appointment: {
            date: "22 Nov 2025",
            time: "09:00 AM",
            doctor: "Dr. Shashank",
            department: "General Medicine",
        },

        charts: [
            {
                title: "Energy Levels",
                description: "Daily energy scores",
                footer: "Updated yesterday",
                series: [5, 6, 4, 3, 6, 7, 5],
                x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                color: "#26a69a",
            },
        ],

        goals: [
            { title: "Improve Stamina", target: "Energy 7+", status: "active", due_date: "30 Dec 2025" },
        ],

        prescriptions: [
            { medicine: "Iron Supplements", dosage: "1 tablet daily", days: "20 days", doctor: "Dr. Shashank", date: "12 Nov 2025" },
        ],
    },

    // ---------------------------------------------------------
    // 6. FATIMA KHAN
    // ---------------------------------------------------------
    {
        patient: {
            name: "Fatima Khan",
            age: 40,
            gender: "Female",
            avatar: "/img/team-6.jpeg",
            blood_group: "B-",
            last_visit: "18 Nov 2025",
            doctor: "Dr. Irfan",
        },

        conversations: [
            {
                sender: "doctor",
                name: "Dr. Irfan",
                avatar: "/img/team-2.jpeg",
                message: "How is your blood sugar today?",
                time: "08:10 AM",
            },
            {
                sender: "patient",
                name: "Fatima",
                avatar: "/img/team-6.jpeg",
                message: "It was 142 after breakfast.",
                time: "08:12 AM",
            },
        ],

        upcoming_appointment: {
            date: "27 Nov 2025",
            time: "12:15 PM",
            doctor: "Dr. Irfan",
            department: "Endocrinology",
        },

        charts: [
            {
                title: "Blood Sugar",
                description: "Fasting glucose levels",
                footer: "Updated today",
                series: [138, 142, 130, 150, 145, 139, 135],
                x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                color: "#d32f2f",
            },
        ],

        goals: [
            { title: "Control Blood Sugar", target: "< 130 mg/dL", status: "active", due_date: "10 Dec 2025" },
        ],

        prescriptions: [
            { medicine: "Metformin 500mg", dosage: "1 tablet twice daily", days: "30 days", doctor: "Dr. Irfan", date: "18 Nov 2025" },
        ],
    },
];

export function PatientsProfiles() {



    // -----------------------------------------
    // INDEX + NEXT/PREV LOGIC
    // -----------------------------------------
    const [index, setIndex] = useState(0);

    const goNext = () => {
        if (index < data.length - 1) setIndex(index + 1);
    };

    const goPrev = () => {
        if (index > 0) setIndex(index - 1);
    };

    return (
        <>
            <PatientPrescription data={data[index]} />

            <div
                className="fixed right-0 bottom-0 p-3 flex justify-center gap-2"
                style={{ zIndex: 2000 }}
            >
                <Button
                    color="blue"
                    disabled={index === 0}
                    onClick={goPrev}
                >
                    Previous Patient
                </Button>

                <Button
                    color="green"
                    disabled={index === data.length - 1}
                    onClick={goNext}
                >
                    Next Patient
                </Button>
            </div>
        </>
    );
}
