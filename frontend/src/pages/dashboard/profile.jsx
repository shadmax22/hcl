import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Typography,
  Chip,
  Button,
  Input,
} from "@material-tailwind/react";

import { ClockIcon } from "@heroicons/react/24/solid";
import { StatisticsChart } from "@/widgets/charts";
import { chartsConfig } from "@/configs";
import { useEffect, useState } from "react";
import { Modal } from "react-easetools";

export function PatientPrescription({ data }) {

  // -------------------------------------------------------
  // ALL DATA FROM ONE SOURCE
  // -------------------------------------------------------
  const [expected_data, setExpectedData] = useState(data);

  useEffect(() => {
    setExpectedData(data)
  }, [data])

  // ---------------------------------------
  // CHART BUILDER
  // ---------------------------------------
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

  // ------------------------------------------------------
  // DOCTOR MESSAGE SENDER
  // ------------------------------------------------------
  const [doctorMessage, setDoctorMessage] = useState("");

  const sendDoctorMessage = () => {
    if (!doctorMessage.trim()) return;

    const newMessage = {
      sender: "doctor",
      name: expected_data.patient.doctor,
      avatar: "/img/team-1.jpeg",
      message: doctorMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setExpectedData({
      ...expected_data,
      conversations: [...expected_data.conversations, newMessage],
    });

    setDoctorMessage("");
  };

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
                onClick={() => Modal({ title: "Hello world" })}
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
                  {expected_data.patient.gender} • {expected_data.patient.age} yrs • Blood {expected_data.patient.blood_group}
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                  Consulting: {expected_data.patient.doctor}
                </Typography>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* UPCOMING APPOINTMENT */}
          {/* ------------------------------------------------------------- */}
          <Card className="mb-10 bg-blue-gray-50 shadow-sm">
            <CardBody>
              <Typography variant="h6" className="mb-2 text-blue-gray-800">
                Upcoming Appointment
              </Typography>

              <div className="flex flex-col gap-2">
                <Typography variant="small">
                  <b>Date:</b> {expected_data.upcoming_appointment.date}
                </Typography>

                <Typography variant="small">
                  <b>Time:</b> {expected_data.upcoming_appointment.time}
                </Typography>

                <Typography variant="small">
                  <b>Doctor:</b> {expected_data.upcoming_appointment.doctor}
                </Typography>

                <Typography variant="small">
                  <b>Department:</b> {expected_data.upcoming_appointment.department}
                </Typography>
              </div>
            </CardBody>
          </Card>

          {/* ------------------------------------------------------------- */}
          {/* CONVERSATIONS + DOCTOR MESSAGE */}
          {/* ------------------------------------------------------------- */}

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
                      <ClockIcon className="h-4 w-4 text-blue-gray-400" />
                      &nbsp;{chart.footer}
                    </Typography>
                  }
                  chart={makeChart(chart)}
                />
              ))}
            </div>
          </div>


          <Card className="mb-12">
            <CardHeader variant="gradient" color="blue" className="p-6">
              <Typography variant="h6" color="white">
                Conversation
              </Typography>
            </CardHeader>

            <CardBody className="px-4">

              <div className="flex flex-col gap-6 mb-6">
                {expected_data.conversations.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.sender === "doctor" ? "justify-start" : "justify-end"}`}>
                    <Avatar src={msg.avatar} size="sm" />

                    <div className="bg-blue-gray-50 p-3 rounded-lg max-w-sm shadow-sm">
                      <Typography className="text-blue-gray-800 text-sm">{msg.message}</Typography>
                      <Typography variant="small" className="text-blue-gray-500 mt-1 text-xs">
                        {msg.time}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>

              {/* DOCTOR MESSAGE INPUT */}
              <div className="flex gap-3 items-center">
                <Input
                  value={doctorMessage}
                  onChange={(e) => setDoctorMessage(e.target.value)}
                  label="Doctor Message"
                  className="flex-1"
                />

                <Button color="blue" onClick={sendDoctorMessage}>
                  Send
                </Button>
              </div>
            </CardBody>
          </Card>

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
