import { Modal } from "react-easetools";
import { useForm, Controller } from "react-hook-form";

export async function AddDoctorModal() {


  await Modal({
    title: "Add Doctor",
    body: (resolver) => <AddDoctor></AddDoctor>,
    size: "fluid",
    footer: () => <></>
  })
}


function AddDoctor() {

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone_no: "",
      DOB: "",
      gender: "",
      specialisation: "",
      care_category: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Doctor Submitted:", data);

    alert("Doctor Added Successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-[40vw] max-h-[400px] overflow-scroll">

      {/* ------------------------- NAME -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Full Name</label>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Enter doctor's full name"
            />
          )}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* ------------------------- EMAIL -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter valid email",
            },
          }}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              className="w-full border px-3 py-2 rounded-md"
              placeholder="doctor@example.com"
            />
          )}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* ------------------------- PASSWORD -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Password</label>
        <Controller
          name="password"
          control={control}
          rules={{ required: "Password is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="password"
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Create password"
            />
          )}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {/* ------------------------- PHONE -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Phone Number</label>
        <Controller
          name="phone_no"
          control={control}
          rules={{ required: "Phone number is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full border px-3 py-2 rounded-md"
              placeholder="+91 XXXXX XXXXX"
            />
          )}
        />
        {errors.phone_no && (
          <p className="text-red-500 text-sm">{errors.phone_no.message}</p>
        )}
      </div>

      {/* ------------------------- DOB -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Date of Birth</label>
        <Controller
          name="DOB"
          control={control}
          rules={{ required: "DOB is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="date"
              className="w-full border px-3 py-2 rounded-md"
            />
          )}
        />
        {errors.DOB && <p className="text-red-500 text-sm">{errors.DOB.message}</p>}
      </div>

      {/* ------------------------- GENDER -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Gender</label>
        <Controller
          name="gender"
          control={control}
          rules={{ required: "Gender is required" }}
          render={({ field }) => (
            <select
              {...field}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          )}
        />
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
      </div>

      {/* ------------------------- SPECIALISATION -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Specialisation</label>
        <Controller
          name="specialisation"
          control={control}
          rules={{ required: "Specialisation is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Cardiologist, Orthopedic, etc."
              className="w-full border px-3 py-2 rounded-md"
            />
          )}
        />
        {errors.specialisation && (
          <p className="text-red-500 text-sm">{errors.specialisation.message}</p>
        )}
      </div>

      {/* ------------------------- CARE CATEGORY -------------------------- */}
      <div>
        <label className="block mb-1 font-medium">Care Category</label>
        <Controller
          name="care_category"
          control={control}
          rules={{ required: "Care category is required" }}
          render={({ field }) => (
            <select {...field} className="w-full border px-3 py-2 rounded-md">
              <option value="">Select Healthcare Category</option>
              <option value="cardiology">Cardiology</option>
              <option value="neurology">Neurology</option>
              <option value="dermatology">Dermatology</option>
              <option value="general">General</option>
            </select>
          )}
        />
        {errors.care_category && (
          <p className="text-red-500 text-sm">{errors.care_category.message}</p>
        )}
      </div>

      {/* ------------------------- SUBMIT BUTTON -------------------------- */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition sticky bottom-0"
      >
        Add Doctor
      </button>

    </form>
  );
}
