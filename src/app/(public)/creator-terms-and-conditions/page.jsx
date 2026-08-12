import ContentTypesSection from '@/components/creators-terms/ContentTypesSection'
import EligibilitySection from '@/components/creators-terms/Eligibility'
import Hero from '@/components/creators-terms/Hero'
import IntroductionSection from '@/components/creators-terms/Introduction'
import LicenseSection from '@/components/creators-terms/LicenseSection'
import OwnershipSection from '@/components/creators-terms/OwnershipSection'
import Purpose from '@/components/creators-terms/Purpose'
import ResponsibilitiesSection from '@/components/creators-terms/ResponsibilitiesSection'
import PlatformRoleSection from '@/components/creators-terms/PlatformRoleSection'
import ProhibitedSubmissions from '@/components/creators-terms/ProhibitedSubmissions'
import SponsoredContent from '@/components/creators-terms/SponsoredContent'
import RemovalSection from '@/components/creators-terms/RemovalSection'
import AccountStatusSection from '../terms-and-conditions/AccountStatusSection'
import GuaranteeSection from '@/components/creators-terms/GuaranteeSection'
import LimitationSection from '@/components/creators-terms/LimitationSection'
import ForceMajeureSection from '@/components/creators-terms/ForceMajeureSection'
import ModificationSection from '@/components/creators-terms/ModificationSection'
import ContactSection from '@/components/creators-terms/ContactSection'
import GoverningLawSection from '@/components/creators-terms/GoverningLawSection'
import { buildTranslationMap, localizeValue } from '@/lib/staticPageLocalization'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

const getPublishedContent = async (languageCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/translations/static-pages/creator-terms-and-conditions/${languageCode}`, { next: { revalidate: 60 } })
    if (!response.ok) return null
    const payload = await response.json()
    return payload.data?.content || null
  } catch {
    return null
  }
}

const renderLocalized = (Section, translations) => localizeValue(Section(), translations)

export default async function CreatorTermsPage({ locale = 'en' } = {}) {
  const englishContent = await getPublishedContent('en')
  if (!englishContent) {
    return <main className="mx-auto max-w-4xl px-6 py-20"><p>Creator Terms &amp; Conditions are temporarily unavailable.</p></main>
  }
  const localizedContent = !locale || locale === 'en'
    ? englishContent
    : (await getPublishedContent(locale)) || englishContent
  const translations = buildTranslationMap(englishContent, localizedContent)
  const sections = [
    IntroductionSection, Purpose, EligibilitySection, ContentTypesSection, OwnershipSection,
    LicenseSection, ResponsibilitiesSection, PlatformRoleSection, ProhibitedSubmissions,
    SponsoredContent, RemovalSection, AccountStatusSection, GuaranteeSection, LimitationSection,
    ForceMajeureSection, ModificationSection, ContactSection, GoverningLawSection,
  ]

  return (
    <main className="min-h-screen ">
      {renderLocalized(Hero, translations)}
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-16">
        {sections.map((Section) => (
          <section key={Section.name}>{renderLocalized(Section, translations)}</section>
        ))}
      </div>
    </main>
  )
}
