"use client"

import React, { useState, useEffect } from "react"
import { 
  Copy, 
  Check, 
  Sparkles, 
  Wand2, 
  Loader2, 
  Plus, 
  Trash2, 
  Info,
  ChevronRight,
  Code,
  Layout,
  Globe,
  User as UserIcon,
  ShoppingBag,
  Home as HomeIcon,
  Utensils,
  Briefcase,
  Video,
  Calendar,
  GraduationCap,
  MessageSquare,
  Package,
  X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { ProGate } from "@/components/ui/pro-gate"
import { cn } from "@/lib/utils"

const SCHEMA_TYPES = [
  { id: "article", label: "Article", icon: Layout, desc: "Blog posts, news, or articles" },
  { id: "faq", label: "FAQ Page", icon: MessageSquare, desc: "Frequently asked questions" },
  { id: "product", label: "Product", icon: ShoppingBag, desc: "E-commerce products" },
  { id: "local-business", label: "Local Business", icon: HomeIcon, desc: "Physical stores or services" },
  { id: "recipe", label: "Recipe", icon: Utensils, desc: "Cooking instructions" },
  { id: "job-posting", label: "Job Posting", icon: Briefcase, desc: "Hiring opportunities" },
  { id: "event", label: "Event", icon: Calendar, desc: "Concerts, webinars, or meetups" },
  { id: "video", label: "Video", icon: Video, desc: "Embedded video content" },
  { id: "how-to", label: "How-To", icon: Wand2, desc: "Step-by-step guides" },
  { id: "person", label: "Person", icon: UserIcon, desc: "Biographical info" },
  { id: "organization", label: "Organization", icon: Globe, desc: "Company or brand details" },
  { id: "software", label: "Software App", icon: Code, desc: "Desktop or mobile apps" },
  { id: "course", label: "Course", icon: GraduationCap, desc: "Educational lessons" },
  { id: "review", label: "Review", icon: MessageSquare, desc: "Individual product reviews" },
  { id: "breadcrumb", label: "Breadcrumb", icon: Layout, desc: "Page hierarchy navigation" },
]

export function SchemaGenerator({ isPro = false }: { isPro?: boolean }) {
  const [activeType, setActiveType] = useState("article")
  const [copied, setCopied] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [output, setOutput] = useState("")
  const [aiSchema, setAiSchema] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code")
  const [faqExpanded, setFaqExpanded] = useState<boolean[]>([false, false, false, false, false])

  const renderGooglePreview = () => {
    const defaultTitle = "Example Search Result Title - Website Name"
    const defaultDesc = "This is a mockup of how your website content will look in Google Search results when using structured data schema markup."
    const renderStars = (rating: number | string) => {
      const num = Math.min(5, Math.max(1, parseFloat(rating as string) || 5))
      return (
        <span className="text-amber-500 font-medium">
          {"★".repeat(Math.round(num))}
          {"☆".repeat(5 - Math.round(num))}
        </span>
      )
    }

    switch (activeType) {
      case "article":
        const art = formData.article || {}
        return (
          <div className="font-sans text-sm space-y-1 max-w-xl text-left">
            <div className="text-[12px] text-[#202124] flex items-center gap-1">
              <span>example.com</span>
              <span className="text-[#70757a]">› article</span>
            </div>
            <h3 className="text-[#1a0dab] hover:underline text-[19px] font-medium leading-tight cursor-pointer">
              {art.headline || defaultTitle}
            </h3>
            <div className="flex gap-4 pt-1">
              <div className="flex-1 text-xs text-[#4d5156] leading-relaxed">
                <span className="text-[#70757a] mr-1">
                  {art.datePublished ? new Date(art.datePublished).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Jun 8, 2026"} —
                </span>
                {defaultDesc} Written by {art.author || "Author name"}.
              </div>
              {art.image && (
                <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  <img src={art.image} alt="Article Thumbnail" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
              )}
            </div>
          </div>
        )

      case "faq":
        const faqs = formData.faq || []
        return (
          <div className="font-sans text-sm space-y-1.5 max-w-xl text-left">
            <div className="text-[12px] text-[#202124]">
              <span>example.com</span> <span className="text-[#70757a]">› faq</span>
            </div>
            <h3 className="text-[#1a0dab] hover:underline text-[19px] font-medium leading-tight cursor-pointer">
              Frequently Asked Questions (FAQ) - My Website
            </h3>
            <p className="text-xs text-[#4d5156]">{defaultDesc}</p>
            
            <div className="pt-2 divide-y divide-gray-100 text-xs">
              {faqs.map((f: any, idx: number) => (
                <div key={idx} className="py-2">
                  <button 
                    onClick={() => setFaqExpanded(prev => {
                      const next = [...prev]
                      next[idx] = !next[idx]
                      return next
                    })}
                    className="flex justify-between items-center w-full text-left font-medium text-[#1a0dab] hover:underline cursor-pointer py-1"
                  >
                    <span>{f.q || `Question ${idx + 1}?`}</span>
                    <span className="text-[10px] text-zinc-400">{faqExpanded[idx] ? "▲" : "▼"}</span>
                  </button>
                  {faqExpanded[idx] && (
                    <p className="text-[#4d5156] mt-1 pl-2 leading-relaxed">{f.a || "Answer goes here..."}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case "product":
        const prod = formData.product || {}
        return (
          <div className="font-sans text-sm space-y-1 max-w-xl text-left">
            <div className="text-[12px] text-[#202124]">
              <span>example.com</span> <span className="text-[#70757a]">› products</span>
            </div>
            <h3 className="text-[#1a0dab] hover:underline text-[19px] font-medium leading-tight cursor-pointer">
              {prod.name || "Product Name - Buy Online"}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#70757a] bg-[#f8f9fa] p-2 rounded-lg border border-gray-200 mt-1">
              <span className="flex items-center gap-1">
                Rating: {renderStars(5)}
                <span className="font-bold text-[#4d5156]">5.0</span>
              </span>
              <span>•</span>
              <span>Price: <span className="font-bold text-[#4d5156]">{prod.currency || "USD"} {prod.price || "99.00"}</span></span>
              <span>•</span>
              <span className="text-green-700 font-medium">{prod.availability === "InStock" ? "In stock" : "Out of stock"}</span>
            </div>
            <p className="text-xs text-[#4d5156] leading-relaxed pt-1.5">
              {prod.description || prod.name || defaultDesc}
            </p>
          </div>
        )

      case "recipe":
        const rec = formData.recipe || {}
        return (
          <div className="font-sans text-sm space-y-1 max-w-xl text-left">
            <div className="text-[12px] text-[#202124]">
              <span>example.com</span> <span className="text-[#70757a]">› recipe</span>
            </div>
            <h3 className="text-[#1a0dab] hover:underline text-[19px] font-medium leading-tight cursor-pointer">
              {rec.name || "Delicious Recipe Name"}
            </h3>
            <div className="flex gap-4 pt-1">
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#70757a]">
                  <span>Rating: {renderStars(5)} <span className="font-bold text-[#4d5156]">5.0</span></span>
                  <span>•</span>
                  <span>Cook time: <span className="font-bold text-[#4d5156]">{rec.cookTime || "30 mins"}</span></span>
                  {rec.calories && (
                    <>
                      <span>•</span>
                      <span>Calories: <span className="font-bold text-[#4d5156]">{rec.calories}</span></span>
                    </>
                  )}
                </div>
                <p className="text-xs text-[#4d5156] leading-relaxed">
                  {rec.description || defaultDesc}
                </p>
              </div>
              {rec.image && (
                <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  <img src={rec.image} alt="Recipe Thumbnail" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
              )}
            </div>
          </div>
        )

      case "breadcrumb":
        const crumbs = formData.breadcrumb || []
        return (
          <div className="font-sans text-sm space-y-1 max-w-xl text-left">
            <div className="text-[12px] text-[#202124] flex items-center gap-1 flex-wrap">
              <span>example.com</span>
              {crumbs.map((c: any, i: number) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="text-[#70757a]">›</span>
                  <span className="text-[#4d5156]">{c.name || `Level ${i+1}`}</span>
                </span>
              ))}
            </div>
            <h3 className="text-[#1a0dab] hover:underline text-[19px] font-medium leading-tight cursor-pointer">
              {crumbs[crumbs.length - 1]?.name || defaultTitle}
            </h3>
            <p className="text-xs text-[#4d5156] leading-relaxed">{defaultDesc}</p>
          </div>
        )

      case "software":
        const sw = formData.software || {}
        return (
          <div className="font-sans text-sm space-y-1 max-w-xl text-left">
            <div className="text-[12px] text-[#202124]">
              <span>example.com</span> <span className="text-[#70757a]">› software</span>
            </div>
            <h3 className="text-[#1a0dab] hover:underline text-[19px] font-medium leading-tight cursor-pointer">
              {sw.name || "Software Application - Download"}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#70757a] mt-1">
              <span>Rating: {renderStars(5)} <span className="font-bold text-[#4d5156]">4.9</span></span>
              <span>•</span>
              <span>Price: <span className="font-bold text-[#4d5156]">{parseFloat(sw.price) === 0 ? "Free" : `$${sw.price}`}</span></span>
              <span>•</span>
              <span>OS: <span className="font-bold text-[#4d5156]">{sw.operatingSystem || "Windows, macOS"}</span></span>
            </div>
            <p className="text-xs text-[#4d5156] leading-relaxed pt-1">
              Download {sw.name || "our software"}, the best {sw.applicationCategory || "Utility"} application. {defaultDesc}
            </p>
          </div>
        )

      default:
        return (
          <div className="font-sans text-sm space-y-1 max-w-xl text-left">
            <div className="text-[12px] text-[#202124]">
              <span>example.com</span>
            </div>
            <h3 className="text-[#1a0dab] hover:underline text-[19px] font-medium leading-tight cursor-pointer">
              {defaultTitle}
            </h3>
            <p className="text-xs text-[#4d5156] leading-relaxed">{defaultDesc}</p>
          </div>
        )
    }
  }

  // Fetcher states
  const [fetchUrl, setFetchUrl] = useState("")
  const [isFetchingUrl, setIsFetchingUrl] = useState(false)
  const [fetchedSchemas, setFetchedSchemas] = useState<any[]>([])
  const [selectedFetchedIndices, setSelectedFetchedIndices] = useState<number[]>([])
  const [fetchError, setFetchError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [importedSchemas, setImportedSchemas] = useState<any[]>([])

  // Comprehensive Form States
  const [formData, setFormData] = useState<any>({
    article: { headline: "", author: "", image: "", datePublished: new Date().toISOString().split('T')[0] },
    faq: [{ q: "", a: "" }],
    product: { name: "", image: "", description: "", brand: "", sku: "", price: "", currency: "USD", availability: "InStock" },
    "local-business": { name: "", image: "", address: "", telephone: "", url: "", priceRange: "$$" },
    recipe: { name: "", image: "", description: "", cookTime: "PT30M", ingredients: "", calories: "" },
    "job-posting": { title: "", description: "", company: "", location: "", salary: "", currency: "USD", type: "FULL_TIME" },
    event: { name: "", startDate: "", endDate: "", location: "", description: "", price: "" },
    video: { name: "", description: "", thumbnailUrl: "", uploadDate: "", duration: "PT2M30S" },
    "how-to": { name: "", totalTime: "PT1H", steps: [{ text: "" }] },
    person: { name: "", jobTitle: "", url: "", sameAs: "" },
    organization: { name: "", url: "", logo: "" },
    software: { name: "", operatingSystem: "Windows, macOS", applicationCategory: "Utility", price: "0" },
    course: { name: "", description: "", provider: "" },
    review: { item: "", author: "", rating: "5", body: "" },
    breadcrumb: [{ name: "Home", item: "https://example.com/" }, { name: "Category", item: "https://example.com/cat" }],
  })

  const handleFetchUrl = async () => {
    if (!fetchUrl) return
    setIsFetchingUrl(true)
    setFetchError("")
    setFetchedSchemas([])
    setSelectedFetchedIndices([])
    try {
      const res = await fetch("/api/tools/fetch-schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fetchUrl })
      })
      if (!res.ok) {
        throw new Error(await res.text() || "Failed to parse page")
      }
      const data = await res.json()
      setFetchedSchemas(data.schemas || [])
      if (data.schemas && data.schemas.length > 0) {
        setSelectedFetchedIndices(data.schemas.map((_: any, i: number) => i))
      } else {
        setFetchError("No schema markup found on this page.")
      }
    } catch (e: any) {
      setFetchError(e.message || "Could not retrieve schemas from that URL.")
    } finally {
      setIsFetchingUrl(false)
    }
  }

  const handleImportToForm = (schemaObj: any) => {
    const rawType = (schemaObj["@type"] || "").toLowerCase()
    let type = ""
    if (rawType.includes("article") || rawType.includes("blogposting")) type = "article"
    else if (rawType === "faqpage") type = "faq"
    else if (rawType === "product") type = "product"
    else if (rawType.includes("localbusiness") || rawType === "restaurant" || rawType === "store") type = "local-business"
    else if (rawType === "recipe") type = "recipe"
    else if (rawType === "jobposting") type = "job-posting"
    else if (rawType === "event") type = "event"
    else if (rawType === "videoobject") type = "video"
    else if (rawType === "howto") type = "how-to"
    else if (rawType === "person") type = "person"
    else if (rawType === "organization") type = "organization"
    else if (rawType === "softwareapplication") type = "software"
    else if (rawType === "course") type = "course"
    else if (rawType === "review") type = "review"
    else if (rawType === "breadcrumblist") type = "breadcrumb"

    if (!type) return

    const baseData = { ...formData[type] }
    if (type === "article") {
      baseData.headline = schemaObj.headline || schemaObj.name || ""
      baseData.author = schemaObj.author?.name || schemaObj.author || ""
      baseData.image = Array.isArray(schemaObj.image) ? schemaObj.image[0] : (schemaObj.image?.url || schemaObj.image || "")
      baseData.datePublished = schemaObj.datePublished ? schemaObj.datePublished.split("T")[0] : new Date().toISOString().split("T")[0]
    } else if (type === "faq") {
      const items = schemaObj.mainEntity || []
      const mapped = items.map((f: any) => ({
        q: f.name || "",
        a: f.acceptedAnswer?.text || ""
      }))
      setFormData({ ...formData, faq: mapped.length > 0 ? mapped : [{ q: "", a: "" }] })
      setActiveType(type)
      return
    } else if (type === "product") {
      baseData.name = schemaObj.name || ""
      baseData.image = Array.isArray(schemaObj.image) ? schemaObj.image[0] : (schemaObj.image?.url || schemaObj.image || "")
      baseData.description = schemaObj.description || ""
      baseData.brand = schemaObj.brand?.name || schemaObj.brand || ""
      baseData.sku = schemaObj.sku || ""
      baseData.price = schemaObj.offers?.price || ""
      baseData.currency = schemaObj.offers?.priceCurrency || "USD"
      baseData.availability = schemaObj.offers?.availability?.replace("https://schema.org/", "") || "InStock"
    } else if (type === "local-business") {
      baseData.name = schemaObj.name || ""
      baseData.image = Array.isArray(schemaObj.image) ? schemaObj.image[0] : (schemaObj.image?.url || schemaObj.image || "")
      baseData.address = schemaObj.address?.streetAddress || schemaObj.address || ""
      baseData.telephone = schemaObj.telephone || ""
      baseData.url = schemaObj.url || ""
      baseData.priceRange = schemaObj.priceRange || "$$"
    } else if (type === "recipe") {
      baseData.name = schemaObj.name || ""
      baseData.image = Array.isArray(schemaObj.image) ? schemaObj.image[0] : (schemaObj.image?.url || schemaObj.image || "")
      baseData.description = schemaObj.description || ""
      baseData.cookTime = schemaObj.cookTime || "PT30M"
      baseData.ingredients = Array.isArray(schemaObj.recipeIngredient) ? schemaObj.recipeIngredient.join("\n") : (schemaObj.recipeIngredient || "")
      baseData.calories = schemaObj.nutrition?.calories || ""
    } else if (type === "job-posting") {
      baseData.title = schemaObj.title || ""
      baseData.description = schemaObj.description || ""
      baseData.company = schemaObj.hiringOrganization?.name || schemaObj.hiringOrganization || ""
      baseData.location = schemaObj.jobLocation?.address?.streetAddress || schemaObj.jobLocation?.name || ""
    } else if (type === "event") {
      baseData.name = schemaObj.name || ""
      baseData.startDate = schemaObj.startDate || ""
      baseData.endDate = schemaObj.endDate || ""
      baseData.location = schemaObj.location?.name || schemaObj.location || ""
      baseData.description = schemaObj.description || ""
      baseData.price = schemaObj.offers?.price || ""
    } else if (type === "video") {
      baseData.name = schemaObj.name || ""
      baseData.description = schemaObj.description || ""
      baseData.thumbnailUrl = Array.isArray(schemaObj.thumbnailUrl) ? schemaObj.thumbnailUrl[0] : (schemaObj.thumbnailUrl || "")
      baseData.uploadDate = schemaObj.uploadDate || ""
      baseData.duration = schemaObj.duration || "PT2M30S"
    } else if (type === "how-to") {
      baseData.name = schemaObj.name || ""
      baseData.totalTime = schemaObj.totalTime || "PT1H"
      const steps = schemaObj.step || []
      baseData.steps = steps.map((s: any) => ({ text: s.text || s.name || "" }))
      if (baseData.steps.length === 0) baseData.steps = [{ text: "" }]
    } else if (type === "person") {
      baseData.name = schemaObj.name || ""
      baseData.jobTitle = schemaObj.jobTitle || ""
      baseData.url = schemaObj.url || ""
      baseData.sameAs = Array.isArray(schemaObj.sameAs) ? schemaObj.sameAs.join("\n") : (schemaObj.sameAs || "")
    } else if (type === "organization") {
      baseData.name = schemaObj.name || ""
      baseData.url = schemaObj.url || ""
      baseData.logo = schemaObj.logo?.url || schemaObj.logo || ""
    } else if (type === "software") {
      baseData.name = schemaObj.name || ""
      baseData.operatingSystem = schemaObj.operatingSystem || "Windows, macOS"
      baseData.applicationCategory = schemaObj.applicationCategory || "Utility"
      baseData.price = schemaObj.offers?.price || "0"
    } else if (type === "course") {
      baseData.name = schemaObj.name || ""
      baseData.description = schemaObj.description || ""
      baseData.provider = schemaObj.provider?.name || schemaObj.provider || ""
    } else if (type === "review") {
      baseData.item = schemaObj.itemReviewed?.name || schemaObj.itemReviewed || ""
      baseData.author = schemaObj.author?.name || schemaObj.author || ""
      baseData.rating = schemaObj.reviewRating?.ratingValue || "5"
      baseData.body = schemaObj.reviewBody || ""
    } else if (type === "breadcrumb") {
      const items = schemaObj.itemListElement || []
      const mapped = items.map((b: any) => ({
        name: b.name || "",
        item: b.item || ""
      }))
      setFormData({ ...formData, breadcrumb: mapped.length > 0 ? mapped : [{ name: "Home", item: "https://example.com/" }] })
      setActiveType(type)
      return
    }

    setFormData({ ...formData, [type]: baseData })
    setActiveType(type)
  }

  const handleInsertSchemas = () => {
    const selected = fetchedSchemas
      .filter((_, i) => selectedFetchedIndices.includes(i))
      .map(s => s.data)
    setImportedSchemas(selected)
    setIsModalOpen(false)
  }

  useEffect(() => {
    generateSchema()
  }, [formData, activeType, importedSchemas, aiSchema])

  const generateSchema = () => {
    if (aiSchema) {
      setOutput(`<script type="application/ld+json">\n${JSON.stringify(aiSchema, null, 2)}\n</script>`)
      return
    }

    if (importedSchemas.length > 0) {
      const content = importedSchemas.length === 1 ? importedSchemas[0] : importedSchemas
      setOutput(`<script type="application/ld+json">\n${JSON.stringify(content, null, 2)}\n</script>`)
      return
    }

    let schema: any = { "@context": "https://schema.org" }
    const data = formData[activeType]

    switch (activeType) {
      case "article":
        schema["@type"] = "Article"
        schema.headline = data.headline
        schema.author = { "@type": "Person", name: data.author }
        schema.image = data.image
        schema.datePublished = data.datePublished
        break
      case "faq":
        schema["@type"] = "FAQPage"
        schema.mainEntity = data.map((f: any) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
        break
      case "product":
        schema["@type"] = "Product"
        schema.name = data.name
        schema.image = data.image
        schema.description = data.description
        schema.brand = { "@type": "Brand", name: data.brand }
        schema.sku = data.sku
        schema.offers = {
          "@type": "Offer",
          "price": data.price,
          "priceCurrency": data.currency,
          "availability": `https://schema.org/${data.availability}`
        }
        break
      case "local-business":
        schema["@type"] = "LocalBusiness"
        schema.name = data.name
        schema.image = data.image
        schema.address = { "@type": "PostalAddress", "streetAddress": data.address }
        schema.telephone = data.telephone
        schema.url = data.url
        schema.priceRange = data.priceRange
        break
      case "recipe":
        schema["@type"] = "Recipe"
        schema.name = data.name
        schema.image = data.image
        schema.description = data.description
        schema.cookTime = data.cookTime
        schema.recipeIngredient = data.ingredients.split('\n').filter((s: string) => s.trim())
        schema.nutrition = { "@type": "NutritionInformation", "calories": data.calories }
        break
      case "job-posting":
        schema["@type"] = "JobPosting"
        schema.title = data.title
        schema.description = data.description
        schema.hiringOrganization = { "@type": "Organization", "name": data.company }
        schema.jobLocation = { "@type": "Place", "address": data.location }
        schema.baseSalary = { "@type": "MonetaryAmount", "currency": data.currency, "value": data.salary }
        schema.employmentType = data.type
        break
      case "event":
        schema["@type"] = "Event"
        schema.name = data.name
        schema.startDate = data.startDate
        schema.endDate = data.endDate
        schema.location = { "@type": "Place", "name": data.location }
        schema.description = data.description
        schema.offers = { "@type": "Offer", "price": data.price, "priceCurrency": "USD" }
        break
      case "video":
        schema["@type"] = "VideoObject"
        schema.name = data.name
        schema.description = data.description
        schema.thumbnailUrl = data.thumbnailUrl
        schema.uploadDate = data.uploadDate
        schema.duration = data.duration
        break
      case "how-to":
        schema["@type"] = "HowTo"
        schema.name = data.name
        schema.totalTime = data.totalTime
        schema.step = data.steps.map((s: any) => ({ "@type": "HowToStep", "text": s.text }))
        break
      case "person":
        schema["@type"] = "Person"
        schema.name = data.name
        schema.jobTitle = data.jobTitle
        schema.url = data.url
        schema.sameAs = data.sameAs.split('\n').filter((s: string) => s.trim())
        break
      case "organization":
        schema["@type"] = "Organization"
        schema.name = data.name
        schema.url = data.url
        schema.logo = data.logo
        break
      case "software":
        schema["@type"] = "SoftwareApplication"
        schema.name = data.name
        schema.operatingSystem = data.operatingSystem
        schema.applicationCategory = data.applicationCategory
        schema.offers = { "@type": "Offer", "price": data.price, "priceCurrency": "USD" }
        break
      case "course":
        schema["@type"] = "Course"
        schema.name = data.name
        schema.description = data.description
        schema.provider = { "@type": "Organization", "name": data.provider }
        break
      case "review":
        schema["@type"] = "Review"
        schema.itemReviewed = { "@type": "Thing", "name": data.item }
        schema.author = { "@type": "Person", "name": data.author }
        schema.reviewRating = { "@type": "Rating", "ratingValue": data.rating }
        schema.reviewBody = data.body
        break
      case "breadcrumb":
        schema["@type"] = "BreadcrumbList"
        schema.itemListElement = data.map((b: any, i: number) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": b.name,
          "item": b.item
        }))
        break
      default:
        schema["@type"] = activeType.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')
        Object.assign(schema, data)
    }

    setOutput(`<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`)
  }

  const handleAiGenerate = async () => {
    if (!aiPrompt) return
    setIsAiLoading(true)
    try {
      const res = await fetch("/api/tools/ai-schema", {
        method: "POST",
        body: JSON.stringify({ prompt: aiPrompt })
      })
      if (res.ok) {
        const json = await res.json()
        setAiSchema(json)
        setImportedSchemas([])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsAiLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const updateField = (field: string, value: any) => {
    setFormData({
      ...formData,
      [activeType]: { ...formData[activeType], [field]: value }
    })
  }

  return (
    <div className="space-y-6">
      {/* Top Selector dropdown card */}
      <div className="bg-card p-4 border border-border rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">Schema Type:</span>
          <div className="w-full sm:w-64">
            <Select value={activeType} onValueChange={(val) => {
              if (val) {
                setActiveType(val)
                setImportedSchemas([])
              }
            }}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Choose schema type..." />
              </SelectTrigger>
              <SelectContent>
                {SCHEMA_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <ProGate feature="URL Schema Import" isPro={isPro}>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 bg-muted hover:bg-muted/80 text-foreground font-black border border-primary/10 rounded-xl"
            >
              <Globe className="h-4 w-4 text-primary" />
              Import from URL
            </Button>
          </ProGate>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Editor Area */}
          {/* Editor Area */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm overflow-hidden bg-muted/20">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {React.createElement(SCHEMA_TYPES.find(t => t.id === activeType)?.icon || Layout, { className: "h-4 w-4" })}
                  </div>
                  <div>
                    <CardTitle className="text-lg">Edit {SCHEMA_TYPES.find(t => t.id === activeType)?.label}</CardTitle>
                    <CardDescription className="text-xs">Fill in the fields to generate JSON-LD</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {activeType === "article" && (
                  <>
                    <div className="space-y-2">
                      <Label>Headline</Label>
                      <Input placeholder="The ultimate guide to..." value={formData.article.headline} onChange={e => updateField("headline", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Author</Label>
                        <Input placeholder="John Doe" value={formData.article.author} onChange={e => updateField("author", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Date Published</Label>
                        <Input type="date" value={formData.article.datePublished} onChange={e => updateField("datePublished", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Featured Image URL</Label>
                      <Input placeholder="https://..." value={formData.article.image} onChange={e => updateField("image", e.target.value)} />
                    </div>
                  </>
                )}

                {activeType === "faq" && (
                  <div className="space-y-4">
                    {formData.faq.map((f: any, i: number) => (
                      <div key={i} className="p-4 border rounded-xl bg-background space-y-3 relative group">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 transition-colors h-7 w-7"
                          onClick={() => {
                            const newFaq = formData.faq.filter((_: any, idx: number) => idx !== i)
                            setFormData({...formData, faq: newFaq})
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase text-muted-foreground">Question {i + 1}</Label>
                          <Input value={f.q} onChange={e => {
                            const newFaq = [...formData.faq]
                            newFaq[i].q = e.target.value
                            setFormData({...formData, faq: newFaq})
                          }} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase text-muted-foreground">Answer</Label>
                          <Textarea value={f.a} className="min-h-[60px]" onChange={e => {
                            const newFaq = [...formData.faq]
                            newFaq[i].a = e.target.value
                            setFormData({...formData, faq: newFaq})
                          }} />
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed border-2 h-12 rounded-xl text-primary font-bold"
                      onClick={() => setFormData({...formData, faq: [...formData.faq, { q: "", a: "" }]})}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Question
                    </Button>
                  </div>
                )}

                {activeType === "product" && (
                  <>
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input value={formData.product.name} onChange={e => updateField("name", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Brand</Label>
                        <Input value={formData.product.brand} onChange={e => updateField("brand", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input type="number" value={formData.product.price} onChange={e => updateField("price", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={formData.product.description} onChange={e => updateField("description", e.target.value)} />
                    </div>
                  </>
                )}

                {activeType === "local-business" && (
                  <>
                    <div className="space-y-2">
                      <Label>Business Name</Label>
                      <Input value={formData["local-business"].name} onChange={e => updateField("name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Street Address</Label>
                      <Input placeholder="123 Main St, New York, NY" value={formData["local-business"].address} onChange={e => updateField("address", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Telephone</Label>
                        <Input placeholder="+1..." value={formData["local-business"].telephone} onChange={e => updateField("telephone", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Price Range</Label>
                        <Input placeholder="e.g. $$" value={formData["local-business"].priceRange} onChange={e => updateField("priceRange", e.target.value)} />
                      </div>
                    </div>
                  </>
                )}

                {activeType === "recipe" && (
                  <>
                    <div className="space-y-2">
                      <Label>Recipe Name</Label>
                      <Input value={formData.recipe.name} onChange={e => updateField("name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Ingredients (One per line)</Label>
                      <Textarea placeholder="2 eggs&#10;1 cup flour..." value={formData.recipe.ingredients} onChange={e => updateField("ingredients", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Cook Time</Label>
                        <Input placeholder="PT30M" value={formData.recipe.cookTime} onChange={e => updateField("cookTime", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Calories</Label>
                        <Input placeholder="250 kcal" value={formData.recipe.calories} onChange={e => updateField("calories", e.target.value)} />
                      </div>
                    </div>
                  </>
                )}

                {activeType === "job-posting" && (
                  <>
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input value={formData["job-posting"].title} onChange={e => updateField("title", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input value={formData["job-posting"].company} onChange={e => updateField("company", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input value={formData["job-posting"].location} onChange={e => updateField("location", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={formData["job-posting"].description} onChange={e => updateField("description", e.target.value)} />
                    </div>
                  </>
                )}

                {activeType === "event" && (
                  <>
                    <div className="space-y-2">
                      <Label>Event Name</Label>
                      <Input value={formData.event.name} onChange={e => updateField("name", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input type="datetime-local" value={formData.event.startDate} onChange={e => updateField("startDate", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input type="number" value={formData.event.price} onChange={e => updateField("price", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input placeholder="Online or Venue Name" value={formData.event.location} onChange={e => updateField("location", e.target.value)} />
                    </div>
                  </>
                )}

                {activeType === "video" && (
                  <>
                    <div className="space-y-2">
                      <Label>Video Title</Label>
                      <Input value={formData.video.name} onChange={e => updateField("name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Thumbnail URL</Label>
                      <Input placeholder="https://..." value={formData.video.thumbnailUrl} onChange={e => updateField("thumbnailUrl", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Upload Date</Label>
                        <Input type="date" value={formData.video.uploadDate} onChange={e => updateField("uploadDate", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input placeholder="PT2M30S" value={formData.video.duration} onChange={e => updateField("duration", e.target.value)} />
                      </div>
                    </div>
                  </>
                )}

                {activeType === "how-to" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Guide Name</Label>
                      <Input placeholder="How to..." value={formData["how-to"].name} onChange={e => updateField("name", e.target.value)} />
                    </div>
                    {formData["how-to"].steps.map((s: any, i: number) => (
                      <div key={i} className="flex gap-2">
                        <div className="pt-2 text-xs font-bold opacity-30">{i+1}</div>
                        <Textarea 
                          placeholder="Describe this step..." 
                          className="min-h-[40px]" 
                          value={s.text} 
                          onChange={e => {
                            const newSteps = [...formData["how-to"].steps]
                            newSteps[i].text = e.target.value
                            setFormData({...formData, "how-to": {...formData["how-to"], steps: newSteps}})
                          }}
                        />
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setFormData({...formData, "how-to": {...formData["how-to"], steps: [...formData["how-to"].steps, { text: "" }]}})}>
                      Add Step
                    </Button>
                  </div>
                )}

                {activeType === "person" && (
                  <>
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="Jane Smith" value={formData.person.name} onChange={e => updateField("name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input placeholder="Software Engineer" value={formData.person.jobTitle} onChange={e => updateField("jobTitle", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Social Links (One per line)</Label>
                      <Textarea placeholder="https://linkedin.com/..." value={formData.person.sameAs} onChange={e => updateField("sameAs", e.target.value)} />
                    </div>
                  </>
                )}

                {activeType === "organization" && (
                  <>
                    <div className="space-y-2">
                      <Label>Organization Name</Label>
                      <Input placeholder="Acme Corp" value={formData.organization.name} onChange={e => updateField("name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Website URL</Label>
                      <Input placeholder="https://..." value={formData.organization.url} onChange={e => updateField("url", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Logo URL</Label>
                      <Input placeholder="https://..." value={formData.organization.logo} onChange={e => updateField("logo", e.target.value)} />
                    </div>
                  </>
                )}

                {activeType === "software" && (
                  <>
                    <div className="space-y-2">
                      <Label>Application Name</Label>
                      <Input value={formData.software.name} onChange={e => updateField("name", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Input placeholder="Utility, Game..." value={formData.software.applicationCategory} onChange={e => updateField("applicationCategory", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input value={formData.software.price} onChange={e => updateField("price", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Operating System</Label>
                      <Input placeholder="Windows, Android..." value={formData.software.operatingSystem} onChange={e => updateField("operatingSystem", e.target.value)} />
                    </div>
                  </>
                )}

                {activeType === "course" && (
                  <>
                    <div className="space-y-2">
                      <Label>Course Name</Label>
                      <Input value={formData.course.name} onChange={e => updateField("name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Provider</Label>
                      <Input placeholder="Coursera, Udemy..." value={formData.course.provider} onChange={e => updateField("provider", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={formData.course.description} onChange={e => updateField("description", e.target.value)} />
                    </div>
                  </>
                )}

                {activeType === "review" && (
                  <>
                    <div className="space-y-2">
                      <Label>Item Name</Label>
                      <Input placeholder="iPhone 15 Pro" value={formData.review.item} onChange={e => updateField("item", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Reviewer Name</Label>
                        <Input placeholder="John Doe" value={formData.review.author} onChange={e => updateField("author", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Rating (1-5)</Label>
                        <Input type="number" min="1" max="5" value={formData.review.rating} onChange={e => updateField("rating", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Review Body</Label>
                      <Textarea value={formData.review.body} onChange={e => updateField("body", e.target.value)} />
                    </div>
                  </>
                )}

                {activeType === "breadcrumb" && (
                  <div className="space-y-4">
                    {formData.breadcrumb.map((b: any, i: number) => (
                      <div key={i} className="flex gap-2">
                        <Input placeholder="Name" value={b.name} onChange={e => {
                          const newB = [...formData.breadcrumb]
                          newB[i].name = e.target.value
                          setFormData({...formData, breadcrumb: newB})
                        }} />
                        <Input placeholder="URL" value={b.item} onChange={e => {
                          const newB = [...formData.breadcrumb]
                          newB[i].item = e.target.value
                          setFormData({...formData, breadcrumb: newB})
                        }} />
                        <Button variant="ghost" size="icon" onClick={() => setFormData({...formData, breadcrumb: formData.breadcrumb.filter((_:any,idx:number)=>idx!==i)})}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setFormData({...formData, breadcrumb: [...formData.breadcrumb, { name: "", item: "" }]})}>
                      Add Item
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Generator Section */}
            <ProGate 
              feature="AI Smart Schema Generator" 
              isPro={isPro}
            >
              <Card className="border-2 border-amber-500/20 shadow-xl shadow-amber-500/5 overflow-hidden">
                <CardHeader className="bg-amber-500/5 border-b border-amber-500/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-lg">AI Smart Generator</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-amber-600 uppercase tracking-widest">Describe your content</Label>
                    <Textarea 
                      placeholder="e.g., A blog post about AI tools for 2024 written by Jane Smith with a featured image at https://example.com/ai.jpg" 
                      className="min-h-[100px] bg-amber-500/[0.02] border-amber-500/10 focus-visible:ring-amber-500"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black h-12 rounded-xl"
                    onClick={handleAiGenerate}
                    disabled={isAiLoading || !aiPrompt}
                  >
                    {isAiLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <Wand2 className="h-5 w-5 mr-2" />
                    )}
                    {isAiLoading ? "Processing Magic..." : "Generate Schema with AI"}
                  </Button>
                </CardContent>
              </Card>
            </ProGate>
          </div>

          {/* Preview Area */}
          <div className="space-y-4 sticky top-4">
            {importedSchemas.length > 0 && (
              <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between text-xs animate-in slide-in-from-top-2 duration-300">
                <span className="text-muted-foreground font-medium">Showing schemas imported from URL.</span>
                <button 
                  type="button"
                  onClick={() => setImportedSchemas([])} 
                  className="font-black text-primary hover:underline"
                >
                  Reset to Form Editor
                </button>
              </div>
            )}

            {aiSchema && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs animate-in slide-in-from-top-2 duration-300">
                <span className="text-amber-700 dark:text-amber-300 font-medium">Showing schema generated by AI.</span>
                <button 
                  type="button"
                  onClick={() => setAiSchema(null)} 
                  className="font-black text-amber-600 hover:underline cursor-pointer"
                >
                  Reset to Form Editor
                </button>
              </div>
            )}

            {/* Tab Controls */}
            <div className="flex items-center justify-between bg-card p-1.5 border border-border rounded-xl">
              <div className="flex gap-1.5">
                <button 
                  type="button"
                  onClick={() => setActiveTab("code")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    activeTab === "code" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  JSON-LD Code
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    activeTab === "preview" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  Google Search Preview
                </button>
              </div>
              
              {activeTab === "code" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 rounded-lg font-bold text-xs gap-2"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
              )}
            </div>

            {activeTab === "code" ? (
              <div className="relative">
                <pre className="bg-zinc-950 text-zinc-300 p-6 rounded-3xl overflow-x-auto text-[11px] font-mono whitespace-pre-wrap min-h-[500px] max-h-[800px] shadow-2xl ring-1 ring-white/10 leading-relaxed custom-scrollbar animate-in fade-in duration-300">
                  {output}
                </pre>
                <div className="absolute top-4 right-4 pointer-events-none opacity-20">
                  <Layout className="h-32 w-32 rotate-12" />
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 text-zinc-900 shadow-sm p-6 rounded-3xl min-h-[500px] animate-in fade-in duration-300 space-y-6">
                <div>
                  <h4 className="text-xs uppercase font-black text-zinc-400 tracking-wider mb-3">Google Search Rich Snippet Mockup</h4>
                  {renderGooglePreview()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO Info Section */}
        <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
          <section>
            <h2 className="text-2xl font-black tracking-tight mb-4">What is JSON-LD Schema Markup?</h2>
            <p className="text-muted-foreground leading-relaxed">
              JSON-LD (JavaScript Object Notation for Linked Data) is the recommended format by Google for adding structured data to your web pages. It allows search engines to understand the content and context of your page, enabling rich results in Google Search like star ratings, FAQs, and article details.
            </p>
          </section>
          <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
            <h3 className="text-xl font-black tracking-tight mb-6">Why Schema Markup Matters</h3>
            <ul className="space-y-4 list-none p-0">
              {[
                { title: "Rich Results in Google", desc: "Schema enables rich snippets — FAQ dropdowns, article dates, star ratings — that increase CTR by up to 30%." },
                { title: "Better AI Understanding", desc: "Structured data helps LLMs and AI agents (like Perplexity or ChatGPT) understand and cite your content accurately." },
                { title: "Indented Results", desc: "FAQ and How-To schema take up more vertical space in Google, pushing competitors further down the page." },
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-primary">{i + 1}</div>
                  <div>
                    <h4 className="font-bold text-foreground leading-none mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

      {/* Import from URL Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-black">Import Schema from URL</h3>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs uppercase font-black text-muted-foreground">Page URL</Label>
                <div className="flex gap-2">
                  <Input 
                    type="url" 
                    placeholder="https://..." 
                    value={fetchUrl} 
                    onChange={e => setFetchUrl(e.target.value)}
                    className="h-10 text-xs"
                  />
                  <Button 
                    onClick={handleFetchUrl} 
                    disabled={isFetchingUrl || !fetchUrl}
                    className="h-10 px-4"
                  >
                    {isFetchingUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
                  </Button>
                </div>
                {fetchError && <p className="text-xs text-red-500 font-bold mt-1">{fetchError}</p>}
              </div>

              {fetchedSchemas.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-primary/5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase font-black text-muted-foreground">Detected ({fetchedSchemas.length})</p>
                    <button 
                      onClick={() => {
                        if (selectedFetchedIndices.length === fetchedSchemas.length) {
                          setSelectedFetchedIndices([])
                        } else {
                          setSelectedFetchedIndices(fetchedSchemas.map((_, i) => i))
                        }
                      }}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      {selectedFetchedIndices.length === fetchedSchemas.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {fetchedSchemas.map((s, idx) => (
                      <div key={idx} className="flex items-center text-xs p-2 hover:bg-muted/40 rounded-lg">
                        <label className="flex items-center gap-3 cursor-pointer select-none w-full truncate">
                          <input 
                            type="checkbox" 
                            checked={selectedFetchedIndices.includes(idx)} 
                            onChange={() => {
                              if (selectedFetchedIndices.includes(idx)) {
                                setSelectedFetchedIndices(selectedFetchedIndices.filter(i => i !== idx))
                              } else {
                                setSelectedFetchedIndices([...selectedFetchedIndices, idx])
                              }
                            }}
                            className="h-4 w-4 rounded text-primary border-muted"
                          />
                          <span className="truncate font-black">{s.type}</span>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-2 pt-2">
                    <Button 
                      onClick={handleInsertSchemas} 
                      disabled={selectedFetchedIndices.length === 0}
                      className="h-11 font-black w-full"
                    >
                      Insert Selected ({selectedFetchedIndices.length})
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
