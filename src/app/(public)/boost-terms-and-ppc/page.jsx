import BoostListing from '@/components/boost-terms-and-ppc/BoostListing'
import BoostPpce from '@/components/boost-terms-and-ppc/BoostPpce'
import BoostPromotion from '@/components/boost-terms-and-ppc/BoostPromotion'
import CreatorBoost from '@/components/boost-terms-and-ppc/CreatorBoost'
import Hero from '@/components/boost-terms-and-ppc/Hero'
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
    </div>
    </main>
  )
}

export default page
