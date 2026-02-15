"use client";

import { useForm } from "react-hook-form";

export default function UserProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Profile Data:", data);
  };

  return (
    <div className="min-h-screen mt-10 relative">

      {/* 🔹 MOBILE BG IMAGE */}
      <div
        className="absolute inset-0 lg:hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/register.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* 🔹 TOP TITLE (MOBILE OVER IMAGE) */}
      <div className="relative lg:hidden text-center text-white px-6 pt-20 pb-10">
        <h1 className="text-3xl font-bold mb-3">Become a Creator</h1>
        <p className="opacity-90 max-w-md mx-auto">
          Create your creator profile to showcase your culture, products, and
          story to a global audience.
        </p>
      </div>

      {/* 🔹 DESKTOP TOP TITLE */}
      <div className="relative hidden lg:block max-w-6xl mx-auto pt-16 pb-10 px-6 text-center">
        <h1 className="text-4xl font-bold mb-3">Become a Creator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create your creator profile to showcase your culture, products, and
          story to a global audience.
        </p>
      </div>

      {/* 🔹 MAIN GRID */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12">

        {/* LEFT IMAGE (DESKTOP ONLY) */}
        <div
          className="relative lg:col-span-5 hidden lg:flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/register.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/55"></div>
          <div className="relative z-10 text-white px-10">
            <h2 className="text-3xl font-bold mb-3">Tell Your Story</h2>
            <p className="text-lg opacity-90">
              Your creator profile helps people discover who you are,
              what you create, and why it matters.
            </p>
          </div>
        </div>

        {/* RIGHT FORM (OVER IMAGE ON MOBILE) */}
        <div className="lg:col-span-7 flex justify-center px-6 pb-16">
          <div className="w-full max-w-3xl">

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 bg-white/60 dark:bg-gray-900/70 rounded-xl p-4 lg:p-10 shadow-xl"
            >
              {/* Display Name + Username */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Display Name
                  </label>
                  <input
                    {...register("display_name", { required: "Required" })}
                    placeholder="Your public display name"
                    className="w-full border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Username
                  </label>
                  <input
                    {...register("username", { required: "Required" })}
                    placeholder="Unique username"
                    className="w-full border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Bio
                </label>
                <textarea
                  {...register("bio")}
                  rows={4}
                  placeholder="Tell people about yourself and your work"
                  className="w-full border border-gray-300 dark:border-gray-700
      bg-white dark:bg-gray-900
      text-gray-900 dark:text-gray-100
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Profile Image URL
                  </label>
                  <input
                    {...register("profile_image")}
                    placeholder="https://example.com/profile.jpg"
                    className="w-full border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Cover Image URL
                  </label>
                  <input
                    {...register("cover_image")}
                    placeholder="https://example.com/cover.jpg"
                    className="w-full border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              {/* country+city */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Country
                  </label>
                  <input
                    {...register("country", { required: "Required" })}
                    placeholder="Country you are based in"
                    className="w-full border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                    City
                  </label>
                  <input
                    {...register("city", { required: "Required" })}
                    placeholder="City you are based in"
                    className="w-full border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              {/* language */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Language
                </label>
                <input
                  {...register("language", { required: "Required" })}
                  placeholder="Language you are fluent in"
                  className="w-full border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        rounded-lg px-3 py-2"
                />
              </div>
              {/* website link  */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Website Link  
                </label>
                <input
                  {...register("website_link", { required: "Required" })}
                  placeholder="https://your-website.com"
                  className="w-full border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        rounded-lg px-3 py-2"
                />
              </div>
              {/* Social link */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Social Link
                </label>
                <input
                  {...register("social_link", { required: "Required" })}
                  placeholder="https://your-social-link.com"
                  className="w-full border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        rounded-lg px-3 py-2"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer bg-orange-500 text-white py-3 rounded-lg font-semibold hover:opacity-90"
              >
                Submit for Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
