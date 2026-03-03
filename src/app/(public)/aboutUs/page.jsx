
import AboutContent from "@/components/about/AboutContent";
import AboutShape from "@/components/about/AboutShape";
import AboutExplore from "@/components/about/AboutExplore";
import AboutPresting from "@/components/about/AboutPresting";
import AboutCulture from "@/components/about/AboutCulture";
import AboutHeader from "@/components/about/AboutHeader";

export default function Page() {
    return (
        <main className="bg-white dark:bg-[#0a0a0a]">
            <AboutHeader />
            <AboutContent />
            <AboutShape />
            <AboutExplore />
            <AboutPresting />
            <AboutCulture />
        </main>
    );
}