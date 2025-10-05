import CheckoutContainer from '@/components/modules/CommonModules/checkout/CheckoutContainer'
import React from 'react'

export default function CheckoutPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CheckoutContainer templateId={params.id} />
    </div>
  )
}
