"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Mail,
  Phone,
  MoreHorizontal,
  Eye,
  ShieldAlert,
  Trash2,
  Loader2,
  IndianRupee,
  Users,
  RefreshCcw,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  getAllUsersAdmin,
  updateUserRole,
  deleteUserAdmin,
} from "@/app/actions/adminActions";

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

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.includes(q))
      );
    }

    if (roleFilter !== "All") {
      result = result.filter(
        (u) => u.role.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      switch (sortBy) {
        case "Newest":
          return dateB - dateA;
        case "Oldest":
          return dateA - dateB;
        case "Highest Spent":
          return b.totalSpent - a.totalSpent;
        case "Most Orders":
          return b.totalOrders - a.totalOrders;
        default:
          return 0;
      }
    });

    return result;
  }, [users, searchQuery, roleFilter, sortBy]);

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight nunito text-primary mb-1">
            Customers
          </h2>
          <p className="text-muted-foreground inter text-sm">
            Manage your user base, permissions, and lifetime values.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchUsers}
          disabled={loading}
          className="rounded-xl shadow-sm hover:shadow-md transition-all px-6"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCcw className="w-4 h-4 mr-2" />
          )}
          {loading ? "Syncing..." : "Refresh Directory"}
        </Button>
      </div>

      <Card className="shadow-sm border-border/60 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-muted/20 border-b border-border/40 pb-4">
          <CardTitle className="text-lg">Directory</CardTitle>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Input
              placeholder="Search name, email, phone..."
              className="w-full sm:w-64 h-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[130px] h-9 bg-background">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[170px] h-9 bg-background">
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

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary/50 mb-4" />
              <p className="text-sm text-muted-foreground font-medium animate-pulse">
                Syncing customer directory...
              </p>
            </div>
          ) : filteredAndSortedUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Users className="w-12 h-12 mb-4 opacity-25" />
              <p className="text-base font-medium">No users found.</p>
              <p className="text-sm opacity-70">
                Try adjusting your search, role filter, or sorting.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow className="hover:bg-muted/20">
                    <TableHead className="w-[64px] pl-6">S.No</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-center">Total Orders</TableHead>
                    <TableHead className="text-right">Lifetime Value</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedUsers.map((user, index) => (
                    <TableRow key={user._id} className="hover:bg-muted/40">
                      <TableCell className="pl-6 text-muted-foreground font-medium">
                        {(index + 1).toString().padStart(2, "0")}
                      </TableCell>

                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold">{user.name}</span>
                          <Badge
                            variant={user.role === "admin" ? "default" : "secondary"}
                            className="w-fit text-[10px] uppercase"
                          >
                            {user.role}
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[220px]">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="text-center font-semibold">
                        {user.totalOrders}
                      </TableCell>

                      <TableCell className="text-right font-semibold text-primary">
                        <span className="inline-flex items-center">
                          <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                          {user.totalSpent.toLocaleString("en-IN")}
                        </span>
                      </TableCell>

                      <TableCell className="text-right pr-6">
                        <UserActionMenu user={user} refreshData={fetchUsers} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function UserActionMenu({
  user,
  refreshData,
}: {
  user: IAdminUser;
  refreshData: () => void;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [targetRole, setTargetRole] = useState(user.role);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdateRole = async () => {
    setIsProcessing(true);
    const res = await updateUserRole(user._id, targetRole);
    if (res.success) {
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
    if (res.success) {
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
          <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-muted">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-52 rounded-xl shadow-lg border-border/50"
        >
          <DropdownMenuLabel className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
            Account Actions
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setDetailsOpen(true)} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" /> View Profile
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setRoleOpen(true)} className="cursor-pointer">
            <ShieldAlert className="mr-2 h-4 w-4" /> Update Role
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => (window.location.href = `mailto:${user.email}`)}
            className="cursor-pointer"
          >
            <Mail className="mr-2 h-4 w-4" /> Send Email
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center">
              <Trash2 className="w-5 h-5 mr-2" /> Delete User
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to permanently delete{" "}
              <strong>{user.name}</strong> ({user.email})?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={isProcessing}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isProcessing}
              className="rounded-xl"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Update Modal */}
      <Dialog open={roleOpen} onOpenChange={setRoleOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              Update Account Role
            </DialogTitle>
            <DialogDescription>
              Assign role permissions for {user.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Select Role
            </Label>
            <Select value={targetRole} onValueChange={setTargetRole}>
              <SelectTrigger className="mt-2 h-11">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleOpen(false)}
              disabled={isProcessing}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRole}
              disabled={isProcessing || targetRole === user.role}
              className="rounded-xl"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Detail Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[640px] rounded-2xl p-0 overflow-hidden">
          <div className="border-b bg-muted/20 px-6 py-4">
            <DialogTitle className="text-xl">Profile Overview</DialogTitle>
            <DialogDescription className="mt-1 font-mono text-xs">
              UID: ...{user._id.slice(-8)}
            </DialogDescription>
          </div>

          <div className="p-6 grid gap-5 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border rounded-xl p-4 bg-background">
              <div>
                <p className="text-muted-foreground text-xs uppercase font-semibold mb-1">
                  Standard Info
                </p>
                <p className="font-semibold text-base">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="mt-1 text-muted-foreground">
                  {user.phone || "No phone provided"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase font-semibold mb-1">
                  Metrics
                </p>
                <p className="flex justify-between items-center max-w-[190px]">
                  <span className="text-muted-foreground">Joined:</span>
                  <span className="font-semibold">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p className="flex justify-between items-center max-w-[190px] mt-1">
                  <span className="text-muted-foreground">Orders:</span>
                  <span className="font-semibold">{user.totalOrders}</span>
                </p>
                <p className="flex justify-between items-center max-w-[190px] mt-1">
                  <span className="text-muted-foreground">Role:</span>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"} className="uppercase text-[10px]">
                    {user.role}
                  </Badge>
                </p>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-xs uppercase font-semibold mb-2">
                Stored Shipping Address
              </p>
              <div className="p-4 bg-muted/30 border rounded-xl">
                {user.address?.street ? (
                  <p className="text-muted-foreground leading-relaxed">
                    {user.address.street}
                    <br />
                    {user.address.city}, {user.address.state} - {user.address.zip}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    No address populated.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/20">
              <span className="text-primary font-semibold">
                Total Revenue (Lifetime Value)
              </span>
              <span className="font-bold text-xl text-primary flex items-center">
                <IndianRupee className="w-5 h-5 mr-0.5" />
                {user.totalSpent.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="px-6 pb-6 flex justify-end">
            <Button onClick={() => setDetailsOpen(false)} className="rounded-xl">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}