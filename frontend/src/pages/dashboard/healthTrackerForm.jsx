import { useForm, Controller } from "react-hook-form";

export default function HealthTrackerForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      steps: "",
      heartbeat: "",
      oxygen: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    alert("Health stats submitted!");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Daily Health Tracker</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Steps */}
        <div>
          <label className="block mb-1 font-medium">Daily Steps</label>
          <Controller
            name="steps"
            control={control}
            rules={{
              required: "Steps are required",
              // min: { value: 1, message: "Steps must be above 0" },
            }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
              />
            )}
          />
          {errors.steps && (
            <p className="text-red-500 text-sm mt-1">{errors.steps.message}</p>
          )}
        </div>

        {/* Heartbeat */}
        <div>
          <label className="block mb-1 font-medium">Heartbeat (bpm)</label>
          <Controller
            name="heartbeat"
            control={control}
            rules={{
              required: "Heartbeat is required",
              // min: { value: 40, message: "Min BPM is 40" },
              // max: { value: 200, message: "Max BPM is 200" },
            }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
              />
            )}
          />
          {errors.heartbeat && (
            <p className="text-red-500 text-sm mt-1">{errors.heartbeat.message}</p>
          )}
        </div>

        <div> q
          <label className="block mb-1 font-medium">Oxygen Level (%)</label>
          <Controller
            name="oxygen"
            control={control}
            rules={{
              required: "Oxygen level is required",
              min: { value: 70, message: "Oxygen must be at least 70%" },
              max: { value: 100, message: "Oxygen cannot exceed 100%" },
            }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
              />
            )}
          />
          {errors.oxygen && (
            <p className="text-red-500 text-sm mt-1">{errors.oxygen.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>

      </form>
    </div>
  );
}
