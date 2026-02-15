"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    if (data.password !== data.password_confirmation) {
      alert("Passwords do not match");
      return;
    }

    console.log("Register Data:", data);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* 🔹 Background Image */}
      <Image
        src="/register.jpg"
        alt="Register Background"
        fill
        priority
        className="object-cover scale-110 blur-md"
      />

      {/* 🔹 Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* 🔹 Logo */}
      <div
        className="absolute top-4 left-4 cursor-pointer z-20"
        onClick={() => router.push("/")}
      >
        <Image
          src="/wc,-web-logo.png"
          alt="Logo"
          width={90}
          height={90}
          className="h-auto w-auto brightness-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
        />
      </div>

      {/* 🔹 Centered Register Form */}
      <div className="relative mt-24 z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/90 dark:bg-black/60 rounded-2xl shadow-2xl p-8">

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold mb-2">
              Create Account
            </h1>
            <p className="text-sm">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="underline text-[var(--color-primary)]"
              >
                Login
              </a>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name Row */}
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  placeholder="First name"
                  {...register("first_name", { required: "Required" })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                />
                {errors.first_name && (
                  <p className="text-red-600 text-xs">{errors.first_name.message}</p>
                )}
              </div>

              <div className="flex-1">
                <input
                  placeholder="Last name"
                  {...register("last_name", { required: "Required" })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                />
                {errors.last_name && (
                  <p className="text-red-600 text-xs">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <input
                placeholder="Username"
                {...register("username", { required: "Username required" })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              />
              {errors.username && (
                <p className="text-red-600 text-xs">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                {...register("email", { required: "Email required" })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              />
              {errors.email && (
                <p className="text-red-600 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password required", minLength: 6 })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                placeholder="Confirm password"
                {...register("password_confirmation", { required: "Confirm password" })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition"
            >
              {isSubmitting ? "Creating..." : "Register"}
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
