import React, { useState, useEffect } from "react";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import api from "../../../axios.js";

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      // Determine which endpoint to use based on user role
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const role = user.role;

      let response;
      if (role === "healthcare_provider") {
        response = await api.get("/v1/doctor/notifications");
      } else {
        response = await api.get("/v1/patient/notifications");
      }

      if (response.data && response.data.notifications) {
        setNotifications(response.data.notifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "green";
      case "warning":
        return "orange";
      case "error":
        return "red";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="my-3 flex max-w-screen-lg flex-col gap-8">
        <Typography variant="h6" color="blue-gray" className="text-center">
          Loading notifications...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-3 flex max-w-screen-lg flex-col gap-8">
        <Alert color="red">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="my-3 flex max-w-screen-lg flex-col gap-8">
      <Typography variant="h2" color="blue-gray" className="mb-4">
        Notifications
      </Typography>

      {notifications.length === 0 ? (
        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="text-center">
              No notifications found
            </Typography>
          </CardBody>
        </Card>
      ) : (
        notifications.map((notification, index) => (
          <Alert
            key={notification._id || index}
            color={getNotificationColor(notification.type)}
            icon={<InformationCircleIcon className="h-6 w-6" />}
          >
            <div className="flex flex-col gap-2">
              <Typography variant="h6" className="font-semibold">
                {notification.title || "Notification"}
              </Typography>
              <Typography variant="small">
                {notification.message || notification.content || "No message"}
              </Typography>
              {notification.created_at && (
                <Typography variant="small" className="text-gray-600 mt-2">
                  {formatDate(notification.created_at)}
                </Typography>
              )}
            </div>
          </Alert>
        ))
      )}
    </div>
  );
}

export default Notifications;
