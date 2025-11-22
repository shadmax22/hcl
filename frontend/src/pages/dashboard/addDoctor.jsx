import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import api from "../../../axios.js";
import { useNavigate } from "react-router-dom";

export function AddDoctor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_no: "",
    DOB: "",
    gender: "",
    specialisation: "",
    care_category: "",
  });
  const [careCategories, setCareCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCareCategories();
  }, []);

  const fetchCareCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get("/v1/admin/care-categories");
      console.log("Care categories response:", response.data);
      if (response.data && response.data.categories) {
        setCareCategories(response.data.categories);
        console.log("Categories loaded:", response.data.categories);
      } else {
        console.warn("No categories in response:", response.data);
      }
    } catch (err) {
      console.error("Error fetching care categories:", err);
      if (err.response) {
        console.error("Error response:", err.response.data);
      }
      setErrorMessage("Failed to load care categories. Please refresh the page.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSelectChange = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const tempErrors = {};

    if (!formData.name.trim()) {
      tempErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Enter a valid email address.";
    }

    if (!formData.password.trim()) {
      tempErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.specialisation.trim()) {
      tempErrors.specialisation = "Specialisation is required.";
    }

    if (!formData.care_category) {
      tempErrors.care_category = "Care category is required.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/v1/admin/doctors", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone_no: formData.phone_no || undefined,
        DOB: formData.DOB || undefined,
        gender: formData.gender || undefined,
        specialisation: formData.specialisation,
        care_category: formData.care_category,
      });

      if (response.data && response.data.message) {
        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          phone_no: "",
          DOB: "",
          gender: "",
          specialisation: "",
          care_category: "",
        });
        setErrors({});
        
        // Show success message and redirect
        alert("Doctor created successfully!");
        navigate("/dashboard/doctors");
      }
    } catch (error) {
      console.error("Error creating doctor:", error);
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.message || "Failed to create doctor"
        );
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Typography variant="h2" color="blue-gray">
        Add New Doctor
      </Typography>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Doctor Information
          </Typography>
        </CardHeader>
        <CardBody>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Typography variant="small" className="text-red-600">
                {errorMessage}
              </Typography>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Full Name <span className="text-red-500">*</span>
                </Typography>
                <Input
                  size="lg"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Dr. John Doe"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  error={!!errors.name}
                />
                {errors.name && (
                  <Typography variant="small" className="text-red-500 mt-1">
                    {errors.name}
                  </Typography>
                )}
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Email <span className="text-red-500">*</span>
                </Typography>
                <Input
                  size="lg"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="doctor@example.com"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  error={!!errors.email}
                />
                {errors.email && (
                  <Typography variant="small" className="text-red-500 mt-1">
                    {errors.email}
                  </Typography>
                )}
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Password <span className="text-red-500">*</span>
                </Typography>
                <Input
                  size="lg"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  error={!!errors.password}
                />
                {errors.password && (
                  <Typography variant="small" className="text-red-500 mt-1">
                    {errors.password}
                  </Typography>
                )}
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Phone Number
                </Typography>
                <Input
                  size="lg"
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Date of Birth
                </Typography>
                <Input
                  size="lg"
                  type="date"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Gender
                </Typography>
                <Select
                  size="lg"
                  name="gender"
                  value={formData.gender}
                  onChange={(value) => handleSelectChange(value, "gender")}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                >
                  <Option value="">Select Gender</Option>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Specialisation <span className="text-red-500">*</span>
                </Typography>
                <Input
                  size="lg"
                  name="specialisation"
                  value={formData.specialisation}
                  onChange={handleChange}
                  placeholder="Cardiology, Neurology, etc."
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  error={!!errors.specialisation}
                />
                {errors.specialisation && (
                  <Typography variant="small" className="text-red-500 mt-1">
                    {errors.specialisation}
                  </Typography>
                )}
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Care Category <span className="text-red-500">*</span>
                </Typography>
                {loadingCategories ? (
                  <Typography variant="small" color="blue-gray">
                    Loading categories...
                  </Typography>
                ) : careCategories.length === 0 ? (
                  <div>
                    <Typography variant="small" color="red" className="mb-2">
                      No care categories available. Please add categories first.
                    </Typography>
                    <Button
                      size="sm"
                      variant="outlined"
                      onClick={fetchCareCategories}
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <Select
                    size="lg"
                    name="care_category"
                    value={formData.care_category}
                    onChange={(value) => handleSelectChange(value, "care_category")}
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    label=""
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    error={!!errors.care_category}
                  >
                    <Option value="">Select Care Category</Option>
                    {careCategories.map((category) => (
                      <Option key={category._id} value={category._id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                )}
                {errors.care_category && (
                  <Typography variant="small" className="text-red-500 mt-1">
                    {errors.care_category}
                  </Typography>
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/doctors")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || loadingCategories}>
                {loading ? "Creating..." : "Create Doctor"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddDoctor;

