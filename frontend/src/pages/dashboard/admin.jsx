import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import api from "../../../axios.js";
import { chartsConfig } from "@/configs";
import Chart from "react-apexcharts";
import { ClockIcon } from "@heroicons/react/24/solid";

export function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statistics, setStatistics] = useState({
    patients: 0,
    doctors: 0,
    totalUsers: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setStatsLoading(true);
      const response = await api.get("/v1/admin/statistics");
      
      if (response.data && response.data.statistics) {
        setStatistics(response.data.statistics);
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/v1/admin/doctors");
      
      if (response.data && response.data.doctors) {
        setDoctors(response.data.doctors);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Failed to fetch doctors");
      } else {
        setError("An error occurred while fetching doctors");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "pending_verification":
        return "yellow";
      case "inactive":
        return "red";
      default:
        return "blue-gray";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Create chart configuration for doctors vs patients
  const statisticsChart = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "Count",
        data: [statistics.doctors, statistics.patients],
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#0288d1", "#66bb6a"],
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: ["Doctors", "Patients"],
      },
      yaxis: {
        ...chartsConfig.yaxis,
        min: 0,
        forceNiceScale: true,
      },
      tooltip: {
        ...chartsConfig.tooltip,
        y: {
          formatter: function (val) {
            return val + " users";
          },
        },
      },
    },
  };

  const handleRefresh = () => {
    fetchDoctors();
    fetchStatistics();
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <Typography variant="h2" color="blue-gray">
          Admin Dashboard
        </Typography>
        <Button
          onClick={handleRefresh}
          disabled={loading || statsLoading}
          size="sm"
          variant="outlined"
        >
          {loading || statsLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Statistics Chart */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader variant="gradient" color="white" floated={false} shadow={false}>
            <Chart {...statisticsChart} />
          </CardHeader>
          <CardBody className="px-6 pt-0">
            <Typography variant="h6" color="blue-gray">
              Users Overview
            </Typography>
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Total count of doctors and patients in the system
            </Typography>
          </CardBody>
          <CardBody className="border-t border-blue-gray-50 px-6 py-5">
            <Typography variant="small" className="flex items-center font-normal text-blue-gray-600">
              <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400 mr-2" />
              {statsLoading ? "Loading..." : `Total: ${statistics.totalUsers} active users`}
            </Typography>
          </CardBody>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="border border-blue-gray-100 shadow-sm">
            <CardBody className="p-6">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Doctors
              </Typography>
              <Typography variant="h3" color="blue" className="mb-1">
                {statsLoading ? "..." : statistics.doctors}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-600">
                Active healthcare providers
              </Typography>
            </CardBody>
          </Card>
          <Card className="border border-blue-gray-100 shadow-sm">
            <CardBody className="p-6">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Patients
              </Typography>
              <Typography variant="h3" color="green" className="mb-1">
                {statsLoading ? "..." : statistics.patients}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-600">
                Active patients in the system
              </Typography>
            </CardBody>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Doctors List ({doctors.length})
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Typography variant="h6" color="blue-gray">
                Loading doctors...
              </Typography>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12">
              <Typography variant="h6" color="red">
                {error}
              </Typography>
            </div>
          ) : doctors.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Typography variant="h6" color="blue-gray">
                No doctors found
              </Typography>
            </div>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "Doctor",
                    "Email",
                    "Phone",
                    "Specialisation",
                    "Care Category",
                    "Status",
                    "Registered",
                  ].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor, key) => {
                  const className = `py-3 px-5 ${
                    key === doctors.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  const userName = doctor.user?.name || "N/A";
                  const userEmail = doctor.user?.email || "N/A";
                  const userPhone = doctor.user?.phone_no || "N/A";
                  const specialisation = doctor.specialisation || "N/A";
                  const careCategory =
                    doctor.care_category?.name || "N/A";
                  const status = doctor.stat || "unknown";
                  const createdDate = formatDate(doctor.created_at);

                  return (
                    <tr key={doctor.id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar
                            src="/img/team-1.jpeg"
                            alt={userName}
                            size="sm"
                            variant="rounded"
                          />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {userName}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              ID: {doctor.id?.slice(0, 8)}...
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {userEmail}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {userPhone}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {specialisation}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {careCategory}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={getStatusColor(status)}
                          value={status.replace("_", " ").toUpperCase()}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {createdDate}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default AdminDashboard;

