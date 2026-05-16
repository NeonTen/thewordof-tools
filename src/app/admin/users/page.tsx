"use client"

import * as React from "react"
import { 
  Search, 
  MoreVertical, 
  Shield, 
  User as UserIcon, 
  Trash2, 
  Key, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  
  // Modals state
  const [selectedUser, setSelectedUser] = React.useState<any>(null)
  const [isUpdatePlanOpen, setIsUpdatePlanOpen] = React.useState(false)
  const [isUpdateRoleOpen, setIsUpdateRoleOpen] = React.useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  
  const [newPlan, setNewPlan] = React.useState("")
  const [newRole, setNewRole] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [actionLoading, setActionLoading] = React.useState(false)

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to fetch users" }))
        console.error("Fetch users error:", errorData)
        setUsers([])
        return
      }
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error("Fetch users exception:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchUsers()
  }, [])

  const handleAction = async (userId: string, body: any) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      if (res.ok) {
        fetchUsers()
        // Close all modals
        setIsUpdatePlanOpen(false)
        setIsUpdateRoleOpen(false)
        setIsResetPasswordOpen(false)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (userId: string) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE"
      })
      if (res.ok) {
        fetchUsers()
        setIsDeleteOpen(false)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setActionLoading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight leading-none mb-2">User Management</h1>
          <p className="text-muted-foreground text-sm">Manage all registered users and their permissions.</p>
        </div>
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-9 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden py-0">
        <Table>
          <TableHeader className="bg-muted/80">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-bold h-10 px-4">User</TableHead>
              <TableHead className="font-bold h-10 px-4">Role</TableHead>
              <TableHead className="font-bold h-10 px-4">Plan</TableHead>
              <TableHead className="font-bold h-10 px-4">Joined</TableHead>
              <TableHead className="font-bold h-10 px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">Loading users...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm">
                  No users found matching your search.
                </TableCell>
              </TableRow>
            ) : filteredUsers.map((user) => {
              const currentSub = user.subscriptions?.[0]
              const hasPremium = user.role === 'PRO' || user.role === 'ADMIN' || currentSub?.plan === 'PREMIUM'
              
              return (
                <TableRow key={user.id} className="hover:bg-muted/50 transition-colors border-border">
                  <TableCell className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {user.name?.[0] || user.email?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm leading-none mb-1">{user.name || "N/A"}</span>
                        <span className="text-[11px] text-muted-foreground leading-none">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-4">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                      user.role === 'ADMIN' ? 'bg-destructive/10 text-destructive' : 
                      user.role === 'PRO' ? 'bg-primary/10 text-primary' : 
                      'bg-muted text-muted-foreground'
                    }`}>
                      {user.role === 'ADMIN' ? <Shield className="h-2.5 w-2.5" /> : <UserIcon className="h-2.5 w-2.5" />}
                      {user.role}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${hasPremium ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'bg-muted-foreground/50'}`} />
                      <span className="text-xs font-bold">{hasPremium ? 'PREMIUM' : 'FREE'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[11px] text-muted-foreground py-2 px-4 font-medium">
                    {new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(user.createdAt))}
                  </TableCell>
                  <TableCell className="py-2 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user)
                            setNewRole(user.role)
                            setIsUpdateRoleOpen(true)
                          }}>
                            <Shield className="mr-2 h-4 w-4" />
                            Update Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user)
                            setNewPlan(hasPremium ? 'PREMIUM' : 'FREE')
                            setIsUpdatePlanOpen(true)
                          }}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Update Subscription
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user)
                            setIsResetPasswordOpen(true)
                          }}>
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDeleteOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Update Role Dialog */}
      <Dialog open={isUpdateRoleOpen} onOpenChange={setIsUpdateRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
            <DialogDescription>
              Change the administrative permissions for {selectedUser?.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Select Role</Label>
            <Select value={newRole} onValueChange={(val) => setNewRole(val as string)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="PRO">PRO (Auto-grants tools)</SelectItem>
                <SelectItem value="ADMIN">ADMIN (Super Access)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateRoleOpen(false)}>Cancel</Button>
            <Button onClick={() => handleAction(selectedUser.id, { role: newRole })} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Plan Dialog */}
      <Dialog open={isUpdatePlanOpen} onOpenChange={setIsUpdatePlanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Subscription Plan</DialogTitle>
            <DialogDescription>
              Manually override the subscription for {selectedUser?.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Select Plan</Label>
            <Select value={newPlan} onValueChange={(val) => setNewPlan(val as string)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">FREE</SelectItem>
                <SelectItem value="PREMIUM">PREMIUM (Paid Access)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdatePlanOpen(false)}>Cancel</Button>
            <Button onClick={() => handleAction(selectedUser.id, { plan: newPlan })} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a temporary password for {selectedUser?.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label>New Password</Label>
            <Input 
              type="password" 
              placeholder="Minimum 8 characters" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => handleAction(selectedUser.id, { resetPassword: newPassword })} 
              disabled={actionLoading || newPassword.length < 8}
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="border-destructive/20">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-bold text-foreground">{selectedUser?.email}</span>? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDelete(selectedUser.id)} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
