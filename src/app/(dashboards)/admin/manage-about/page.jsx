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

const setNestedValue = (value, path, nextValue) => {
    const copy = structuredClone(value);
    let current = copy;
    path.slice(0, -1).forEach((part) => { current = current[part]; });
    current[path[path.length - 1]] = nextValue;
    return copy;
};

const FrenchFields = ({ source, translated, path = [], onChange }) => {
    if (typeof source === "string") {
        const label = path.map((part) => String(part).replace(/([A-Z])/g, " $1")).join(" / ");
        const multiline = source.length > 80;
        const Field = multiline ? "textarea" : "input";
        return (
            <div className="rounded-xl border border-gray-800 bg-[#111] p-4 space-y-2">
                <label className="block text-sm font-semibold capitalize text-orange-400">{label}</label>
                <p className="text-xs text-gray-500 whitespace-pre-wrap">English: {source}</p>
                <Field
                    rows={multiline ? 4 : undefined}
                    value={translated || ""}
                    onChange={(event) => onChange(path, event.target.value)}
                    placeholder="Leave blank to use English"
                    className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none focus:border-orange-500"
                />
            </div>
        );
    }
    if (Array.isArray(source)) return source.map((item, index) => (
        <FrenchFields key={[...path, index].join(".")} source={item} translated={translated?.[index]} path={[...path, index]} onChange={onChange} />
    ));
    if (source && typeof source === "object") return Object.entries(source).map(([key, item]) => (
        <FrenchFields key={[...path, key].join(".")} source={item} translated={translated?.[key]} path={[...path, key]} onChange={onChange} />
    ));
    return null;
};

const ManageAboutPage = () => {
    const [loading, setLoading] = useState(true);
    const [aboutData, setAboutData] = useState(null);
    const [language, setLanguage] = useState("en");
    const [frenchEditor, setFrenchEditor] = useState(null);
    const [savingFrench, setSavingFrench] = useState(false);

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

    const loadFrenchEditor = async () => {
        try {
            setLoading(true);
            const res = await aboutService.getFrenchTranslation();
            setFrenchEditor(res.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load French About content");
        } finally {
            setLoading(false);
        }
    };

    const switchLanguage = async (code) => {
        setLanguage(code);
        if (code === "fr") await loadFrenchEditor();
    };

    const saveFrench = async () => {
        try {
            setSavingFrench(true);
            const res = await aboutService.updateFrenchTranslation({
                content: frenchEditor.translatedContent,
                expectedVersion: frenchEditor.versionNumber,
            });
            setFrenchEditor(res.data.data);
            toast.success("French About content published successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "French publish failed");
        } finally {
            setSavingFrench(false);
        }
    };

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
                    <div className="flex flex-wrap gap-3">
                        <div className="flex rounded-xl border border-gray-700 p-1">
                            {["en", "fr"].map((code) => (
                                <button key={code} type="button" onClick={() => switchLanguage(code)} className={`rounded-lg px-4 py-2 font-bold uppercase ${language === code ? "bg-orange-600 text-white" : "text-gray-400"}`}>
                                    {code}
                                </button>
                            ))}
                        </div>
                        {language === "en" && <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 bg-red-900/30 text-red-400 border border-red-900/50 rounded-xl hover:bg-red-900/50 transition-all text-sm font-medium"
                        >
                            <FiRefreshCw /> Reset All
                        </button>}
                    </div>
                </div>

                {/* Sections */}
                {language === "en" ? <div className="space-y-8">
                    <AboutHeader data={aboutData?.aboutHeader} refresh={fetchAboutData} />
                    <IntroSection data={aboutData?.introSection} refresh={fetchAboutData} />
                    <StorySection data={aboutData?.storySection} refresh={fetchAboutData} />
                    <ExplorerJourney data={aboutData?.explorerJourney} refresh={fetchAboutData} />
                    <Principles data={aboutData?.principlesSection} refresh={fetchAboutData} />
                    <VisionSection data={aboutData?.visionSection} refresh={fetchAboutData} />
                    <Visibility data={aboutData?.visibilitySection} refresh={fetchAboutData} />
                </div> : frenchEditor && (
                    <div className="space-y-5">
                        <div className="rounded-xl border border-orange-900/50 bg-orange-950/20 p-4 text-sm text-gray-300">
                            Only text is editable here. Blank French fields use the English value; images, icons, colors and list structure remain English-owned.
                        </div>
                        <FrenchFields
                            source={frenchEditor.sourceContent}
                            translated={frenchEditor.translatedContent}
                            onChange={(path, value) => setFrenchEditor((current) => ({
                                ...current,
                                translatedContent: setNestedValue(current.translatedContent, path, value),
                            }))}
                        />
                        <button type="button" disabled={savingFrench} onClick={saveFrench} className="sticky bottom-6 flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white shadow-xl disabled:opacity-60">
                            <FiSave /> {savingFrench ? "Publishing..." : "Publish French"}
                        </button>
                    </div>
                )}

                <div className="h-20" />
            </div>
        </div>
    );
};

export default ManageAboutPage;
