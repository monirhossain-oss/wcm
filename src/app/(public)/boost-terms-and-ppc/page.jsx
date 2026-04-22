import BoostListing from '@/components/boost-terms-and-ppc/BoostListing'
import BoostMandatory from '@/components/boost-terms-and-ppc/BoostMandatory'
import BoostPpce from '@/components/boost-terms-and-ppc/BoostPpce'
import BoostPromotion from '@/components/boost-terms-and-ppc/BoostPromotion'
import CreatorBoost from '@/components/boost-terms-and-ppc/CreatorBoost'
import Hero from '@/components/boost-terms-and-ppc/Hero'
import PayPerClick from '@/components/boost-terms-and-ppc/PayPerClick'
import PpcPromotion from '@/components/boost-terms-and-ppc/PpcPromotion'
import PromotionBudget from '@/components/boost-terms-and-ppc/PromotionBudget'
import React from 'react'

function page() {
  return (
    <main className='min-h-screen'>
      <Hero/>
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-16">
      <BoostPromotion/>
      <BoostListing/>
      <CreatorBoost/>
      <BoostPpce/>
      <BoostMandatory/>
      <PromotionBudget/>
      <PayPerClick/>
      <PpcPromotion/>
    </div>
    </main>
  )
}

export default page
