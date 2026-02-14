"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.password_confirmation) {
      alert("Passwords do not match");
      return;
    }

    // Just console log the data instead of posting
    console.log("Registration Data:", data);

    // Simulate success navigation (optional)
    alert("Check console for submitted data!");
    // router.push("/login"); // Uncomment later when backend ready
  };

  return (
    <div className="flex m-10">
      {/* Left Side */}
      <div className="relative w-1/2 hidden lg:block">
        <Image
          src="/register.jpg"
          alt="Register Background"
          fill
          className="object-cover"
        />
        {/* Logo */}
        <div
          className="absolute top-4 left-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image src="/register.jpg" alt="Logo" width={100} height={40} />
        </div>
        {/* Overlay Text */}
        <div className="absolute bottom-16 left-12 text-white max-w-xs">
          <h1 className="text-4xl font-bold">Join Our Community</h1>
          <p className="mt-2 text-lg">
            Discover amazing content and creators around the world.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Create Your Account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  {...register("first_name", { required: "First name required" })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                {errors.first_name && (
                  <p className="text-red-600 text-sm">{errors.first_name.message}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  {...register("last_name", { required: "Last name required" })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                {errors.last_name && (
                  <p className="text-red-600 text-sm">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                {...register("username", { required: "Username required" })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              {errors.username && (
                <p className="text-red-600 text-sm">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email required" })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password required", minLength: 6 })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                {...register("password_confirmation", { required: "Confirm your password" })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              {errors.password_confirmation && (
                <p className="text-red-600 text-sm">{errors.password_confirmation.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition"
            >
              {isSubmitting ? "Creating..." : "Register"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <a href="/auth/login" className="underline text-[var(--color-primary)]">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
