import { getOrderById } from "@/app/actions/orderActions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Truck, Package, Clock } from "lucide-react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default async function OrderTrackingPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const order = await getOrderById(resolvedParams.id);


  if (!order) return notFound();

  // Simple statuses visualization
  const getStatusProgress = (status: string) => {
    if (status === "pending") return 1;
    if (status === "paid") return 2;
    if (status === "shipped") return 3;
    if (status === "delivered") return 4;
    return 1;
  };

  const progress = getStatusProgress(order.status);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <Link href="/profile" className="text-sm text-primary hover:underline mb-6 inline-block">
        &larr; Back to Profile
      </Link>
      
      <div className="flex justify-between items-end mb-8 border-b pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif mb-2">Order Tracking</h1>
          <p className="text-muted-foreground text-sm">
            Order ID: <span className="font-mono text-foreground font-medium">{order._id}</span>
          </p>
          <p className="text-muted-foreground text-sm">
            Placed on: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-xl font-bold text-primary">₹{order.totalAmount}</p>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-card border rounded-xl p-6 md:p-10 mb-8 shadow-sm">
        <div className="relative flex justify-between items-center w-full">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full"></div>
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 rounded-full transition-all duration-500`} style={{ width: `${((progress - 1) / 3) * 100}%` }}></div>

          {/* Setup dots */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${progress >= 1 ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
               <Clock className="w-5 h-5"/>
            </div>
            <p className="text-xs font-semibold text-center mt-2 hidden sm:block">Pending</p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${progress >= 2 ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
               <CheckCircle2 className="w-5 h-5"/>
            </div>
            <p className="text-xs font-semibold text-center mt-2 hidden sm:block">Confirmed</p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${progress >= 3 ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
               <Truck className="w-5 h-5"/>
            </div>
            <p className="text-xs font-semibold text-center mt-2 hidden sm:block">Shipped</p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${progress >= 4 ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
               <Package className="w-5 h-5"/>
            </div>
            <p className="text-xs font-semibold text-center mt-2 hidden sm:block">Delivered</p>
          </div>
        </div>

        {/* Courier Details */}
        {order.trackingId && (
          <div className="mt-12 p-4 bg-muted/20 border border-primary/20 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Courier Partner</p>
              <p className="font-semibold text-foreground">{order.courierName || "Standard Shipping"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Tracking Number</p>
              <p className="font-mono font-bold text-primary">{order.trackingId}</p>
            </div>
          </div>
        )}
      </div>

      {/* Items Section */}
      <h2 className="text-xl font-bold font-serif mb-4">Items Ordered</h2>
      <div className="space-y-4">
        {order.items.map((item: OrderItem, i: number) => (
          <div key={i} className="flex gap-4 border rounded-lg p-4 bg-card/50">
            <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col justify-center w-full">
              <div className="flex justify-between items-start">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="font-bold">₹{item.price}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}