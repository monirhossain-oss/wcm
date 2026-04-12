import React from "react";

const AboutHeader = () => {
    return (
        <section className="w-full p-8 ">
            <div className="max-w-4xl mx-auto px-6 md:px-8 text-center space-y-8">

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                               font-bold tracking-tight 
                               text-[#1F1F1F] dark:text-white
                               leading-tight">
                    About Our Marketplace
                </h2>

                <p className="text-base sm:text-lg md:text-xl 
                              text-[#555555] dark:text-gray-300 
                              leading-relaxed font-light 
                              max-w-2xl mx-auto">
                    World Culture Marketplace (WCM)
                    is a global platform dedicated to showcasing cultural
                    creators, artisans, and storytellers from around the world. Our mission is to provide a space
                    where culture can be discovered, appreciated, and shared with respect and authenticity.
                </p>

            </div>
        </section>
    );
};

export default AboutHeader;