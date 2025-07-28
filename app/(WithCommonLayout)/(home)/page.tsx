import React from 'react'
import PublicPricingList from "@/components/modules/pricing/PublicPricingList/PublicPricingList";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#FDFEFF] to-[#EAF2FF] dark:from-[#0B0E20] dark:to-[#0B0E20]">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Premium Templates for
              <span className="text-[#0F5BBD]"> Modern Projects</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Choose from our curated collection of high-quality templates. 
              All templates include lifetime updates and professional support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/template">
                <Button className="bg-[#0F5BBD] hover:bg-[#0F5BBD]/90 text-white px-8 py-3 text-lg">
                  Browse Templates
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-[#0F5BBD] text-[#0F5BBD] hover:bg-[#0F5BBD] hover:text-white px-8 py-3 text-lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white dark:bg-[#0A0D21]">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Flexible pricing options designed to meet your needs. 
              Start with our basic plan or unlock premium features with our advanced packages.
            </p>
          </motion.div>
          
          <PublicPricingList />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0F5BBD] to-[#0F5BBD]/90">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust our templates for their projects.
            </p>
            <Link href="/register">
              <Button className="bg-white text-[#0F5BBD] hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Get Started Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
