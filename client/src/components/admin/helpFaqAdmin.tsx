import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { faqCategories } from "@/lib/constant"
import type { FAQ } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  BookOpen,
  Edit,
  Filter,
  HelpCircle,
  MessageSquareQuoteIcon as MessageSquareQuestion,
  Plus,
  Search,
  Trash2
} from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { Badge } from "../ui/badge"
import { faqSchema } from "./schema/faqSchema"
import { createFaq, deleteFaq, fetchFaqs, updateFaq } from "./utils/api"

export function HelpFaqAdmin() {
  const queryClient = useQueryClient()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    category: "",
  })
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const {
    data: faqs = [],
    isLoading,
  } = useQuery({
    queryKey: ["faqs"],
    queryFn: () =>
      Promise.all(faqCategories.map((item) => fetchFaqs(item.label))),
    retry: 1,
  })

  console.log(faqs)

  const createFaqMutation = useMutation({
    mutationFn: createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] })
      toast.success("FAQ created successfully!")
      resetForm()
    },
    onError: (error: any) => {
      console.error("[v0] Error creating FAQ:", error)
      toast.error("Failed to create FAQ")
    },
  })

  const updateFaqMutation = useMutation({
    mutationFn: updateFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] })
      toast.success("FAQ updated successfully!")
      resetForm()
    },
    onError: (error: any) => {
      console.error("[v0] Error updating FAQ:", error)
      toast.error("Failed to update FAQ")
    },
  })

  const deleteFaqMutation = useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] })
      toast.success("FAQ deleted successfully!")
    },
    onError: (error: any) => {
      console.error("[v0] Error deleting FAQ:", error)
      toast.error("Failed to delete FAQ")
    },
  })

  const handleCreateFaq = async () => {
    try {
      const validatedData = faqSchema.omit({ id: true }).parse(formData)
      createFaqMutation.mutate(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error
        // const firstError = error.errors[0]
        toast.error(firstError.message)
      } else {
        toast.error("Please fill in all fields correctly")
      }
    }
  }

  const handleUpdateFaq = async () => {
    if (!editingFaq) return

    try {
      const validatedData = faqSchema.parse({ id: editingFaq.id, ...formData })
      updateFaqMutation.mutate(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error;
        // const firstError = error?.errors[0]
        toast.error(firstError.message)
      } else {
        toast.error("Please fill in all fields correctly")
      }
    }
  }

  const handleDeleteFaq = (faq: FAQ) => {
    deleteFaqMutation.mutate({ id: faq.id!, category: faq.category })
  }


  const resetForm = () => {
    setFormData({ heading: "", description: "", category: "" })
    setEditingFaq(null)
    setIsFormOpen(false)
  }

  const startEdit = (faq: FAQ) => {
    setEditingFaq(faq)
    setFormData({
      heading: faq.heading,
      description: faq.description,
      category: faq.category,
    })
    setIsFormOpen(true)
  }

  const flattenedFaqs = useMemo(() => faqs.flat(), [faqs]);
  const filteredFaqs = useMemo(() => {
    return flattenedFaqs.filter((faq: any) => {
      const matchesSearch =
        faq.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [flattenedFaqs, searchTerm, selectedCategory]);

  console.log('flattenedFaqs', filteredFaqs, flattenedFaqs)


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* FAQ Controls */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-2 focus:border-[var(--k12-primary)]"
                      />
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-[250px] border-2 focus:border-[var(--k12-primary)]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {faqCategories?.map((item, index) => (
                          <SelectItem key={index} value={item.label}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <AlertDialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-gradient-to-r from-[var(--k12-primary)] to-[var(--k12-secondary)] hover:from-[var(--k12-secondary)] hover:to-[var(--k12-tertiary)] text-black font-semibold shadow-lg"
                        onClick={() => {
                          resetForm()
                          setIsFormOpen(true)
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New FAQ
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <MessageSquareQuestion className="w-5 h-5 text-[var(--k12-primary)]" />
                          {editingFaq ? "Edit FAQ" : "Create New FAQ"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {editingFaq
                            ? "Update the FAQ information below."
                            : "Fill in the details to create a new FAQ."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {faqCategories?.map((item, index) => (
                                <SelectItem key={index} value={item.label}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="heading">Question/Heading</Label>
                          <Input
                            id="heading"
                            value={formData.heading}
                            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                            placeholder="Enter the FAQ question or heading"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Answer/Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter the detailed answer or description"
                            rows={4}
                          />
                        </div>
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={resetForm}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={editingFaq ? handleUpdateFaq : handleCreateFaq}
                          className="bg-gradient-to-r from-[var(--k12-primary)] to-[var(--k12-secondary)] hover:from-[var(--k12-secondary)] hover:to-[var(--k12-tertiary)] text-black"
                          disabled={createFaqMutation.isPending || updateFaqMutation.isPending}
                        >
                          {createFaqMutation.isPending || updateFaqMutation.isPending
                            ? "Processing..."
                            : editingFaq
                              ? "Update FAQ"
                              : "Create FAQ"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[var(--k12-primary)]" />
                  FAQ List ({filteredFaqs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--k12-primary)]"></div>
                  </div>
                ) : filteredFaqs.length === 0 ? (
                  <div className="text-center py-12">
                    <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No FAQs found. Create your first FAQ to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFaqs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="border-2 border-transparent hover:border-[var(--k12-primary)]/30 transition-all duration-200">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    variant="secondary"
                                    className="bg-[var(--k12-primary)]/10 text-[var(--k12-quaternary)] border-[var(--k12-primary)]/20"
                                  >
                                    {faq?.category}
                                  </Badge>
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{faq.heading}</h3>
                                <p className="text-muted-foreground leading-relaxed">{faq.description}</p>
                              </div>

                              <div className="flex gap-2 max-sm:flex-col">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => startEdit(faq)}
                                  className="hover:bg-[var(--k12-primary)]/10 hover:border-[var(--k12-primary)]"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 bg-transparent"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this FAQ? This action cannot be undone.
                                        <div className="mt-2 p-3 bg-muted rounded-lg">
                                          <p className="font-medium">{faq.heading}</p>
                                        </div>
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteFaq(faq)}
                                        className="bg-red-600 hover:bg-red-700"
                                        disabled={deleteFaqMutation.isPending}
                                      >
                                        {deleteFaqMutation.isPending ? "Deleting..." : "Delete FAQ"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
