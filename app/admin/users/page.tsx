"use client";

import { useState } from "react";
import { Mail, Phone, MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Dummy JSON Data for Users
const dummyUsers = [
  {
    id: "USR-001",
    name: "Ravi Kumar",
    email: "ravi.k@example.com",
    phone: "+91 9876543210",
    totalOrders: 3,
    totalSpent: "₹5,497",
    joined: "2025-11-12",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    phone: "+91 8765432109",
    totalOrders: 1,
    totalSpent: "₹1,299",
    joined: "2026-01-05",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Amit Patel",
    email: "amit.p@example.com",
    phone: "+91 7654321098",
    totalOrders: 5,
    totalSpent: "₹12,495",
    joined: "2025-08-22",
    status: "Inactive",
  },
];

export default function AdminUsers() {
  const [users] = useState(dummyUsers);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">View and manage customer data and order history.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Customers</CardTitle>
          <div className="flex items-center gap-2">
            <Input placeholder="Search customers..." className="w-64 h-9" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-center">Total Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <Badge variant="outline" className="w-fit mt-1 text-[10px]">
                        {user.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" /> {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell className="text-center font-medium">{user.totalOrders}</TableCell>
                  <TableCell className="text-right font-medium">{user.totalSpent}</TableCell>
                  <TableCell className="text-right">
                    <UserActionMenu user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// User Action Menu with Modal logic
function UserActionMenu({ user }: { user: any }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
            <Eye className="mr-2 h-4 w-4" /> View Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.location.href = `mailto:${user.email}`}>
            <Mail className="mr-2 h-4 w-4" /> Email Customer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Detail Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>Quick overview for {user.name}</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Customer ID</span>
              <span className="font-mono">{user.id}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Phone</span>
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Total Orders</span>
              <span className="font-medium">{user.totalOrders}</span>
            </div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-muted-foreground">Lifetime Value</span>
              <span className="font-semibold text-green-600">{user.totalSpent}</span>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}