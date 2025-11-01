import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { backendApi } from "@/lib/constant"
import { useAdminAuthStore } from "@/store/adminAuth"
import axios from "axios"
import { motion } from "framer-motion"
import { CheckCircle, Loader } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"

export function OTPLogin() {
  const [email, setEmail] = useState([
    "RESEARCHANDECONOMICS@TONGSTON.COM",
    "ADMIN@TONGSTON.COM",
    "gulzar@yopmail.com"
  ]);
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const { login } = useAdminAuthStore();
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    try {
      const response = await axios.post(`${backendApi}/api/sendOtp`, { emails: email })
      if (response.status === 200) {
        setEmail(email) // Store email for OTP verification
        setOtp("") // Reset OTP input
      }
      toast.success(`OTP sent to ${email}. Check your email inbox.`)
    } catch (error: any) {
      console.error("Error sending OTP:", error)
      toast.error(
        error.response?.data?.error || "Failed to send OTP. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }
  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      toast.error("Please enter the complete 4-digit OTP")
      return
    }

    setIsVerifying(true)
    try {
      const response = await axios.post(`${backendApi}/api/verifyOtp`, { emails: email, otp })
      if (response.status === 200) {
        toast.success("Login successful!")
        login();
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error)
      toast.error(error.response?.data?.error || "Invalid OTP. Please try again.")
      setOtp("")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleBackToEmail = () => {
    setOtp("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-r
                from-[var(--k12-primary)]
                to-[var(--k12-secondary)] rounded-md
                flex items-center justify-center mb-4"
            >
              <img src="/favicon.ico" className="p-3" alt="" />
            </motion.div>

            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[var(--k12-primary)]
                to-[var(--k12-secondary)] bg-clip-text text-transparent">
              Admin Access
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Enter the 4-digit code sent to your email
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Code sent to:
                  <div className="mt-1">
                    {email.map((e, index) => (
                      <span key={index} className="block font-medium text-foreground">
                        {e}
                      </span>
                    ))}
                  </div>
                </p>

                <div className="flex justify-center">
                  <InputOTP maxLength={4} value={otp} onChange={(value) => setOtp(value)}>
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="w-12 h-12 text-lg font-bold border-2 focus:border-[#ffb900]"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-12 h-12 text-lg font-bold border-2 focus:border-[#ffb900]"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-12 h-12 text-lg font-bold border-2 focus:border-[#ffb900]"
                      />
                      <InputOTPSlot
                        index={3}
                        className="w-12 h-12 text-lg font-bold border-2 focus:border-[#ffb900]"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isVerifying || otp.length !== 4}
                  className="w-full h-12 bg-gradient-to-r from-[var(--k12-primary)]
                to-[var(--k12-secondary)] hover:from-red-40 hover:to-red-500 text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isVerifying ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <CheckCircle className="mr-2 w-4 h-4" />
                      Verify & Login
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleBackToEmail}
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  ← Back to email
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Didn't receive the code?{" "}
                  <button onClick={handleSendOTP} className="text-[#ffb900] hover:text-[#e6a600] font-medium">
                    {isLoading ? <>
                      <Loader className="animate-spin h-4 w-4" />
                    </> : `Resend OTP`}
                  </button>
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-xs text-muted-foreground">Secure admin access powered by Tongston OTP verification</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
