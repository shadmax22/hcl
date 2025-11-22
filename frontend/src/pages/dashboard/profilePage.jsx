import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import api from "../../../axios.js";

export function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_no: "",
    DOB: "",
    gender: "",
    stat: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_no: "",
    DOB: "",
    gender: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Determine which endpoint to use based on user role
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const role = user.role;

      let response;
      if (role === "healthcare_provider") {
        response = await api.get("/v1/doctor/profile");
      } else {
        response = await api.get("/v1/patient/profile");
      }

      if (response.data && response.data.user) {
        const userData = response.data.user;
        setProfile({
          name: userData.name || "",
          email: userData.email || "",
          phone_no: userData.phone_no || "",
          DOB: userData.DOB || "",
          gender: userData.gender || "",
          stat: userData.stat || "",
        });
        setFormData({
          name: userData.name || "",
          phone_no: userData.phone_no || "",
          DOB: userData.DOB ? new Date(userData.DOB).toISOString().split("T")[0] : "",
          gender: userData.gender || "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      // Note: Update profile endpoint would need to be added to backend
      // For now, just show a message
      alert("Profile update functionality will be available soon");
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="mt-12 mb-8 flex justify-center">
        <Typography variant="h6" color="blue-gray">
          Loading profile...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 mb-8 flex justify-center">
        <Typography variant="h6" color="red">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Typography variant="h2" color="blue-gray">
        My Profile
      </Typography>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="white">
              Profile Information
            </Typography>
            {!editing && (
              <Button size="sm" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/bruce-mars.jpeg"
                alt={profile.name}
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {profile.name}
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                  {profile.email}
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Full Name
                </Typography>
                {editing ? (
                  <Input
                    size="lg"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                  />
                ) : (
                  <Typography variant="paragraph" color="blue-gray">
                    {profile.name || "N/A"}
                  </Typography>
                )}
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Email
                </Typography>
                <Typography variant="paragraph" color="blue-gray">
                  {profile.email || "N/A"}
                </Typography>
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Phone Number
                </Typography>
                {editing ? (
                  <Input
                    size="lg"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    placeholder="Phone Number"
                  />
                ) : (
                  <Typography variant="paragraph" color="blue-gray">
                    {profile.phone_no || "N/A"}
                  </Typography>
                )}
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Date of Birth
                </Typography>
                {editing ? (
                  <Input
                    size="lg"
                    type="date"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleChange}
                  />
                ) : (
                  <Typography variant="paragraph" color="blue-gray">
                    {formatDate(profile.DOB)}
                  </Typography>
                )}
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Gender
                </Typography>
                {editing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full text-blue-gray-700 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <Typography variant="paragraph" color="blue-gray">
                    {profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "N/A"}
                  </Typography>
                )}
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Status
                </Typography>
                <Typography variant="paragraph" color="blue-gray">
                  {profile.stat ? profile.stat.charAt(0).toUpperCase() + profile.stat.slice(1) : "N/A"}
                </Typography>
              </div>
            </div>

            {editing && (
              <div className="flex gap-4 justify-end mt-6">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ProfilePage;

