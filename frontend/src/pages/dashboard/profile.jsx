import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Chip,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { StatisticsChart } from "@/widgets/charts";
import { chartsConfig } from "@/configs";
import { useState } from "react";
import { Modal } from "react-easetools";

export function PatientPrescription() {

  const [activeTab, setActiveTab] = useState("info");

  // -----------------------------
  // ALL DATA FROM ONE SOURCE
  // -----------------------------
  const expected_data = {
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
        message: "Doctor, my chest feels tight today.",
        time: "10:22 AM",
      },
      {
        sender: "doctor",
        name: "Dr. Ritesh",
        avatar: "/img/team-1.jpeg",
        message: "Take deep breaths. I will update your prescription.",
        time: "10:25 AM",
      }
    ],

    charts: [
      {
        title: "Daily Steps",
        description: "Your activity today",
        footer: "Updated just now",
        series: [2200, 3500, 5600, 8900, 7600, 9000, 12000],
        x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        color: "#0288d1",
      },
      {
        title: "Heartbeat",
        description: "Average bpm (Resting)",
        footer: "Updated 2 min ago",
        series: [72, 75, 71, 70, 74, 72, 73],
        x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        color: "#ef5350",
      },
      {
        title: "Oxygen Level",
        description: "O2 % saturation levels",
        footer: "Updated 1 hr ago",
        series: [97, 96, 97, 98, 98, 97, 96],
        x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        color: "#66bb6a",
      },
    ],

    goals: [
      {
        title: "Weight Gain",
        target: "65 kg",
        status: "active",
        due_date: "20 Dec 2025",
      },
      {
        title: "Daily Steps",
        target: "10,000 steps",
        status: "completed",
        due_date: "15 Nov 2025",
      },
      {
        title: "BMI Improvement",
        target: "20",
        status: "active",
        due_date: "05 Jan 2026",
      },
    ],

    prescriptions: [
      {
        medicine: "Paracetamol 650mg",
        dosage: "1 tablet after lunch",
        days: "5 days",
        doctor: "Dr. Ritesh",
        date: "19 Nov 2025",
      },
      {
        medicine: "Azithromycin 500mg",
        dosage: "1 tablet daily",
        days: "3 days",
        doctor: "Dr. Kumar",
        date: "12 Nov 2025",
      },
    ],
  };

  // CHART CONFIG TRANSFORM
  const makeChart = (item) => ({
    type: "line",
    height: 220,
    series: [{ name: item.title, data: item.series }],
    options: {
      ...chartsConfig,
      colors: [item.color],
      stroke: { lineCap: "round" },
      markers: { size: 5 },
      xaxis: { ...chartsConfig.xaxis, categories: item.x },
    },
  });



  return (
    <>
      <Card className="mb-6 border border-blue-gray-100">
        <CardBody className="p-4">

          {/* ------------------------------------------------------------- */}
          {/* PATIENT HEADER */}
          {/* ------------------------------------------------------------- */}
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                onClick={() => {
                  Modal({
                    title: "Hello world"
                  })
                }}
                src={expected_data.patient.avatar}
                alt={expected_data.patient.name}
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {expected_data.patient.name}
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                  {expected_data.patient.gender} • {expected_data.patient.age} yrs • Blood {expected_data.patient.patient}
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                  Consulting: {expected_data.patient.doctor}
                </Typography>
              </div>
            </div>

            <div className="w-96">
              <Tabs value={activeTab} className="w-96">
                <TabsHeader>
                  <Tab value="info" onClick={() => setActiveTab("info")}>
                    <HomeIcon className="-mt-1 mr-2 h-5 w-5" /> Overview
                  </Tab>
                  <Tab value="chat" onClick={() => setActiveTab("chat")}>
                    <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 h-5 w-5" /> Chat
                  </Tab>
                  <Tab value="settings" onClick={() => setActiveTab("settings")}>
                    <Cog6ToothIcon className="-mt-1 mr-2 h-5 w-5" /> Settings
                  </Tab>
                </TabsHeader>
              </Tabs>

            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* HEALTH CHARTS */}
          {/* ------------------------------------------------------------- */}
          <div className="mb-12 flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Health Monitor
            </Typography>

            <div className="grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
              {expected_data.charts.map((chart, index) => (
                <StatisticsChart
                  key={index}
                  color="white"
                  title={chart.title}
                  description={chart.description}
                  footer={
                    <Typography variant="small" className="flex items-center font-normal text-blue-gray-600">
                      <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                      &nbsp;{chart.footer}
                    </Typography>
                  }
                  chart={makeChart(chart)}
                />
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* GOALS */}
          {/* ------------------------------------------------------------- */}
          <Card className="mb-12">
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <Typography variant="h6" color="white">
                Goals
              </Typography>
            </CardHeader>

            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Goal", "Target", "Status", "Due Date"].map((h) => (
                      <th key={h} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                          {h}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {expected_data.goals.map((g, i) => (
                    <tr key={i}>
                      <td className="py-3 px-5">{g.title}</td>
                      <td className="py-3 px-5">{g.target}</td>
                      <td className="py-3 px-5">
                        <Chip variant="gradient" color={g.status === "completed" ? "green" : "blue"} value={g.status} />
                      </td>
                      <td className="py-3 px-5">{g.due_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>

          {/* ------------------------------------------------------------- */}
          {/* PRESCRIPTIONS */}
          {/* ------------------------------------------------------------- */}
          <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <Typography variant="h6" color="white">
                Prescriptions
              </Typography>
            </CardHeader>

            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Medicine", "Dosage", "Days", "Doctor", "Date"].map((h) => (
                      <th key={h} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                          {h}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {expected_data.prescriptions.map((p, i) => (
                    <tr key={i}>
                      <td className="py-3 px-5">{p.medicine}</td>
                      <td className="py-3 px-5">{p.dosage}</td>
                      <td className="py-3 px-5">{p.days}</td>
                      <td className="py-3 px-5">{p.doctor}</td>
                      <td className="py-3 px-5">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>



            </CardBody>
          </Card>



        </CardBody>
      </Card>
    </>
  );
}

