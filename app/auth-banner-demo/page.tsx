"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthBanner } from "@/components/modules/common/AuthBanner/AuthBanner";

export default function AuthBannerDemoPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-screen">
        {/* AuthBanner with animations */}
        <AuthBanner />
        
        {/* Demo information */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="p-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>AuthBanner Animations</CardTitle>
              <CardDescription>
                Beautiful Framer Motion animations added to the AuthBanner component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Animation Sequence:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span><strong>0.0s:</strong> Banner container slides in from left</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span><strong>0.2s:</strong> Text container fades in from bottom</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span><strong>0.4s:</strong> Main title slides in from top</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span><strong>0.6s:</strong> Description text fades in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span><strong>0.8s:</strong> Image container scales in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span><strong>1.0s:</strong> Banner image slides up</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span><strong>1.2s:</strong> Animated dots scale in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span><strong>1.4s:</strong> First stat card slides in from left</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span><strong>1.6s:</strong> Second stat card slides in from right</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Animation Features:</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Smooth slide-in from left for the main container</li>
                  <li>• Staggered text animations with fade and slide effects</li>
                  <li>• Scale animation for the image container</li>
                  <li>• Coordinated stat card animations from opposite sides</li>
                  <li>• Animated dots that scale in with the background</li>
                  <li>• Total animation duration: 1.8 seconds</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Technical Details:</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong>Duration:</strong> 0.6-0.8s per element</li>
                  <li>• <strong>Easing:</strong> easeOut for smooth deceleration</li>
                  <li>• <strong>Delays:</strong> 0.2s increments for staggered effect</li>
                  <li>• <strong>Transforms:</strong> translateX, translateY, scale, opacity</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/login">
                    <Button className="w-full sm:w-auto">
                      View Login Page
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/register">
                    <Button variant="outline" className="w-full sm:w-auto">
                      View Register Page
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

