"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    alert("Check console for submitted data!");
    // router.push("/dashboard"); // Uncomment later when backend ready
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side */}
      <div className="relative w-full lg:w-5/12 mb-8 lg:mb-0">
        <Image
          src="/register.jpg"
          alt="Login Background"
          fill
          className="object-cover brightness-50"
        />

        {/* Logo */}
        <div
          className="absolute top-4 left-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <h1 className="text-xl font-semibold text-[#F57C00]">WCM</h1>
        </div>

        {/* Overlay Text */}
        <div className="absolute bottom-16 left-6 lg:left-12 max-w-xs">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Welcome Back!
          </h1>
          <p className="mt-2 text-lg text-white drop-shadow-md">
            Login to continue and discover amazing content.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center px-4 lg:px-8">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl mt-8 font-extrabold text-center mb-2">
              Welcome Back             </h1>
            <p className="text-sm text-center">
              Don't have an account?{" "}
              <a
                href="/auth/register"
                className="underline text-[var(--color-primary)]"
              >
                Register
              </a>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block font-medium mb-1">Enter Your Email</label>
              <input
                placeholder="Enter Your Email"
                type="email"
                {...register("email", { required: "Email required" })}
                className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium mb-1">Enter Your Password</label>
              <input
              placeholder="Enter Your Password"
                type="password"
                {...register("password", { required: "Password required" })}
                className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Terms & Privacy */}
          <p className="text-xs text-center text-gray-500 mt-4">
            By joining, you agree to the{" "}
            <a href="/terms" className="underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
