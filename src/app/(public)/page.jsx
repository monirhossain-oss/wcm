import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import ListingsSection from "@/components/TrendingListings";
import NewsletterSection from "@/components/Footer";
import PopularCreators from "@/components/PopularCreators";
import SpecialBanner from "@/components/SpecialBanner";


export default function HomePage() {
  return (
    <div>
        <HeroSection />
        <FeaturesSection></FeaturesSection>
        <ListingsSection></ListingsSection>
        <SpecialBanner></SpecialBanner>
        <PopularCreators></PopularCreators>
        <NewsletterSection></NewsletterSection>
    </div>
  );
}
