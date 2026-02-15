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
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* 🔹 Background Image */}
      <Image
        src="/register.jpg"
        alt="Login Background"
        fill
        priority
        className="object-cover scale-110 blur-md"
      />

      {/* 🔹 Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* 🔹 Logo (same position) */}
      <div
        className="absolute top-4 left-4 cursor-pointer z-20"
        onClick={() => router.push("/")}
      >
        <Image
          src="/World_Culture_Marketplace_logo.png"
          alt="Logo"
          width={90}
          height={90}
          className="h-auto w-auto brightness-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
        />
      </div>

      {/* 🔹 Centered Login Form */}
      <div className="relative z-10 min-h-screen mt-20 md:mt-0 flex items-center justify-center px-4">
        <div className="w-full max-w-md  backdrop-blur-xl rounded-2xl shadow-2xl p-8">

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold mb-2">Welcome Back</h1>
            <p className="text-sm">
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
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email required" })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password required" })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              />
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-center text-gray-50 mt-4">
            By joining, you agree to the{" "}
            <a href="/terms" className="underline">Terms</a> and{" "}
            <a href="/privacy" className="underline">Privacy Policy</a>.
          </p>

        </div>
      </div>
    </div>
  );
}
