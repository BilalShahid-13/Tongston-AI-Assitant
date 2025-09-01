import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { backendApi } from "@/lib/constant"
import { useAdminAuthStore } from "@/store/adminAuth"
import axios from "axios"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Mail, Shield } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function OTPLogin() {
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const { login } = useAdminAuthStore();
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(`${backendApi}/api/sendOtp`, { email })
      if (response.status === 200) {
        setEmail(email) // Store email for OTP verification
        setOtp("") // Reset OTP input
        setStep("otp") // Move to OTP step
      }
      toast.success(`OTP sent to ${email}. Check your email inbox.`)
      setStep("otp")
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
      const response = await axios.post(`${backendApi}/api/verifyOtp`, { email, otp })
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
    setStep("email")
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
              {step === "email"
                ? "Enter your email to receive a secure access code"
                : "Enter the 4-digit code sent to your email"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === "email" ? (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSendOTP}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-2 focus:border-[#ffb900] transition-colors"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">A 4-digit OTP will be sent to your email address</p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[var(--k12-primary)]
                to-[var(--k12-secondary)] hover:from-red-400 hover:to-red-500 text-white font-semibold transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Send Access Code
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Code sent to: <span className="font-medium text-foreground">{email}</span>
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
                      Resend
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
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
