"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AnimationDemoPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Framer Motion Animation Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Beautiful animations added to login and register pages
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Login Page Animations</CardTitle>
                <CardDescription>
                  Experience smooth animations on the login page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Animation Features:</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Form slides in from bottom with fade</li>
                    <li>• Logo rotates and scales in</li>
                    <li>• Input fields slide in from left with stagger</li>
                    <li>• Buttons have hover and tap animations</li>
                    <li>• Google icon rotates on hover</li>
                    <li>• Divider lines scale in from center</li>
                  </ul>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/login">
                    <Button className="w-full">View Login Page</Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Register Page Animations</CardTitle>
                <CardDescription>
                  Beautiful animations on the registration page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Animation Features:</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Form slides in from bottom with fade</li>
                    <li>• Logo rotates and scales in</li>
                    <li>• Input fields slide in from left with stagger</li>
                    <li>• Buttons have hover and tap animations</li>
                    <li>• Google icon rotates on hover</li>
                    <li>• Divider lines scale in from center</li>
                  </ul>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/register">
                    <Button className="w-full">View Register Page</Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Animation Details</CardTitle>
              <CardDescription>
                Technical implementation of the animations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Page Level Animations:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• AuthBanner slides in from left</li>
                    <li>• Form container slides in from right</li>
                    <li>• ThemeToggle fades in from top</li>
                    <li>• Form fades in from bottom</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Form Level Animations:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Logo rotates and scales in</li>
                    <li>• Title slides in from top</li>
                    <li>• Input fields stagger from left</li>
                    <li>• Buttons scale on hover/tap</li>
                    <li>• Links scale on hover/tap</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Animation Timing:</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Initial Load:</strong> 0.6s total duration with staggered delays</p>
                  <p><strong>Form Elements:</strong> 0.5s duration with 0.1s delays between elements</p>
                  <p><strong>Hover Effects:</strong> 0.2s duration for smooth interactions</p>
                  <p><strong>Page Transitions:</strong> 0.8s duration with easeOut timing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Try the Animations!</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/login">
                    <Button size="lg" className="w-full sm:w-auto">
                      Login Page
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/register">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Register Page
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

