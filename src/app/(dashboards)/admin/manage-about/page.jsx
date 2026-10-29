"use client";

import React, { useEffect, useState } from 'react';
import aboutService from './_services/aboutService';
import { toast } from 'react-hot-toast'; // নোটিফিকেশনের জন্য

// সেকশন কম্পোনেন্টগুলো ইম্পোর্ট করা হচ্ছে
import AboutHeader from './_components/AboutHeader';
import IntroSection from './_components/IntroSection';
import StorySection from './_components/StorySection';
import ExplorerJourney from './_components/ExplorerJourney';
import Principles from './_components/Principles';
import VisionSection from './_components/VisionSection';
import Visibility from './_components/Visibility';

const AdminAboutPage = () => {
    const [loading, setLoading] = useState(true);
    const [aboutData, setAboutData] = useState(null);

    // ১. মাউন্ট হওয়ার সময় সব ডেটা ফেচ করা
    const fetchAboutData = async () => {
        try {
            setLoading(true);
            const res = await aboutService.getAboutPage();
            if (res.success) {
                setAboutData(res.data);
            }
        } catch (error) {
            toast.error("Failed to load about page data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAboutData();
    }, []);

    // ২. রিসেট ফাংশন
    const handleReset = async () => {
        if (window.confirm("Are you sure? This will reset all about page data to defaults!")) {
            try {
                const res = await aboutService.resetAboutPage();
                if (res.success) {
                    setAboutData(res.data);
                    toast.success("Page reset successfully!");
                }
            } catch (error) {
                toast.error("Reset failed");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0B1120] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B1120] p-4 md:p-8 text-gray-100">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Customize About Page
                    </h1>
                    <p className="text-gray-400 mt-1">Manage all sections and content of your About page</p>
                </div>
                <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl transition-all font-medium text-sm"
                >
                    Reset to Default
                </button>
            </div>

            {/* Grid Layout for Sections */}
            <div className="space-y-8 max-w-7xl mx-auto">

                {/* ১. Header Settings */}
                <AboutHeader data={aboutData?.aboutHeader} refresh={fetchAboutData} />

                {/* ২. Intro Section (Grid Images) */}
                <IntroSection data={aboutData?.introSection} refresh={fetchAboutData} />

                {/* ৩. Story Section */}
                <StorySection data={aboutData?.storySection} refresh={fetchAboutData} />

                {/* ৪. Explorer Journey Steps */}
                <ExplorerJourney data={aboutData?.explorerJourney} refresh={fetchAboutData} />

                {/* ৫. Principles Section */}
                <Principles data={aboutData?.principlesSection} refresh={fetchAboutData} />

                {/* ৬. Vision Section */}
                <VisionSection data={aboutData?.visionSection} refresh={fetchAboutData} />

                {/* ৭. Visibility / Founder Section */}
                <Visibility data={aboutData?.visibilitySection} refresh={fetchAboutData} />

            </div>

            {/* Footer space */}
            <div className="h-20" />
        </div>
    );
};

export default AdminAboutPage;