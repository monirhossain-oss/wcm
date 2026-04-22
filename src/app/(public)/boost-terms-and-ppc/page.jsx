import BoostPromotion from '@/components/boost-terms-and-ppc/BoostPromotion'
import Hero from '@/components/boost-terms-and-ppc/Hero'
import React from 'react'

function page() {
  return (
    <main className='min-h-screen'>
      <Hero/>
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-16">
      <BoostPromotion/>
    </div>
    </main>
  )
}

export default page
