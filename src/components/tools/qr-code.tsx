"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { 
  Loader2, 
  Download, 
  LineChart, 
  BarChart, 
  PieChart, 
  Globe, 
  Tablet, 
  Laptop, 
  Calendar, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink,
  X,
  Trash2
} from "lucide-react"
import { ColorPicker } from "@/components/ui/color-picker"
import { useUsageLimit } from "@/hooks/use-usage-limit"
import Link from "next/link"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar
} from "recharts"

interface QRCodeProps {
  isPro?: boolean
  isBusiness?: boolean
}

interface QrItem {
  id: string
  targetUrl: string
  fgColor: string
  bgColor: string
  size: number
  createdAt: string
  _count: {
    scans: number
  }
}

interface QrStats {
  totalScans: number
  uniqueScans: number
  devices: Record<string, number>
  os: Record<string, number>
  browsers: Record<string, number>
  countries: Record<string, number>
  cities: Record<string, number>
  scans: Array<{ createdAt: string; isUnique: boolean }>
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function QRCodeGenerator({ isPro = false, isBusiness = false }: QRCodeProps) {
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  const qrType = "dynamic"
  const [text, setText] = useState("")
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [logoUrl, setLogoUrl] = useState<string>("")

  const addLogoToQrCode = (qrUrl: string, logo: string, qrSize: number, bg: string): Promise<string> => {
    return new Promise((resolve) => {
      const qrImg = new Image()
      qrImg.crossOrigin = "anonymous"
      qrImg.src = qrUrl
      qrImg.onload = () => {
        const logoImg = new Image()
        logoImg.crossOrigin = "anonymous"
        logoImg.src = logo
        logoImg.onload = () => {
          const canvas = document.createElement("canvas")
          canvas.width = qrSize
          canvas.height = qrSize
          const ctx = canvas.getContext("2d")
          if (!ctx) {
            resolve(qrUrl)
            return
          }
          // Draw QR
          ctx.drawImage(qrImg, 0, 0, qrSize, qrSize)

          // Logo size: 20% of QR size, min 50px
          const logoSize = Math.max(50, Math.floor(qrSize * 0.2))
          const logoPos = (qrSize - logoSize) / 2

          // Draw background behind logo to keep QR readable
          ctx.fillStyle = bg
          ctx.fillRect(logoPos - 4, logoPos - 4, logoSize + 8, logoSize + 8)

          // Draw logo image
          ctx.drawImage(logoImg, logoPos, logoPos, logoSize, logoSize)

          resolve(canvas.toDataURL("image/png"))
        }
        logoImg.onerror = () => resolve(qrUrl)
      }
      qrImg.onerror = () => resolve(qrUrl)
    })
  }

  // List & Stats
  const [userQrs, setUserQrs] = useState<QrItem[]>([])
  const [selectedQr, setSelectedQr] = useState<QrItem | null>(null)
  const [stats, setStats] = useState<QrStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string>("")
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily")
  const [selectedQrDataUrl, setSelectedQrDataUrl] = useState<string>("")

  const { count: usedToday, increment: incrementUsage, refresh: refreshUsage } = useUsageLimit("qr-code", "daily")
  const MAX_FREE = 5
  const limitReached = !isPro && usedToday >= MAX_FREE

  const isFreeTier = !isPro
  const hasReachedDynamicLimit = isFreeTier && userQrs.length >= 1

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserQrs()
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (selectedQr) {
      fetchQrStats(selectedQr.id)
      generateSelectedQrImage(selectedQr)
    }
  }, [selectedQr])

  const generateSelectedQrImage = async (qr: QrItem) => {
    try {
      const qrText = `${window.location.origin}/q/${qr.id}`
      const res = await fetch("/api/tools/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: qrText, size: qr.size, fgColor: qr.fgColor, bgColor: qr.bgColor }),
      })
      if (res.ok) {
        const data = await res.json()
        setSelectedQrDataUrl(data.dataUrl)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteQr = async (id: string) => {
    if (!confirm("Are you sure you want to delete this QR code and all its scan statistics?")) return
    try {
      const res = await fetch(`/api/tools/qr-code/delete?id=${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        if (selectedQr?.id === id) {
          setSelectedQr(null)
          setStats(null)
          setSelectedQrDataUrl("")
        }
        await fetchUserQrs()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchUserQrs = async () => {
    try {
      const res = await fetch("/api/tools/qr-code/user-qrs")
      if (res.ok) {
        const data = await res.json()
        setUserQrs(data.qrCodes || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchQrStats = async (id: string) => {
    setStatsLoading(true)
    try {
      const res = await fetch(`/api/tools/qr-code/stats?id=${id}`)
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setStatsLoading(false)
    }
  }

  const generateQR = async () => {
    if (!text || limitReached) return
    setLoading(true)
    setError("")
    setQrDataUrl("")

    try {
      let qrText = text

      if (qrType === "dynamic") {
        if (!isLoggedIn) {
          setError("Please login to create dynamic QR codes.")
          setLoading(false)
          return
        }
        if (hasReachedDynamicLimit) {
          setError("You've reached the free limit of 1 dynamic QR code. Upgrade to Pro for unlimited dynamic codes.")
          setLoading(false)
          return
        }

        // Create DB record
        const createRes = await fetch("/api/tools/qr-code/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetUrl: text, fgColor, bgColor, size }),
        })
        if (!createRes.ok) {
          throw new Error("Failed to register dynamic redirect")
        }
        const createData = await createRes.json()
        const dynamicId = createData.id
        qrText = `${window.location.origin}/q/${dynamicId}`

        await fetchUserQrs()
      }

      // Generate Image
      const res = await fetch("/api/tools/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: qrText, size, fgColor, bgColor }),
      })
      if (!res.ok) throw new Error("Failed to generate QR code")
      const data = await res.json()
      
      let finalDataUrl = data.dataUrl
      if (isPro && logoUrl) {
        finalDataUrl = await addLogoToQrCode(finalDataUrl, logoUrl, size, bgColor)
      }
      setQrDataUrl(finalDataUrl)
      
      await incrementUsage(1, {
        size,
        fgColor,
        bgColor,
        textLength: text.length,
        type: qrType,
      })
      await refreshUsage()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const downloadPNG = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.href = qrDataUrl
    link.download = `qr-code-${qrType}.png`
    link.click()
  }

  const downloadSelectedPNG = () => {
    if (!selectedQrDataUrl || !selectedQr) return
    const link = document.createElement("a")
    link.href = selectedQrDataUrl
    link.download = `qr-code-dynamic.png`
    link.click()
  }

  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/q/${id}`
    navigator.clipboard.writeText(link)
    setCopiedId(id)
    setTimeout(() => setCopiedId(""), 2000)
  }

  // Analytics graph processing
  const getTimelineData = () => {
    if (!stats || !stats.scans) return []
    const counts: Record<string, { scans: number; unique: number }> = {}

    stats.scans.forEach(s => {
      const date = new Date(s.createdAt)
      let key = ""
      if (timeframe === "daily") {
        key = date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
      } else if (timeframe === "weekly") {
        // Group by week of year
        const startOfYear = new Date(date.getFullYear(), 0, 1)
        const diff = date.getTime() - startOfYear.getTime()
        const oneDay = 1000 * 60 * 60 * 24
        const dayOfYear = Math.floor(diff / oneDay)
        const week = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7)
        key = `Wk ${week}`
      } else {
        key = date.toLocaleDateString(undefined, { month: "short", year: "numeric" })
      }

      if (!counts[key]) counts[key] = { scans: 0, unique: 0 }
      counts[key].scans++
      if (s.isUnique) counts[key].unique++
    })

    return Object.entries(counts).map(([name, data]) => ({
      name,
      Scans: data.scans,
      "Unique Scans": data.unique,
    }))
  }

  const getDeviceData = () => {
    if (!stats || !stats.devices) return []
    return Object.entries(stats.devices).map(([name, value]) => ({ name, value }))
  }

  const getBarData = (field: "os" | "browsers") => {
    if (!stats || !stats[field]) return []
    return Object.entries(stats[field]).map(([name, count]) => ({ name, count }))
  }

  const getGeoData = (field: "countries" | "cities") => {
    if (!stats || !stats[field]) return []
    return Object.entries(stats[field])
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // top 5
  }

  return (
    <div className="space-y-12">
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="glassmorphism p-6 h-fit">
          <CardHeader className="px-0 pt-0">
            <CardTitle>QR Parameters</CardTitle>
            <CardDescription>Configure QR code text, style, and redirection options.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-5">
            <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-xs text-yellow-600 dark:text-yellow-400 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span>⚠️</span> Dynamic QR Mode
              </p>
              {isFreeTier ? (
                <p>
                  Free plan: You can create <strong>1 dynamic QR code</strong>. It will expire after <strong>15 days</strong>.
                </p>
              ) : (
                <p>Pro plan: Unlimited dynamic QR codes with lifetime validity and analytics tracking.</p>
              )}
              {!isLoggedIn && (
                <p className="font-semibold mt-2">
                  Please <Link href="/login" className="underline font-black">Login / Register</Link> first to save redirects.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground" htmlFor="qr-text">
                {qrType === "dynamic" ? "Target Redirect URL *" : "Text / URL *"}
              </label>
              <Input 
                id="qr-text" 
                value={text} 
                onChange={e => setText(e.target.value)} 
                placeholder={qrType === "dynamic" ? "https://mywebsite.com/destination" : "e.g. hello world / URL"} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Size: {size}px</label>
              <Slider
                min={128}
                max={512}
                step={16}
                value={[size]}
                onValueChange={v => setSize(Array.isArray(v) ? v[0] : v)}
              />
            </div>

            <div className="flex gap-4 items-center">
              <ColorPicker
                label="Foreground Color"
                id="fg-color"
                value={fgColor}
                onChange={setFgColor}
                className="flex-1"
              />
              <ColorPicker
                label="Background Color"
                id="bg-color"
                value={bgColor}
                onChange={setBgColor}
                className="flex-1"
              />
            </div>

            {/* Logo Upload Option */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Center Logo (Pro/Business)</label>
                {!isPro && (
                  <span className="text-[9px] bg-primary/10 text-primary font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                    Pro Feature
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {logoUrl && (
                  <div className="relative w-12 h-12 border rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                    <button 
                      type="button"
                      onClick={() => setLogoUrl("")}
                      className="absolute top-0 right-0 bg-destructive text-white p-0.5 rounded-bl hover:bg-destructive/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <Input 
                  type="file" 
                  accept="image/*" 
                  disabled={!isPro}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => setLogoUrl(reader.result as string)
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="text-xs h-9 cursor-pointer"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button 
              onClick={generateQR} 
              disabled={loading || !text || limitReached || (qrType === "dynamic" && (!isLoggedIn || hasReachedDynamicLimit))} 
              className="w-full flex items-center justify-center font-bold"
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              {limitReached 
                ? "Daily Limit Reached" 
                : qrType === "dynamic" && hasReachedDynamicLimit 
                  ? "Dynamic Limit Reached (Max 1)" 
                  : "Generate QR Code"}
            </Button>

            {limitReached && (
              <p className="text-[10px] text-center text-muted-foreground">
                You&apos;ve reached your 5 daily generations. <Link href="/pricing" className="text-primary font-bold hover:underline">Upgrade to Pro →</Link>
              </p>
            )}
            {!isPro && !limitReached && (
              <p className="text-[10px] text-center text-muted-foreground">
                {MAX_FREE - usedToday} of {MAX_FREE} free generations left today
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {!qrDataUrl && !loading && (
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground min-h-[350px]">
              <p>Configure and generate your QR code to view live preview here.</p>
            </Card>
          )}

          {loading && (
            <Card className="h-full flex items-center justify-center min-h-[350px]">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating QR code...</span>
              </div>
            </Card>
          )}

          {qrDataUrl && !loading && (
            <Card className="p-6 flex flex-col items-center justify-center min-h-[350px] relative pt-12">
              {qrType === "dynamic" && (
                <div className="absolute top-4 left-4 bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Dynamic URL Redirect
                </div>
              )}
              <div 
                className="p-4 rounded-xl border bg-card shadow-inner flex items-center justify-center"
                style={{ backgroundColor: bgColor }}
              >
                <img 
                  src={qrDataUrl} 
                  alt="Generated QR Code" 
                  className="max-w-full h-auto object-contain"
                  style={{ width: size, height: size }}
                />
              </div>
              <Button onClick={downloadPNG} className="mt-6 flex items-center gap-2 font-bold">
                <Download className="h-4 w-4" /> Download PNG
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Dynamic QR Lists and Analytics Dashboard */}
      {isLoggedIn && userQrs.length > 0 && (
        <Card className="p-6">
          <CardHeader className="px-0 pt-0 border-b pb-4 mb-6">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Layers className="h-5 w-5 text-primary" />
              Your Dynamic QR Codes
            </CardTitle>
            <CardDescription>
              Manage your redirects and view visitor statistics.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 grid md:grid-cols-3 gap-8">
            {/* List */}
            <div className="space-y-3 md:col-span-1 border-r pr-6 max-h-[500px] overflow-y-auto">
              {userQrs.map((qr) => {
                const ageDays = (Date.now() - new Date(qr.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                const expired = isFreeTier && ageDays > 15
                return (
                  <div 
                    key={qr.id}
                    onClick={() => setSelectedQr(qr)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                      selectedQr?.id === qr.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-mono font-bold truncate flex-1">{qr.targetUrl}</span>
                      {expired && (
                        <span className="bg-yellow-500/10 text-yellow-600 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0">
                          Expired
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{new Date(qr.createdAt).toLocaleDateString()}</span>
                      <span className="bg-muted px-2 py-0.5 rounded text-foreground font-semibold">
                        {qr._count.scans} scan{qr._count.scans !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-1 border-t border-dashed mt-1 flex-wrap">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyLink(qr.id)
                        }}
                        className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline"
                      >
                        {copiedId === qr.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        Copy Link
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteQr(qr.id)
                        }}
                        className="text-[10px] text-destructive font-bold flex items-center gap-1 hover:underline ml-2"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                      <a 
                        href={`/q/${qr.id}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] text-muted-foreground hover:text-foreground font-bold flex items-center gap-1 ml-auto"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Test Redirect
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Dashboard Analytics View */}
            <div className="md:col-span-2 space-y-6">
              {!selectedQr ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center text-muted-foreground">
                  <p>Select a dynamic QR code from the list to view advanced scan analytics dashboard.</p>
                </div>
              ) : statsLoading ? (
                <div className="h-full min-h-[300px] flex items-center justify-center">
                  <Loader2 className="animate-spin h-8 w-8 text-primary" />
                </div>
              ) : stats ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-bold text-lg">Scan Insights</h3>
                      <p className="text-xs text-muted-foreground truncate max-w-md">Redirecting to {selectedQr.targetUrl}</p>
                    </div>
                    <div className="flex bg-muted p-0.5 rounded-lg gap-0.5 text-xs font-semibold">
                      {(["daily", "weekly", "monthly"] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTimeframe(t)}
                          className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                            timeframe === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* High level figures + QR Code Preview */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-primary/5 border-primary/20 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Scans</p>
                        <p className="text-3xl font-black text-primary tracking-tight mt-1">{stats.totalScans}</p>
                      </div>
                    </Card>
                    <Card className="p-4 bg-green-500/5 border-green-500/20 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Unique Visitors (New)</p>
                        <p className="text-3xl font-black text-green-600 tracking-tight mt-1">{stats.uniqueScans}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Repeat Scans: {stats.totalScans - stats.uniqueScans}
                      </p>
                    </Card>
                    <Card className="p-4 border-border flex flex-col items-center justify-center gap-2">
                      {selectedQrDataUrl ? (
                        <>
                          <div 
                            className="p-2 rounded-lg border bg-card shadow-inner flex items-center justify-center w-24 h-24 shrink-0"
                            style={{ backgroundColor: selectedQr.bgColor }}
                          >
                            <img 
                              src={selectedQrDataUrl} 
                              alt="QR Code" 
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <Button size="sm" onClick={downloadSelectedPNG} className="w-full text-xs h-7 font-bold">
                            <Download className="h-3 w-3 mr-1" /> Download
                          </Button>
                        </>
                      ) : (
                        <div className="text-xs text-muted-foreground animate-pulse">Generating QR...</div>
                      )}
                    </Card>
                  </div>

                  {/* Scans Timeline */}
                  <div className="h-64 border rounded-xl p-4 bg-muted/20">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Scan Timeline</p>
                    {getTimelineData().length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                        No scans recorded yet for this timeline filter.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={getTimelineData()}>
                          <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                          <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                          <Tooltip />
                          <Area type="monotone" dataKey="Scans" stroke="#0088FE" fillOpacity={0.1} fill="#0088FE" />
                          <Area type="monotone" dataKey="Unique Scans" stroke="#00C49F" fillOpacity={0.2} fill="#00C49F" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Device and Browser break-downs */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Device Pie Chart */}
                    <Card className="p-4">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Device Usage</p>
                      <div className="h-44 flex items-center justify-center">
                        {getDeviceData().length === 0 ? (
                          <span className="text-xs text-muted-foreground">No data</span>
                        ) : (
                          <div className="w-full h-full flex items-center gap-4">
                            <div className="w-1/2 h-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                  <Pie
                                    data={getDeviceData()}
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={3}
                                    dataKey="value"
                                  >
                                    {getDeviceData().map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                </RechartsPieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="flex-1 flex flex-col gap-1.5 justify-center text-xs">
                              {getDeviceData().map((item, idx) => (
                                <div key={item.name} className="flex items-center justify-between">
                                  <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                    {item.name}
                                  </span>
                                  <span className="font-extrabold">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Browser Stats */}
                    <Card className="p-4">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Browsers & OS</p>
                      <div className="h-44">
                        {getBarData("browsers").length === 0 ? (
                          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No data</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={getBarData("browsers")} layout="vertical">
                              <XAxis type="number" stroke="#888888" fontSize={9} />
                              <YAxis dataKey="name" type="category" stroke="#888888" fontSize={9} width={60} />
                              <Tooltip />
                              <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]} />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Geographic Scan Analytics Card */}
                  <Card className="p-5 border relative overflow-hidden mt-6">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Geographic Distribution</p>
                    
                    <div className={cn("grid md:grid-cols-2 gap-8 min-h-[180px] items-center", !isBusiness && "filter blur-sm pointer-events-none select-none")}>
                      {/* Country Bar Chart */}
                      <div className="h-44">
                        <p className="text-[11px] font-semibold text-muted-foreground mb-2">Top Countries</p>
                        {getGeoData("countries").length === 0 ? (
                          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No geo data recorded</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="90%">
                            <RechartsBarChart data={getGeoData("countries")} layout="vertical">
                              <XAxis type="number" stroke="#888888" fontSize={9} />
                              <YAxis dataKey="name" type="category" stroke="#888888" fontSize={9} width={50} />
                              <Tooltip />
                              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        )}
                      </div>

                      {/* City Bar Chart / List */}
                      <div className="h-44">
                        <p className="text-[11px] font-semibold text-muted-foreground mb-2">Top Cities</p>
                        {getGeoData("cities").length === 0 ? (
                          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No city data recorded</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="90%">
                            <RechartsBarChart data={getGeoData("cities")} layout="vertical">
                              <XAxis type="number" stroke="#888888" fontSize={9} />
                              <YAxis dataKey="name" type="category" stroke="#888888" fontSize={9} width={80} />
                              <Tooltip />
                              <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* Locked Overlay if not Business */}
                    {!isBusiness && (
                      <div className="absolute inset-0 bg-background/40 flex flex-col items-center justify-center text-center p-6 z-10">
                        <div className="bg-primary/10 text-primary p-3 rounded-full mb-3 shadow-inner">
                          <Layers className="h-6 w-6" />
                        </div>
                        <h4 className="font-bold text-sm text-foreground">Business Feature Locked</h4>
                        <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4 leading-normal">
                          Geographic Scan Tracking is exclusive to the Business Plan. Upgrade to access real-time location metrics.
                        </p>
                        <Link href="/pricing">
                          <Button size="sm" className="font-black text-xs px-5 shadow-lg shadow-primary/20">
                            Upgrade to Business
                          </Button>
                        </Link>
                      </div>
                    )}
                  </Card>
                </div>
              ) : (
                <div className="h-full min-h-[300px] flex items-center justify-center text-xs text-muted-foreground">
                  Failed to load analytics dashboard data.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO Info Section */}
      <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">What is a Dynamic QR Code?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Unlike static QR codes which encode the destination URL directly into the pixel pattern, a dynamic QR code points to a secure short link on our server. When someone scans it, our system logs the scan details in real-time before instantly redirecting them to your target website.
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            This design allows you to change the destination URL at any time without ever having to print a new physical QR code. It also opens up powerful tracking capabilities, allowing you to monitor and measure your campaign's performance instantly.
          </p>
          <h3 className="text-lg font-bold mt-8 mb-3">Key Capabilities</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { fmt: "Edit URL Anytime", desc: "Change the destination URL on the fly without changing the QR code." },
              { fmt: "Scan Counter", desc: "Track total redirects and unique visitors scanner activity." },
              { fmt: "Device Telemetry", desc: "Understand if users are scanning from iOS, Android, or desktop." },
              { fmt: "Time Aggregation", desc: "Filter scan frequencies daily, weekly, and monthly." },
            ].map(item => (
              <div key={item.fmt} className="bg-muted/40 rounded-xl p-3 border border-primary/5">
                <p className="font-black text-primary text-sm">{item.fmt}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
          <h3 className="text-xl font-black tracking-tight mb-6">Why Use Trackable QR Codes?</h3>
          <ul className="space-y-5 list-none p-0">
            {[
              { title: "Measure Marketing ROI", desc: "Track exactly how many scans each placement generates so you know which offline campaigns yield the highest conversion." },
              { title: "Split-test Target Pages", desc: "A/B test different target landing pages by updating the dynamic target URL inside your dashboard without replacing the code." },
              { title: "Prevent Broken Links", desc: "If your target website changes or experiences downtime, immediately change the redirect URL to prevent broken scanner experiences." },
              { title: "Pro Analytics Charts", desc: "Unlock interactive visualization charts built on top of visitor device types, browsers, and timelines for granular details." },
              { title: "15-Day Free Trial", desc: "Free tier users get 1 active dynamic QR code valid for 15 days to test redirect speed and verify logging capabilities." },
            ].map((item, i) => (
              <li key={i} className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-primary">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-foreground leading-none mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
