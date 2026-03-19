"use client";

import { useState } from "react";
import { CopyIcon, InfoIcon, Truck, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

// Dummy JSON Data (until backend is plugged in)
const dummyOrders = [
  {
    id: "ORD-9281",
    customer: "Ravi Kumar",
    email: "ravi.k@example.com",
    date: "2026-03-20",
    total: "₹2,499",
    status: "Processing",
    payment: "Paid",
    awb: "",
  },
  {
    id: "ORD-9280",
    customer: "Priya Sharma",
    email: "priya.s@example.com",
    date: "2026-03-19",
    total: "₹1,299",
    status: "Dispatched",
    payment: "Paid",
    awb: "DEL123456789",
  },
  {
    id: "ORD-9279",
    customer: "Amit Patel",
    email: "amit.p@example.com",
    date: "2026-03-18",
    total: "₹4,999",
    status: "Delivered",
    payment: "Paid",
    awb: "DEL987654321",
  },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState(dummyOrders);

  // Status mapping to colors based on shadcn variants
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "Dispatched": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Delivered": return "bg-green-100 text-green-800 hover:bg-green-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Manage your customer orders and tracking statuses here.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <div className="flex items-center gap-2">
            <Input placeholder="Search orders..." className="w-64 h-9" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tracking AWB</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.customer}</span>
                      <span className="text-xs text-muted-foreground">{order.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.awb ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono">{order.awb}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Not Assigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{order.total}</TableCell>
                  <TableCell className="text-right">
                    
                    {/* The Action Menu with integrated Modals */}
                    <OrderActionMenu order={order} />
                    
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

// Separate little component for the Action Dropdown to manage modal states easily
function OrderActionMenu({ order }: { order: any }) {
  const [awbOpen, setAwbOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
            <CopyIcon className="mr-2 h-4 w-4" /> Copy Order ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
            <InfoIcon className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAwbOpen(true)}>
            <Truck className="mr-2 h-4 w-4" /> Update AWB
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusOpen(true)}>
            <Badge className="mr-2 h-4 w-4 bg-muted text-muted-foreground hover:bg-muted" /> Update Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* MODAL 1: Update AWB */}
      <Dialog open={awbOpen} onOpenChange={setAwbOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Tracking / AWB</DialogTitle>
            <DialogDescription>
              Assign or update the Airway Bill number for order {order.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="awb">AWB Number</Label>
              <Input id="awb" defaultValue={order.awb} placeholder="e.g. DEL123456789" />
              <p className="text-xs text-muted-foreground">Updating this will notify the user via email automatically.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAwbOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={() => setAwbOpen(false)}>Save & Notify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Update Status */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the internal status for order {order.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-3">
              <Label>Current Status</Label>
              <Select defaultValue={order.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Dispatched">Dispatched</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={() => setStatusOpen(false)}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Order Details */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Summary: {order.id}</DialogTitle>
            <DialogDescription>Placed on {order.date}</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Customer:</span>
                  <p className="font-medium">{order.customer}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Contact:</span>
                  <p className="font-medium">{order.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Payment Status:</span>
                  <p className="font-medium text-green-600">{order.payment}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tracking AWB:</span>
                  <p className="font-mono font-medium">{order.awb || "N/A"}</p>
                </div>
             </div>
             
             {/* Dummy Product mapping area */}
             <div>
               <h4 className="font-semibold text-sm mb-2 border-b pb-2">Items Ordered</h4>
               <div className="flex justify-between items-center py-2 text-sm">
                 <div>
                   <p className="font-medium">Premium Cotton T-Shirt</p>
                   <p className="text-muted-foreground text-xs">Qty: 2</p>
                 </div>
                 <p className="font-medium">₹1,499</p>
               </div>
               <div className="flex justify-between items-center py-2 text-sm">
                 <div>
                   <p className="font-medium">Running Sneakers</p>
                   <p className="text-muted-foreground text-xs">Qty: 1</p>
                 </div>
                 <p className="font-medium">₹1,000</p>
               </div>
               <div className="flex justify-between items-center py-2 border-t mt-2 text-sm">
                 <p className="font-semibold">Total Paid</p>
                 <p className="font-semibold">{order.total}</p>
               </div>
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