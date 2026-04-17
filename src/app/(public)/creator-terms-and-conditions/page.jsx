import React from 'react'
import ContentTypesSection from '@/components/creators-terms/ContentTypesSection'
import EligibilitySection from '@/components/creators-terms/Eligibility'
import Hero from '@/components/creators-terms/Hero'
import IntroductionSection from '@/components/creators-terms/Introduction'
import LicenseSection from '@/components/creators-terms/LicenseSection'
import OwnershipSection from '@/components/creators-terms/OwnershipSection'
import Purpose from '@/components/creators-terms/Purpose'
import ResponsibilitiesSection from '@/components/creators-terms/ResponsibilitiesSection'
import PlatformRoleSection from '@/components/creators-terms/PlatformRoleSection'

export default function CreatorTermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      {/* একটি সেন্ট্রাল কন্টেইনার ব্যবহার করছি যাতে সব সেকশন এলাইনমেন্ট ঠিক থাকে */}
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-16">
        <IntroductionSection />
        <Purpose />
        <EligibilitySection />
        <ContentTypesSection />
        <OwnershipSection />
        <LicenseSection />
        <ResponsibilitiesSection />
        <PlatformRoleSection/>
      </div>
    </main>
  )
}