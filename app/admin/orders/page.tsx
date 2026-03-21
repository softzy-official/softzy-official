"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CopyIcon,
  InfoIcon,
  Truck,
  MoreHorizontal,
  Loader2,
  IndianRupee,
  Trash2,
  PackageSearch,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
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
  deleteOrder,
} from "@/app/actions/adminActions";
import Image from "next/image";

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

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o._id.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q) ||
          o.trackingId?.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (o) => o.status.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

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
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "paid":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-violet-100 text-violet-800 border-violet-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight nunito text-primary mb-1">
            Orders Management
          </h2>
          <p className="text-muted-foreground inter text-sm">
            Manage customer orders, process AWBs, and monitor Razorpay events.
          </p>
        </div>
        <Button
          variant="default"
          onClick={fetchOrders}
          disabled={loading}
          className="rounded-xl shadow-sm hover:shadow-md transition-all px-6"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <PackageSearch className="w-4 h-4 mr-2" />
          )}
          {loading ? "Syncing..." : "Sync Directory"}
        </Button>
      </div>

      <Card className="shadow-sm border-border/60 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-muted/20 border-b border-border/40 pb-4">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search ID, Name, Tracking..."
                className="w-full bg-background border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-background">
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
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Newest">Newest First</SelectItem>
                <SelectItem value="Oldest">Oldest First</SelectItem>
                <SelectItem value="Highest Amount">Highest Value</SelectItem>
                <SelectItem value="Lowest Amount">Lowest Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary/50 mb-4" />
              <p className="text-sm text-muted-foreground font-medium animate-pulse">
                Syncing logistics and gateway data...
              </p>
            </div>
          ) : filteredAndSortedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <PackageSearch className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-base font-medium">No orders found.</p>
              <p className="text-sm opacity-70">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow className="hover:bg-muted/20">
                    <TableHead className="w-[70px] py-4 pl-6 font-semibold">
                      S.No
                    </TableHead>
                    <TableHead className="w-[110px] py-4 font-semibold">
                      Order ID
                    </TableHead>
                    <TableHead className="py-4 font-semibold">
                      Customer Details
                    </TableHead>
                    <TableHead className="py-4 font-semibold">Date</TableHead>
                    <TableHead className="py-4 font-semibold">Status</TableHead>
                    <TableHead className="py-4 font-semibold">
                      Tracking AWB
                    </TableHead>
                    <TableHead className="text-right py-4 font-semibold">
                      Total Deposited
                    </TableHead>
                    <TableHead className="text-right py-4 pr-6 font-semibold">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredAndSortedOrders.map((order, index) => (
                    <TableRow
                      key={order._id}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <TableCell className="pl-6 text-muted-foreground font-medium">
                        {(index + 1).toString().padStart(2, "0")}
                      </TableCell>

                      <TableCell className="font-medium font-mono text-xs">
                        <span className="bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                          {order._id}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col space-y-0.5">
                          <span className="font-semibold text-sm truncate max-w-[170px]">
                            {order.user?.name || "Guest Checkout"}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                            {order.user?.email || "No Email Associated"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm whitespace-nowrap text-muted-foreground font-medium">
                        {new Date(order.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize font-semibold tracking-wide text-[10px] px-2 py-0.5 border ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {order.trackingId ? (
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-xs font-semibold">
                              {order.trackingId}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground italic font-medium">
                            <AlertCircle className="w-3 h-3" /> Assign AWB
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex items-center font-bold text-[15px] text-primary">
                          <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                          {order.totalAmount.toLocaleString("en-IN")}
                        </div>
                      </TableCell>

                      <TableCell className="text-right pr-6">
                        <OrderActionMenu
                          order={order}
                          refreshData={fetchOrders}
                        />
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

function OrderActionMenu({
  order,
  refreshData,
}: {
  order: IAdminOrder;
  refreshData: () => void;
}) {
  const [awbOpen, setAwbOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [awb, setAwb] = useState(order.trackingId || "");
  const [status, setStatus] = useState(order.status);
  const [isProcessing, setIsProcessing] = useState(false);

  const [razorpayDetails, setRazorpayDetails] = useState<{
    contact?: string;
    method?: string;
  } | null>(null);

  const handleUpdateStatus = async () => {
    setIsProcessing(true);
    const res = await updateOrderStatus(order._id, status);
    if (res.success) {
      toast.success("Order operational status updated.");
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
      toast.success("Tracking bound & sequence marked as Shipped!");
      refreshData();
      setAwbOpen(false);
    } else {
      toast.error(res.error || "AWB upload failed.");
    }
    setIsProcessing(false);
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    const res = await deleteOrder(order._id);
    if (res.success) {
      toast.success("Order removed successfully.");
      refreshData();
      setDeleteOpen(false);
    } else {
      toast.error(res.error || "Delete failed.");
    }
    setIsProcessing(false);
  };

  const fetchRazorpayGatewayData = async () => {
    if (order.razorpayPaymentId && !razorpayDetails) {
      const res = await getRazorpayPaymentDetails(order.razorpayPaymentId);
      if (res.success && res.payment) {
        setRazorpayDetails({
          contact:
            res.payment.contact !== undefined && res.payment.contact !== null
              ? String(res.payment.contact)
              : undefined,
          method:
            typeof res.payment.method === "string"
              ? res.payment.method
              : undefined,
        });
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-muted rounded-lg transition-colors"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-52 rounded-xl shadow-lg border-border/50"
        >
          <DropdownMenuLabel className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
            Manage Order
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setDetailsOpen(true);
              fetchRazorpayGatewayData();
            }}
            className="cursor-pointer"
          >
            <InfoIcon className="mr-2 h-4 w-4" /> Core Details
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setAwbOpen(true)}
            className="cursor-pointer"
          >
            <Truck className="mr-2 h-4 w-4" /> Assign AWB
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setStatusOpen(true)}
            className="cursor-pointer"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" /> Update Status
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(order._id)}
            className="cursor-pointer"
          >
            <CopyIcon className="mr-2 h-4 w-4" /> Copy ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[430px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl font-bold">
              <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-3">
                <Trash2 className="w-5 h-5" />
              </div>
              Delete Order
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed">
              You are about to permanently delete order{" "}
              <span className="font-mono bg-muted px-1 py-0.5 rounded">
                {order._id}
              </span>
              . This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setDeleteOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={handleDelete}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AWB Modal */}
      <Dialog open={awbOpen} onOpenChange={setAwbOpen}>
        <DialogContent className="sm:max-w-[430px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                <Truck className="w-5 h-5 text-muted-foreground" />
              </div>
              Assign Shipping AWB
            </DialogTitle>
            <DialogDescription className="pt-2">
              Updating the AWB will mark this order as shipped.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="awb"
                className="text-xs font-semibold uppercase text-muted-foreground tracking-wider"
              >
                Tracking Identifier
              </Label>
              <Input
                id="awb"
                className="mt-1 h-11"
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                placeholder="e.g. BLUEDART-123456789"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setAwbOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAWB}
              className="rounded-xl"
              disabled={isProcessing || !awb}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save AWB
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Modal */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent className="sm:max-w-[430px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Update Order Status
            </DialogTitle>
            <DialogDescription>
              Change status for order {order._id}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Select Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-11 mt-1">
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

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setStatusOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              className="rounded-xl"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[760px] max-h-[85vh] overflow-y-auto rounded-2xl p-0">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold nunito text-primary">
                Order Manifest
              </DialogTitle>
              <DialogDescription className="mt-1">
                Generated{" "}
                {new Date(order.createdAt).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </DialogDescription>
            </div>
            <Badge
              variant="outline"
              className="font-mono text-xs shadow-sm bg-muted/50 border-border/50 py-1 px-3"
            >
              OID: {order._id}
            </Badge>
          </div>

          <div className="p-6 pt-2 grid gap-6 mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-muted/20 p-5 rounded-2xl border border-border/40">
              <div>
                <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  User Record
                </span>
                <p className="font-semibold text-base">
                  {order.user?.name || "Unregistered Guest"}
                </p>
                <p className="text-sm text-foreground/70 mt-0.5">
                  {order.user?.email}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  Contact
                </span>
                <p className="font-semibold text-base">
                  {order.user?.phone ||
                    razorpayDetails?.contact ||
                    "Awaiting Verification"}
                </p>
              </div>

              <div className="col-span-1 md:col-span-2 pt-2 border-t border-border/50 mt-1">
                <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-widest mb-2">
                  Shipping Address
                </span>
                <p className="font-medium p-3.5 bg-background rounded-xl border text-sm text-foreground/80 leading-relaxed capitalize">
                  {order.shippingAddress || "Shipping address not available."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-2xl border border-border/50 bg-background">
              <div>
                <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  Razorpay Payment ID
                </span>
                <p className="font-mono font-medium text-sm bg-muted p-2 rounded-lg inline-block">
                  {order.razorpayPaymentId || "None"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  Payment Method
                </span>
                {razorpayDetails ? (
                  <Badge className="capitalize px-3 py-1 mt-1">
                    {razorpayDetails.method || "Verified"}
                  </Badge>
                ) : (
                  <span className="text-xs font-semibold text-muted-foreground flex items-center mt-2.5">
                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    Fetching gateway details...
                  </span>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-base mb-4 flex items-center gap-2 nunito border-b pb-2">
                <span className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xs">
                  {order.items.length}
                </span>
                Procured Items
              </h4>

              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50"
                  >
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded-lg border border-border/50"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border border-border/50">
                          <PackageSearch className="w-5 h-5 text-muted-foreground/50" />
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-sm line-clamp-1 max-w-[200px] sm:max-w-[320px]">
                          {item.name}
                        </p>
                        <p className="text-muted-foreground text-[11px] font-mono mt-1">
                          PID: {item.productId.slice(-8)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-bold text-sm mt-1">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center p-5 mt-6 bg-primary/10 rounded-2xl border border-primary/20">
                <p className="font-bold text-primary text-sm uppercase tracking-wider">
                  Gross Total Settled
                </p>
                <p className="font-extrabold text-2xl text-primary">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
