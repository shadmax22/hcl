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
import { useNavigate } from "react-router-dom";
import api from "../../../axios.js";

export function DoctorsList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

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

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <Typography variant="h2" color="blue-gray">
          Doctors List
        </Typography>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/dashboard/add-doctor")}
            size="sm"
            color="green"
          >
            Add Doctor
          </Button>
          <Button
            onClick={fetchDoctors}
            disabled={loading}
            size="sm"
            variant="outlined"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            All Doctors ({doctors.length})
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

export default DoctorsList;

