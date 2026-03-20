"use client";

import { useState, useEffect, useMemo } from "react";
import { Mail, Phone, MoreHorizontal, Eye, ShieldAlert, Trash2, Loader2, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { getAllUsersAdmin, updateUserRole, deleteUserAdmin } from "@/app/actions/adminActions";
import { Label } from "@/components/ui/label";

// Strict Types avoiding any
interface IAdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getAllUsersAdmin();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Secure client-side logic mapped efficiently via useMemo
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((u) => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q))
      );
    }

    // 2. Role Filter
    if (roleFilter !== "All") {
      result = result.filter((u) => u.role.toLowerCase() === roleFilter.toLowerCase());
    }

    // 3. Sorting Engine
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      switch (sortBy) {
        case "Newest": return dateB - dateA;
        case "Oldest": return dateA - dateB;
        case "Highest Spent": return b.totalSpent - a.totalSpent;
        case "Most Orders": return b.totalOrders - a.totalOrders;
        default: return 0;
      }
    });

    return result;
  }, [users, searchQuery, roleFilter, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Manage your user base, permissions, and lifetime values.</p>
        </div>
        <Button variant="outline" onClick={fetchUsers} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Refresh Directory"}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle>Directory</CardTitle>
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Input 
              placeholder="Search name, email, phone..." 
              className="w-full md:w-64 h-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Newest">Newest Joined</SelectItem>
                <SelectItem value="Oldest">Oldest First</SelectItem>
                <SelectItem value="Highest Spent">Highest LTV</SelectItem>
                <SelectItem value="Most Orders">Most Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
             <div className="flex justify-center p-10">
               <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
             </div>
          ) : filteredAndSortedUsers.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">
                No active users match your criteria.
             </div>
          ) : (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Customer</TableHead>
                   <TableHead>Contact</TableHead>
                   <TableHead>Joined</TableHead>
                   <TableHead className="text-center">Total Orders</TableHead>
                   <TableHead className="text-right">Lifetime Value</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredAndSortedUsers.map((user) => (
                   <TableRow key={user._id}>
                     <TableCell className="font-medium">
                       <div className="flex flex-col">
                         <span>{user.name}</span>
                         <Badge 
                           variant={user.role === "admin" ? "default" : "outline"} 
                           className={`w-fit mt-1 text-[10px] uppercase ${user.role === 'admin' ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                          >
                           {user.role}
                         </Badge>
                       </div>
                     </TableCell>
                     <TableCell>
                       <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                         <div className="flex items-center gap-2">
                           <Mail className="h-3 w-3" /> {user.email}
                         </div>
                         {user.phone && (
                           <div className="flex items-center gap-2">
                             <Phone className="h-3 w-3" /> {user.phone}
                           </div>
                         )}
                       </div>
                     </TableCell>
                     <TableCell className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                     <TableCell className="text-center font-medium">{user.totalOrders}</TableCell>
                     <TableCell className="text-right font-medium text-emerald-600">
                        ₹{user.totalSpent.toLocaleString("en-IN")}
                     </TableCell>
                     <TableCell className="text-right">
                       <UserActionMenu user={user} refreshData={fetchUsers} />
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// User Action Menu with Modal logic strongly typed
function UserActionMenu({ user, refreshData }: { user: IAdminUser, refreshData: () => void }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [targetRole, setTargetRole] = useState(user.role);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdateRole = async () => {
    setIsProcessing(true);
    const res = await updateUserRole(user._id, targetRole);
    if(res.success) {
      toast.success("User role updated successfully.");
      refreshData();
      setRoleOpen(false);
    } else {
      toast.error(res.error || "Update failed.");
    }
    setIsProcessing(false);
  };

  const handleDeleteUser = async () => {
    setIsProcessing(true);
    const res = await deleteUserAdmin(user._id);
    if(res.success){
      toast.success("User successfully deleted.");
      refreshData();
      setDeleteOpen(false);
    } else {
      toast.error(res.error || "Failed to delete user.");
    }
    setIsProcessing(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Account Interventions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
            <Eye className="mr-2 h-4 w-4" /> Enlarge Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.location.href = `mailto:${user.email}`}>
            <Mail className="mr-2 h-4 w-4" /> Send Email Request
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-red-600 focus:text-red-600">
             <Trash2 className="mr-2 h-4 w-4" /> Erase Customer 
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      
      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center"><Trash2 className="w-5 h-5 mr-2"/> Delete User</DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to permanently erase <strong>{user.name}</strong> ({user.email})? They will lose access to their profile and active session instantly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isProcessing}>Abort</Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isProcessing}>
               {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : null} 
               Confirm Ejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deep Profile Detail Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Deep Profile Overview</DialogTitle>
            <DialogDescription>ID: ...{user._id}</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 text-sm mt-2">
            <div className="grid grid-cols-2 gap-y-4 border-b pb-4">
               <div>
                 <p className="text-muted-foreground text-xs uppercase font-semibold mb-1">Standard Info</p>
                 <p className="font-medium text-base">{user.name}</p>
                 <p>{user.email}</p>
                 <p className="mt-1">{user.phone || "No phone given"}</p>
               </div>
               <div>
                 <p className="text-muted-foreground text-xs uppercase font-semibold mb-1">Metrics</p>
                 <p className="flex justify-between items-center max-w-[150px]"><span className="text-muted-foreground">Joined:</span> <span className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</span></p>
                 <p className="flex justify-between items-center max-w-[150px] mt-1"><span className="text-muted-foreground">Volume:</span> <span className="font-semibold">{user.totalOrders} Orders</span></p>
               </div>
            </div>
            
            <div className="pb-4">
              <p className="text-muted-foreground text-xs uppercase font-semibold mb-2">Stored Shipping Default</p>
              <div className="p-3 bg-muted/40 border rounded-lg">
                {user.address?.street ? (
                   <p className="text-muted-foreground leading-relaxed">
                     {user.address.street}, <br/>
                     {user.address.city}, {user.address.state} — {user.address.zip}
                   </p>
                ) : (
                  <p className="text-muted-foreground italic">No address populated.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-emerald-800 font-semibold">Total Revenue (Lifetime Value)</span>
              <span className="font-bold text-xl text-emerald-600 flex items-center">
                 <IndianRupee className="w-5 h-5 mr-0.5"/> {user.totalSpent.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setDetailsOpen(false)}>Close View</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}