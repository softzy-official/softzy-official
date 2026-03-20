"use client";

import { useState, useEffect, useMemo } from "react";
import { CopyIcon, InfoIcon, Truck, MoreHorizontal, Loader2, IndianRupee, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

import { 
  getAllOrdersAdmin, 
  updateOrderStatus, 
  updateOrderTracking, 
  getRazorpayPaymentDetails,
  deleteOrder
} from "@/app/actions/adminActions";

// Strict Types
interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface IAdminOrder {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: IOrderItem[];
  totalAmount: number;
  status: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  shippingAddress?: string;
  trackingId?: string;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<IAdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getAllOrdersAdmin();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter and Sort Logic using useMemo for performance
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // 1. Apply Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o._id.toLowerCase().includes(q) || 
        o.user?.name?.toLowerCase().includes(q) || 
        o.user?.email?.toLowerCase().includes(q) ||
        o.trackingId?.toLowerCase().includes(q)
      );
    }

    // 2. Apply Filters
    if (statusFilter !== "All") {
      result = result.filter(o => o.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // 3. Apply Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortBy === "Newest") return dateB - dateA;
      if (sortBy === "Oldest") return dateA - dateB;
      if (sortBy === "Highest Amount") return b.totalAmount - a.totalAmount;
      if (sortBy === "Lowest Amount") return a.totalAmount - b.totalAmount;
      return 0;
    });

    return result;
  }, [orders, searchQuery, statusFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "paid": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "shipped": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "delivered": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "cancelled": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Manage your customer orders, AWBs, and monitor Razorpay events.</p>
        </div>
        <Button variant="outline" onClick={fetchOrders} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Refresh List"}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle>Transactions</CardTitle>
          
          {/* Robust Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Input 
              placeholder="Search ID, Name, Email..." 
              className="w-full md:w-60 h-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Newest">Newest First</SelectItem>
                <SelectItem value="Oldest">Oldest First</SelectItem>
                <SelectItem value="Highest Amount">Highest Amount</SelectItem>
                <SelectItem value="Lowest Amount">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center p-10">
               <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
             </div>
          ) : filteredAndSortedOrders.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">
                No orders match your filter criteria.
             </div>
          ) : (
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
                 {filteredAndSortedOrders.map((order) => (
                   <TableRow key={order._id}>
                     <TableCell className="font-medium font-mono text-xs">...{order._id.slice(-6)}</TableCell>
                     <TableCell>
                       <div className="flex flex-col">
                         <span className="font-medium truncate max-w-[150px]">{order.user?.name || "Guest"}</span>
                         <span className="text-xs text-muted-foreground truncate max-w-[150px]">{order.user?.email || "No Email"}</span>
                       </div>
                     </TableCell>
                     <TableCell className="text-xs whitespace-nowrap">
                       {new Date(order.createdAt).toLocaleDateString()}
                     </TableCell>
                     <TableCell>
                       <Badge variant="secondary" className={`capitalize ${getStatusColor(order.status)}`}>
                         {order.status}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       {order.trackingId ? (
                         <div className="flex items-center gap-2 text-sm">
                           <Truck className="h-4 w-4 text-muted-foreground" />
                           <span className="font-mono text-xs">{order.trackingId}</span>
                         </div>
                       ) : (
                         <span className="text-xs text-muted-foreground italic">Not Assigned</span>
                       )}
                     </TableCell>
                     <TableCell className="text-right font-medium">₹{order.totalAmount.toLocaleString("en-IN")}</TableCell>
                     <TableCell className="text-right">
                       <OrderActionMenu order={order} refreshData={fetchOrders} />
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

// Strictly Typed Action Menu Component
function OrderActionMenu({ order, refreshData }: { order: IAdminOrder, refreshData: () => void }) {
  const [awbOpen, setAwbOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false); // Add Delete Modal State
  
  const [awb, setAwb] = useState(order.trackingId || "");
  const [status, setStatus] = useState(order.status);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [razorpayDetails, setRazorpayDetails] = useState<{contact?: string, method?: string} | null>(null);

  const handleUpdateStatus = async () => {
    setIsProcessing(true);
    const res = await updateOrderStatus(order._id, status);
    if (res.success) {
      toast.success("Order status updated.");
      refreshData();
      setStatusOpen(false);
    } else {
      toast.error(res.error || "Update failed.");
    }
    setIsProcessing(false);
  };

  const handleUpdateAWB = async () => {
    setIsProcessing(true);
    const res = await updateOrderTracking(order._id, awb);
    if (res.success) {
      toast.success("Tracking attached & marked as Shipped!");
      refreshData();
      setAwbOpen(false);
    } else {
      toast.error(res.error || "AWB Update failed.");
    }
    setIsProcessing(false);
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    const res = await deleteOrder(order._id);
    if(res.success) {
      toast.success("Order permanently deleted.");
      refreshData();
      setDeleteOpen(false);
    } else {
      toast.error(res.error || "Deletion failed.");
    }
    setIsProcessing(false);
  }

  const fetchRazorpayGatewayData = async () => {
     if (order.razorpayPaymentId && !razorpayDetails) {
       const res = await getRazorpayPaymentDetails(order.razorpayPaymentId);
       if (res.success && res.payment) {
         setRazorpayDetails({ contact: res.payment.contact, method: res.payment.method });
       }
     }
  }

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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order._id)}>
            <CopyIcon className="mr-2 h-4 w-4" /> Copy Order ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
              setDetailsOpen(true);
              fetchRazorpayGatewayData();
          }}>
            <InfoIcon className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAwbOpen(true)}>
            <Truck className="mr-2 h-4 w-4" /> Assign AWB
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusOpen(true)}>
            <Badge className="mr-2 h-4 w-4 bg-muted text-muted-foreground hover:bg-muted" /> Update Status
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-red-600 focus:text-red-600">
            <Trash2 className="mr-2 h-4 w-4" /> Delete Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center"><Trash2 className="w-5 h-5 mr-2"/> Delete Order</DialogTitle>
            <DialogDescription>
              Are you absolute sure you want to permanently delete Order ...{order._id.slice(-6)}? This action cannot be undone and deletes financial records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isProcessing}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isProcessing}>
               {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : null} 
               Permanent Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 1: Update AWB */}
      <Dialog open={awbOpen} onOpenChange={setAwbOpen}>
         {/* ... (Keep existing awb content, replace `isUpdating` with `isProcessing`) ... */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Tracking AWB</DialogTitle>
            <DialogDescription>
              Deploying an AWB will automatically transition this order's status to shipped.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="awb">Tracking ID</Label>
              <Input 
                 id="awb" 
                 value={awb} 
                 onChange={(e) => setAwb(e.target.value)} 
                 placeholder="e.g. DEL-123456789" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAwbOpen(false)} disabled={isProcessing}>Cancel</Button>
            <Button onClick={handleUpdateAWB} disabled={isProcessing || !awb}>
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : null} 
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Update Status */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Operational Status</DialogTitle>
            <DialogDescription>
              Hard-adjust the internal status for order ...{order._id.slice(-6)}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-3">
              <Label>Current Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusOpen(false)} disabled={isProcessing}>Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={isProcessing}>
               {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : null} 
               Commit State
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Deep Order Details with Razorpay Payload */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center mr-6">
               <span>Order Details</span>
               <Badge variant="outline" className="font-mono text-xs">{order._id}</Badge>
            </DialogTitle>
            <DialogDescription>Placed on {new Date(order.createdAt).toLocaleString()}</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
             {/* Customer Data Sector */}
             <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm border-b pb-4">
                <div>
                  <span className="text-muted-foreground block text-xs uppercase mb-1">Customer Account</span>
                  <p className="font-medium">{order.user?.name || "Guest"}</p>
                  <p className="text-muted-foreground">{order.user?.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase mb-1">Phone / Contact</span>
                  <p className="font-medium">
                     {order.user?.phone || razorpayDetails?.contact || "N/A"}
                  </p>
                </div>
                <div className="col-span-2 mt-2">
                   <span className="text-muted-foreground block text-xs uppercase mb-1">Shipping Address String</span>
                   <p className="font-medium p-2 bg-muted/30 rounded-md border text-sm text-foreground/80 leading-relaxed">
                     {order.shippingAddress || "No address captured."}
                   </p>
                </div>
             </div>

             {/* Gateway Verification Sector */}
             <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4">
                <div>
                  <span className="text-muted-foreground block text-xs uppercase mb-1">Payment Database ID</span>
                  <p className="font-mono text-xs max-w-[200px] truncate" title={order.razorpayPaymentId}>{order.razorpayPaymentId || "None"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase mb-1">Real-time Gateway Method</span>
                  {razorpayDetails ? (
                     <Badge className="bg-green-100 text-green-800 hover:bg-green-100 capitalize">
                        {razorpayDetails.method || "Verified"}
                     </Badge>
                  ) : <span className="text-xs text-muted-foreground flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" />
                        Awaiting RP fetch...
                      </span>}
                </div>
             </div>
             
             {/* Item Parsing Sector */}
             <div>
               <h4 className="font-semibold text-sm mb-3">Itemized Cart ({order.items.length})</h4>
               {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 text-sm border-b last:border-0 border-dashed">
                    <div className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt="pic" className="w-10 h-10 object-cover rounded-md bg-muted"/>}
                      <div>
                        <p className="font-medium line-clamp-1 max-w-[250px]">{item.name}</p>
                        <p className="text-muted-foreground text-xs font-mono mt-0.5">Product ID: ...{item.productId.slice(-6)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-muted-foreground font-semibold">Qty: {item.quantity}</p>
                       <p className="font-medium mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
               ))}
               
               <div className="flex justify-between items-center py-3 border-t mt-4 bg-muted/10 px-3 rounded-xl border">
                 <p className="font-semibold flex items-center"><IndianRupee className="w-4 h-4 mr-1"/> Grand Total Deposited</p>
                 <p className="font-bold text-lg text-primary">₹{order.totalAmount.toLocaleString("en-IN")}</p>
               </div>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}