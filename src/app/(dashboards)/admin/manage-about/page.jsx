"use client";

import React, { useState, useEffect } from "react";
import aboutService from "./_services/aboutService";
import { toast } from "react-hot-toast";
import { FiRefreshCw, FiSave } from "react-icons/fi";

import AboutHeader from "./_components/AboutHeader";
import IntroSection from "./_components/IntroSection";
import StorySection from "./_components/StorySection";
import ExplorerJourney from "./_components/ExplorerJourney";
import Principles from "./_components/Principles";
import VisionSection from "./_components/VisionSection";
import Visibility from "./_components/Visibility";

const ManageAboutPage = () => {
    const [loading, setLoading] = useState(true);
    const [aboutData, setAboutData] = useState(null);

    const fetchAboutData = async () => {
        try {
            setLoading(true);
            const res = await aboutService.getAboutPage();
            if (res.data?.success) {
                setAboutData(res.data.data);
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

    const handleReset = async () => {
        if (window.confirm("Are you sure? This will reset ALL about page data to defaults!")) {
            try {
                const res = await aboutService.resetAboutPage();
                if (res.data?.success) {
                    setAboutData(res.data.data);
                    toast.success("Page reset successfully!");
                }
            } catch (error) {
                toast.error("Reset failed");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F57C00]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-800 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#F57C00] flex items-center gap-3">
                            Manage About Page
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">
                            Manage all sections of your About page
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 bg-red-900/30 text-red-400 border border-red-900/50 rounded-xl hover:bg-red-900/50 transition-all text-sm font-medium"
                        >
                            <FiRefreshCw /> Reset All
                        </button>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    <AboutHeader data={aboutData?.aboutHeader} refresh={fetchAboutData} />
                    <IntroSection data={aboutData?.introSection} refresh={fetchAboutData} />
                    <StorySection data={aboutData?.storySection} refresh={fetchAboutData} />
                    <ExplorerJourney data={aboutData?.explorerJourney} refresh={fetchAboutData} />
                    <Principles data={aboutData?.principlesSection} refresh={fetchAboutData} />
                    <VisionSection data={aboutData?.visionSection} refresh={fetchAboutData} />
                    <Visibility data={aboutData?.visibilitySection} refresh={fetchAboutData} />
                </div>

                <div className="h-20" />
            </div>
        </div>
    );
};

export default ManageAboutPage;