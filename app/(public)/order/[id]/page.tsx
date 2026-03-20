import { getOrderById } from "@/app/actions/orderActions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Truck, Package, Clock, ArrowLeft, Receipt, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 inter">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div>
          <Link href="/profile" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Track Order</h1>
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                Order ID: <span className="font-mono bg-white border px-2 py-0.5 rounded text-xs font-semibold text-slate-700">{order._id}</span>
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
            <div className="md:text-right bg-white p-4 border rounded-xl shadow-sm">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Total Deposited</p>
              <p className="text-2xl font-bold text-primary">₹{order.totalAmount.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline Component */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="">
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Live Tracking Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex justify-between items-center w-full px-2 sm:px-8">
              {/* Background Track Line */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-slate-100 rounded-full mx-6 sm:mx-14" />
              
              {/* Active Fill Line */}
              <div 
                 className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-primary rounded-full transition-all duration-700 ease-in-out mx-6 sm:mx-14" 
                 style={{ width: `calc(${((progress - 1) / 3) * 100}% - 3rem)` }} 
              />

              {/* Status Nodes */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${progress >= 1 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                   <Clock className="w-5 h-5"/>
                </div>
                <p className={`text-xs sm:text-sm font-semibold text-center ${progress >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Pending</p>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${progress >= 2 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                   <CheckCircle2 className="w-5 h-5"/>
                </div>
                <p className={`text-xs sm:text-sm font-semibold text-center ${progress >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Confirmed</p>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${progress >= 3 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                   <Truck className="w-5 h-5"/>
                </div>
                <p className={`text-xs sm:text-sm font-semibold text-center ${progress >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Shipped</p>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${progress >= 4 ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                   <Package className="w-5 h-5"/>
                </div>
                <p className={`text-xs sm:text-sm font-semibold text-center ${progress >= 4 ? 'text-green-600' : 'text-slate-400'}`}>Delivered</p>
              </div>
            </div>

            {/* Courier Details Inject */}
            {order.trackingId && (
              <div className="mt-12 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned Courier</p>
                  <p className="font-semibold text-slate-900">{order.courierName || "Standard Softzy Shipping"}</p>
                </div>
                <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
                <div className="sm:text-right">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tracking / AWB Number</p>
                  <div className="flex items-center sm:justify-end gap-2 text-primary font-mono font-bold text-lg">
                    {order.trackingId}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ordered Manifest Section */}
        <Card className="shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              Ordered Items 
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {order.items.map((item: OrderItem, i: number) => (
                <div key={i} className="flex gap-5 p-5 bg-white hover:bg-slate-50/50 transition-colors">
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                    <Image 
                      src={item.image || "/placeholder.png"} 
                      alt={item.name} 
                      fill 
                      className="object-contain" 
                    />
                  </div>
                  <div className="flex flex-col justify-center w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <p className="font-semibold text-slate-900 line-clamp-2 max-w-[400px]">
                        {item.name}
                      </p>
                      <p className="font-bold text-lg whitespace-nowrap">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                       <Badge variant="secondary" className="font-medium bg-slate-100 text-slate-700">
                         Qty: {item.quantity}
                       </Badge>
                       <span className="text-sm text-muted-foreground font-medium">
                         Subtotal: ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}