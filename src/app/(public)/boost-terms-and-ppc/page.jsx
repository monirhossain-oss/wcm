import BoostListing from '@/components/boost-terms-and-ppc/BoostListing'
import BoostMandatory from '@/components/boost-terms-and-ppc/BoostMandatory'
import BoostPpce from '@/components/boost-terms-and-ppc/BoostPpce'
import BoostPricing from '@/components/boost-terms-and-ppc/BoostPricing'
import BoostPromotion from '@/components/boost-terms-and-ppc/BoostPromotion'
import CreatorBoost from '@/components/boost-terms-and-ppc/CreatorBoost'
import CreatorsPpc from '@/components/boost-terms-and-ppc/CreatorsPpc'
import Hero from '@/components/boost-terms-and-ppc/Hero'
import ListingPpc from '@/components/boost-terms-and-ppc/ListingPpc'
import PayPerClick from '@/components/boost-terms-and-ppc/PayPerClick'
import PpcPromotion from '@/components/boost-terms-and-ppc/PpcPromotion'
import PromotionBudget from '@/components/boost-terms-and-ppc/PromotionBudget'
import React from 'react'
import { buildTranslationMap } from '@/lib/staticPageLocalization'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

const getPublishedContent = async (languageCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/translations/static-pages/boost-terms-and-ppc/${languageCode}`, { next: { revalidate: 60 } })
    if (!response.ok) return null
    const payload = await response.json()
    return payload.data?.content || null
  } catch {
    return null
  }
}

async function page({ locale = 'en' } = {}) {
  const englishContent = await getPublishedContent('en')
  if (!englishContent) {
    return <main className="mx-auto max-w-4xl px-6 py-20"><p>Boost &amp; PPC Terms are temporarily unavailable.</p></main>
  }
  const localizedContent = !locale || locale === 'en'
    ? englishContent
    : (await getPublishedContent(locale)) || englishContent
  const translations = buildTranslationMap(englishContent, localizedContent)

  return (
    <main className='min-h-screen bg-white dark:bg-[#0F0F0E]'>
      <Hero translations={translations}/>
      <div className="max-w-5xl mx-auto  px-4 ">
      <BoostPromotion translations={translations}/>
      <BoostListing translations={translations}/>
      <CreatorBoost translations={translations}/>
      <BoostPpce translations={translations}/>
      <BoostMandatory translations={translations}/>
      <PromotionBudget translations={translations}/>
      <PayPerClick translations={translations}/>
      <PpcPromotion translations={translations}/>
      <ListingPpc translations={translations}/>
      <CreatorsPpc translations={translations}/>
      <BoostPricing translations={translations} businessValues={localizedContent.businessValues}/>
    </div>
    </main>
  )
}

export default page
