import React from "react";

const AboutHeader = ({ data }) => {
    // ডাটাবেজ থেকে আসা ভ্যালুগুলো সেট করা, না থাকলে ডিফল্ট লেখা থাকবে
    const title = data?.title || "About Our Marketplace";
    const subTitle = data?.subTitle || "World Culture Marketplace (WCM) is a global platform dedicated to showcasing cultural creators, artisans, and storytellers from around the world.";
    // console.log(data)

    // স্টাইল সেটিংস (যদি ডাটাবেজ থেকে ব্যাকগ্রাউন্ড বা টেক্সট কালার কন্ট্রোল করতে চান)
    const bgColor = data?.styleSettings?.backgroundColor || "transparent";
    const textColor = data?.styleSettings?.textColor || "inherit";

    return (
        <section
            className="w-full py-16 md:py-24 px-6"
            style={{ backgroundColor: bgColor }}
        >
            <div className="max-w-4xl mx-auto text-center space-y-8">
                {/* মেইন টাইটেল */}
                <h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight animate-in fade-in slide-in-from-top-4 duration-700"
                    style={{ color: textColor === "inherit" ? "" : textColor }}
                >
                    {title}
                </h1>

                {/* সাব-টাইটেল বা ডেসক্রিপশন */}
                <p
                    className="text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto opacity-90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200"
                    style={{ color: textColor === "inherit" ? "" : textColor }}
                >
                    {subTitle}
                </p>
            </div>
        </section>
    );
};

export default AboutHeader;