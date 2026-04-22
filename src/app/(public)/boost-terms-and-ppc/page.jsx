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

function page() {
  return (
    <main className='min-h-screen bg-white dark:bg-[#0F0F0E]'>
      <Hero/>
      <div className="max-w-5xl mx-auto  px-4 ">
      <BoostPromotion/>
      <BoostListing/>
      <CreatorBoost/>
      <BoostPpce/>
      <BoostMandatory/>
      <PromotionBudget/>
      <PayPerClick/>
      <PpcPromotion/>
      <ListingPpc/>
      <CreatorsPpc/>
      <BoostPricing/>
    </div>
    </main>
  )
}

export default page
