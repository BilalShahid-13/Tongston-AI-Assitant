import { motion } from "framer-motion"
import { Crown, Sparkles } from "lucide-react"
import AdminTab from "./adminTab"


export default function AdminHeader() {

  return (
    <main className="w-full min-h-screen">
      <div className="relative overflow-hidden
      bg-gradient-to-br from-[var(--k12-primary)] via-[var(--k12-tertiary)]
       to-[var(--k12-secondary)] text-white">
        <div className="relative z-10 px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Crown className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">Admin Dashboard</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              Manage your knowledge base with elegance and power
            </p>
            <div className="flex justify-center items-center gap-2 text-white/80">
              <Sparkles className="w-5 h-5" />
              <span className="text-lg">Professional Document Management</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 fill-amber-50 dark:fill-gray-900"
          >
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
          </svg>
        </div>
      </div>
      <AdminTab />
    </main>
  )
}
