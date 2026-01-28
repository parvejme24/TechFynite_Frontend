import BillingContainer from '@/components/modules/CommonModules/billing/BillingContainer'
import React from 'react'

export default async function BillingPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Handle async params for Next.js 15
  const resolvedParams = params instanceof Promise ? await params : params;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BillingContainer pricingPlanId={resolvedParams.id} />
    </div>
  )
}
