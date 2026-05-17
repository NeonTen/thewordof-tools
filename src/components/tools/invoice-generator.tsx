"use client"

import React, { useState } from "react"
import { Plus, Trash2, Download, Printer } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { ProGate } from "@/components/ui/pro-gate"
import { cn } from "@/lib/utils"
import { useUsageLimit } from "@/hooks/use-usage-limit"

// Pure native toggle — no Base UI dependency, always reliable
function NativeToggle({
  checked,
  onChange,
  label,
  description,
  bordered = false
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
  bordered?: boolean
}) {
  return (
    <div className={cn("flex items-center justify-between", bordered && "border-t pt-4")}>
      <div className="space-y-0.5">
        <p className="text-xs font-bold">{label}</p>
        {description && <p className="text-[10px] text-muted-foreground">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-muted border-muted-foreground/30"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  )
}

export function InvoiceGenerator({ isPro = false }: { isPro?: boolean }) {
  
  const { count: usedThisMonth, increment: incrementUsage } = useUsageLimit("invoice-generator", "monthly")
  const MAX_FREE_INVOICES = 3

  const limitReached = !isPro && usedThisMonth >= MAX_FREE_INVOICES

  const [invoice, setInvoice] = useState({
    invoiceNumber: "INV-001",
    date: new Date().toISOString().split('T')[0],
    dueDate: "",
    fromName: "TheWordOf Tools",
    fromEmail: "hello@thewordof.com",
    fromAddress: "",
    toName: "",
    toEmail: "",
    toAddress: "",
    currency: "$",
    taxRate: 0,
    discountRate: 0,
    notes: "Thank you for your business!",
    showWatermark: true,
    logo: ""
  })

  const [items, setItems] = useState([
    { id: 1, description: "Web Development Services", quantity: 1, price: 1500 }
  ])

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setInvoice({ ...invoice, [name]: checked })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setInvoice(prev => ({ ...prev, logo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, price: 0 }])
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleItemChange = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  const discountAmount = subtotal * (invoice.discountRate / 100)
  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * (invoice.taxRate / 100)
  const total = taxableAmount + taxAmount

  return (<>
    <div className="grid lg:grid-cols-2 gap-8 print:block print:w-full">
      {/* Editor Panel */}
      <div className="space-y-6 print:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice Number</Label>
                <Input name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleInvoiceChange} />
              </div>
              <div className="space-y-2">
                <Label>Currency Symbol</Label>
                <Input name="currency" value={invoice.currency} onChange={handleInvoiceChange} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" name="date" value={invoice.date} onChange={handleInvoiceChange} />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" name="dueDate" value={invoice.dueDate} onChange={handleInvoiceChange} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">From</h3>
                <Input placeholder="Your Company Name" name="fromName" value={invoice.fromName} onChange={handleInvoiceChange} />
                <Input placeholder="Email Address" name="fromEmail" value={invoice.fromEmail} onChange={handleInvoiceChange} />
                <Input placeholder="Address" name="fromAddress" value={invoice.fromAddress} onChange={handleInvoiceChange} />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Bill To</h3>
                <Input placeholder="Client Name" name="toName" value={invoice.toName} onChange={handleInvoiceChange} />
                <Input placeholder="Client Email" name="toEmail" value={invoice.toEmail} onChange={handleInvoiceChange} />
                <Input placeholder="Client Address" name="toAddress" value={invoice.toAddress} onChange={handleInvoiceChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button size="sm" variant="outline" onClick={addItem}><Plus className="h-4 w-4 mr-2" /> Add Item</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <Input placeholder="Description" value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} />
                </div>
                <div className="w-24 space-y-2">
                  <Input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))} />
                </div>
                <div className="w-32 space-y-2">
                  <Input type="number" min="0" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', Number(e.target.value))} />
                </div>
                <Button variant="ghost" size="icon" className="text-red-500 mt-0.5" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input type="number" name="taxRate" value={invoice.taxRate} onChange={handleInvoiceChange} />
              </div>
              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input type="number" name="discountRate" value={invoice.discountRate} onChange={handleInvoiceChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Notes</Label>
              <ProGate feature="Custom Notes" isPro={isPro}>
                <Input 
                  name="notes" 
                  value={invoice.notes} 
                  onChange={handleInvoiceChange}
                  placeholder="Enter any additional notes..."
                />
              </ProGate>
            </div>

            <div className="pt-4 border-t space-y-6">
              <h3 className="font-semibold text-sm">Custom Branding</h3>
              
              <ProGate feature="Company Logo" isPro={isPro}>
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="flex items-center gap-4">
                    {invoice.logo && (
                      <div className="relative w-16 h-16 border rounded bg-muted flex items-center justify-center overflow-hidden">
                        <img src={invoice.logo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                        <button 
                          onClick={() => setInvoice(prev => ({ ...prev, logo: "" }))}
                          className="absolute top-0 right-0 bg-destructive text-white p-0.5 rounded-bl"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload}
                      className="text-xs h-9 cursor-pointer"
                    />
                  </div>
                </div>
              </ProGate>

              <ProGate feature="Watermark Removal" isPro={isPro}>
                <NativeToggle 
                  label="Show Watermark"
                  description='Adds "Powered by TheWordOf Tools" to your PDF.'
                  checked={invoice.showWatermark}
                  onChange={(val) => handleSwitchChange('showWatermark', val)}
                />
              </ProGate>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="space-y-4 print:space-y-0">
        <div className="relative">
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mb-4 print:hidden">
            {!isPro && (
              <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                {MAX_FREE_INVOICES - usedThisMonth} of {MAX_FREE_INVOICES} free invoices left this month
              </span>
            )}
            <Button 
              onClick={async () => {
                if (!isPro) {
                  try {
                    await incrementUsage(1)
                  } catch {
                    alert("Could not record usage – please try again.")
                    return
                  }
                }
                window.print()
              }} 
              className="bg-primary"
              disabled={limitReached}
            >
              <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
            </Button>
          </div>
          {limitReached && (
            <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center">
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Monthly limit reached! Upgrade to Pro for unlimited invoices.</p>
              <Link href="/pricing" className="text-xs font-black text-primary hover:underline mt-1 block uppercase">View Pricing →</Link>
            </div>
          )}
          <div className="border rounded-lg bg-white text-black p-8 shadow-sm print:shadow-none print:border-none print:px-16 print:py-12 overflow-hidden relative">
            {/* Watermark */}
            {invoice.showWatermark && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 opacity-[0.03] pointer-events-none select-none z-0">
                <p className="text-8xl font-black whitespace-nowrap uppercase tracking-tighter">
                  TheWordOf Tools
                </p>
              </div>
            )}

            <div className="flex justify-between items-start mb-8 border-b pb-8 relative z-10">
              <div>
                {invoice.logo && (
                  <div className="mb-4">
                    <img src={invoice.logo} alt="Logo" className="max-h-16 object-contain" />
                  </div>
                )}
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">INVOICE</h1>
                <p className="text-gray-500 print:text-gray-600 mt-1 font-medium">#{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{invoice.fromName}</p>
                <p className="text-sm text-gray-500 print:text-gray-800">{invoice.fromEmail}</p>
                <p className="text-sm text-gray-500 print:text-gray-800">{invoice.fromAddress}</p>
              </div>
            </div>

            <div className="flex justify-between mb-8 relative z-10">
              <div>
                <p className="text-sm text-gray-500 print:text-gray-800 uppercase tracking-wider mb-1">Bill To</p>
                <p className="font-bold">{invoice.toName || "Client Name"}</p>
                <p className="text-sm text-gray-500 print:text-gray-800">{invoice.toEmail}</p>
                <p className="text-sm text-gray-500 print:text-gray-800">{invoice.toAddress}</p>
              </div>
              <div className="text-right">
                <p className="text-sm"><span className="text-gray-500 print:text-gray-800 mr-2">Date:</span> {invoice.date}</p>
                <p className="text-sm"><span className="text-gray-500 print:text-gray-800 mr-2">Due Date:</span> {invoice.dueDate}</p>
              </div>
            </div>

            <Table className="mb-8 relative z-10">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description || "Item description"}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{invoice.currency}{item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{invoice.currency}{(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end mb-8 relative z-10">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500 print:text-gray-800">
                  <span>Subtotal</span>
                  <span>{invoice.currency}{subtotal.toFixed(2)}</span>
                </div>
                {invoice.discountRate > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Discount ({invoice.discountRate}%)</span>
                    <span>-{invoice.currency}{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between text-gray-500 print:text-gray-800">
                    <span>Tax ({invoice.taxRate}%)</span>
                    <span>{invoice.currency}{taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{invoice.currency}{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 text-sm text-gray-500 print:text-gray-800 relative z-10">
              <p className="font-bold text-gray-700">Notes</p>
              <p>{invoice.notes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* SEO Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20 print:hidden">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">What is an Online Invoice Generator?</h2>
        <p className="text-muted-foreground leading-relaxed">
          An online invoice generator lets freelancers and small businesses create professional, print-ready invoices in minutes without needing expensive accounting software. Simply enter your client details, line items, and tax rate — and download a PDF invoice instantly.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Professional invoices protect both parties in a transaction by creating a clear paper trail. They specify payment terms, due dates, and itemised services, reducing disputes and improving cash flow for your business.
        </p>
      </section>
      <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-6">What Should an Invoice Include?</h3>
        <ul className="space-y-4 list-none p-0">
          {[
            { title: "Invoice Number", desc: "A unique sequential number for each invoice. Essential for accounting, tax filing, and tracking overdue payments." },
            { title: "Business & Client Details", desc: "Include your name/business name, address, and the client's details. This is legally required in many countries." },
            { title: "Itemised Line Items", desc: "List each product or service separately with a description, quantity, unit price, and subtotal. Clarity prevents disputes." },
            { title: "Payment Terms", desc: "Specify due dates (e.g., Net 30) and accepted payment methods. Clear terms reduce late payments by up to 30%." },
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
  </>)
}
