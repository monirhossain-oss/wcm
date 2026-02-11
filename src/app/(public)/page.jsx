import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import ListingsSection from "@/components/TrendingListings";
import NewsletterSection from "@/components/NewsletterSection";

export default function HomePage() {
  return (
    <div>
        <HeroSection />
        <FeaturesSection></FeaturesSection>
        <ListingsSection></ListingsSection>
        <NewsletterSection></NewsletterSection>
    </div>
  );
}
