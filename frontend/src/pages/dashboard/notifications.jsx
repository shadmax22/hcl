import React from "react";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export function Notifications() {
  const [showAlerts, setShowAlerts] = React.useState({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });
  const [showAlertsWithIcon, setShowAlertsWithIcon] = React.useState({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });
  const alerts = ["gray", "green", "orange", "red"];

  return (
    <div className="my-3 flex max-w-screen-lg flex-col gap-8">

      {alerts.map((color) => (
        <Alert
          key={color}
          open={showAlerts[color]}
          color={color}
          onClose={() => setShowAlerts((current) => ({ ...current, [color]: false }))}
        >
          A simple {color} alert with an <a href="#">example link</a>. Give
          it a click if you like.
        </Alert>
      ))}

    </div>
  );
}

export default Notifications;
