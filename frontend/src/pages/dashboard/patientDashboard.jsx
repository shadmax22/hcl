import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option,
  Chip,
  IconButton,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import api from "../../../axios.js";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export function PatientDashboard() {
  const [trackingRecords, setTrackingRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ type: "", value: "", date: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ type: "", value: "", date: "" });

  useEffect(() => {
    fetchTrackingRecords();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/v1/patient/tracking-records/categories");
      if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchTrackingRecords = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/v1/patient/tracking-records");
      if (response.data && response.data.records) {
        setTrackingRecords(response.data.records);
      }
    } catch (err) {
      console.error("Error fetching tracking records:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Failed to fetch tracking records");
      } else {
        setError("An error occurred while fetching tracking records");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id || record.id);
    const recordDate = record.date
      ? new Date(record.date).toISOString().split("T")[0]
      : new Date(record.created_at).toISOString().split("T")[0];
    setEditForm({
      type: record.type,
      value: record.value.toString(),
      date: recordDate,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ type: "", value: "", date: "" });
  };

  const handleSaveEdit = async () => {
    try {
      const recordId = editingId;
      const updateData = {
        type: editForm.type,
        value: parseFloat(editForm.value),
        date: editForm.date,
      };

      const response = await api.put(
        `/v1/patient/tracking-records/${recordId}`,
        updateData
      );

      if (response.data) {
        await fetchTrackingRecords();
        handleCancelEdit();
      }
    } catch (err) {
      console.error("Error updating tracking record:", err);
      alert(
        err.response?.data?.message || "Failed to update tracking record"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      await api.delete(`/v1/patient/tracking-records/${id}`);
      await fetchTrackingRecords();
    } catch (err) {
      console.error("Error deleting tracking record:", err);
      alert(err.response?.data?.message || "Failed to delete tracking record");
    }
  };

  const handleAdd = async () => {
    try {
      if (!addForm.type || !addForm.value) {
        alert("Please fill in type and value");
        return;
      }

      const addData = {
        type: addForm.type,
        value: parseFloat(addForm.value),
        date: addForm.date || new Date().toISOString().split("T")[0],
      };

      const response = await api.post("/v1/patient/tracking-records", addData);

      if (response.data) {
        await fetchTrackingRecords();
        setAddForm({ type: "", value: "", date: "" });
        setShowAddForm(false);
      }
    } catch (err) {
      console.error("Error adding tracking record:", err);
      alert(err.response?.data?.message || "Failed to add tracking record");
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

  const getCategoryLabel = (type) => {
    const category = categories.find((cat) => cat.value === type);
    return category ? category.label : type;
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <Typography variant="h2" color="blue-gray">
          My Health Tracking
        </Typography>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          size="sm"
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Record
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="border border-blue-gray-100">
          <CardBody className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Add New Tracking Record
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Type"
                value={addForm.type}
                onChange={(val) => setAddForm({ ...addForm, type: val })}
              >
                {categories.map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
              <Input
                type="number"
                label="Value"
                value={addForm.value}
                onChange={(e) =>
                  setAddForm({ ...addForm, value: e.target.value })
                }
                step="0.01"
              />
              <Input
                type="date"
                label="Date"
                value={addForm.date}
                onChange={(e) =>
                  setAddForm({ ...addForm, date: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAdd} size="sm" color="green">
                <CheckIcon className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setAddForm({ type: "", value: "", date: "" });
                }}
                size="sm"
                variant="outlined"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tracking Records Table */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Tracking Records ({trackingRecords.length})
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Typography variant="h6" color="blue-gray">
                Loading tracking records...
              </Typography>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12">
              <Typography variant="h6" color="red">
                {error}
              </Typography>
            </div>
          ) : trackingRecords.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Typography variant="h6" color="blue-gray">
                No tracking records found. Add your first record!
              </Typography>
            </div>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Type", "Value", "Date", "Actions"].map((el) => (
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
                {trackingRecords.map((record, key) => {
                  const recordId = record._id || record.id;
                  const isEditing = editingId === recordId;
                  const className = `py-3 px-5 ${
                    key === trackingRecords.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={recordId}>
                      <td className={className}>
                        {isEditing ? (
                          <Select
                            value={editForm.type}
                            onChange={(val) =>
                              setEditForm({ ...editForm, type: val })
                            }
                            className="min-w-[200px]"
                          >
                            {categories.map((cat) => (
                              <Option key={cat.value} value={cat.value}>
                                {cat.label}
                              </Option>
                            ))}
                          </Select>
                        ) : (
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {getCategoryLabel(record.type)}
                          </Typography>
                        )}
                      </td>
                      <td className={className}>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editForm.value}
                            onChange={(e) =>
                              setEditForm({ ...editForm, value: e.target.value })
                            }
                            step="0.01"
                            className="min-w-[100px]"
                          />
                        ) : (
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {record.value}
                          </Typography>
                        )}
                      </td>
                      <td className={className}>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={editForm.date}
                            onChange={(e) =>
                              setEditForm({ ...editForm, date: e.target.value })
                            }
                            className="min-w-[150px]"
                          />
                        ) : (
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {formatDate(record.date || record.created_at)}
                          </Typography>
                        )}
                      </td>
                      <td className={className}>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <IconButton
                              size="sm"
                              color="green"
                              onClick={handleSaveEdit}
                            >
                              <CheckIcon className="h-4 w-4" />
                            </IconButton>
                            <IconButton
                              size="sm"
                              color="red"
                              onClick={handleCancelEdit}
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </IconButton>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <IconButton
                              size="sm"
                              color="blue"
                              onClick={() => handleEdit(record)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                            <IconButton
                              size="sm"
                              color="red"
                              onClick={() => handleDelete(recordId)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </div>
                        )}
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

export default PatientDashboard;

