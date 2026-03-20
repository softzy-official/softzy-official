"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IndianRupee, Package, Users, ShoppingCart, CheckCircle2, XCircle, Clock, Tags, TrendingUp, Activity } from "lucide-react";
import { getDashboardKPIs } from "@/app/actions/adminActions";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Define the shape of the data based on our new Server Action
type AdminData = {
  totalRevenue: number;
  successfulRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  totalProducts: number;
  categoriesCount: number;
  graphData: { name: string; income: number; orders: number }[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const response = await getDashboardKPIs();
      if (response.success) {
        setData(response.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight nunito text-primary">Dashboard Overview</h2>
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-2">
           <Skeleton className="h-[350px] w-full rounded-2xl" />
           <Skeleton className="h-[350px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-16 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight nunito text-primary mb-1">Dashboard Overview</h2>
          <p className="text-muted-foreground inter text-sm">Deep analytics and financial metrics for your store.</p>
        </div>
      </div>

      {/* Row 1: Primary Financials */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">Gross Lifetime Revenue</CardTitle>
            <div className="w-8 h-8 rounded-full bg-emerald-200/50 flex items-center justify-center">
              <IndianRupee className="h-4 w-4 text-emerald-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900 mb-1">₹{data.totalRevenue.toLocaleString("en-IN")}</div>
            <div className="flex items-center gap-1.5 mt-2">
               <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
               <p className="text-xs font-medium text-emerald-700/80">Total volume excluding cancelled orders</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/10 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-primary uppercase tracking-wide">Secured Income</CardTitle>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-1">₹{data.successfulRevenue.toLocaleString("en-IN")}</div>
            <p className="text-xs font-medium text-primary/70 mt-2">Income from shipped & delivered goods</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm transition-all hover:shadow-md border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Customer Base</CardTitle>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{data.totalCustomers.toLocaleString()}</div>
            <p className="text-xs font-medium text-muted-foreground mt-2">Registered User Accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Operational Volume */}
      <h3 className="text-lg font-semibold nunito text-foreground border-b pb-2 mt-2">Order Statistics</h3>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Orders" value={data.totalOrders} icon={ShoppingCart} color="default" />
        <MetricCard title="Shipped / Delivered" value={data.completedOrders} icon={CheckCircle2} color="green" />
        <MetricCard title="Pending Actions" value={data.pendingOrders} icon={Clock} color="amber" />
        <MetricCard title="Cancelled / Failed" value={data.cancelledOrders} icon={XCircle} color="red" />
      </div>

      {/* Row 3: Catalog Info */}
      <h3 className="text-lg font-semibold nunito text-foreground border-b pb-2 mt-2">Inventory Summary</h3>
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Live Products</CardTitle>
            <Package className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{data.totalProducts}</div></CardContent>
        </Card>
        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Active Categories</CardTitle>
            <Tags className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{data.categoriesCount}</div></CardContent>
        </Card>
      </div>

      {/* Row 4: Chart Section */}
      <h3 className="text-lg font-semibold nunito text-foreground border-b pb-2 mt-4">Visual Analytics</h3>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Revenue Graph */}
          <Card className="col-span-1 shadow-sm border-border/60">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Income Growth</CardTitle>
              <CardDescription>Financial performance measured by recent sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {data.graphData && data.graphData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.graphData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0"/>
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} tickMargin={10} />
                      <Tooltip 
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                         formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, 'Revenue']} 
                      />
                      <Area type="monotone" dataKey="income" stroke="#d946ef" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChartState text="No revenue data available yet." />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Volume Graph */}
          <Card className="col-span-1 shadow-sm border-border/60">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Order Volume</CardTitle>
              <CardDescription>Metrics based on frequency of distinct checkouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {data.graphData && data.graphData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0"/>
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} tickMargin={10} />
                      <Tooltip 
                        cursor={{fill: '#f1f5f9'}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="orders" name="Total Orders" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChartState text="No order volume data available yet." />
                )}
              </div>
            </CardContent>
          </Card>
      </div>

    </div>
  );
}

// Helper Card for operational volume
function MetricCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: 'default' | 'green' | 'amber' | 'red' }) {
  const getColors = () => {
    switch(color) {
      case 'green': return { text: "text-emerald-700", icon: "text-emerald-600", bg: "bg-emerald-50" };
      case 'amber': return { text: "text-amber-700", icon: "text-amber-600", bg: "bg-amber-50" };
      case 'red': return { text: "text-red-700", icon: "text-red-600", bg: "bg-red-50" };
      default: return { text: "text-foreground", icon: "text-slate-600", bg: "bg-slate-100" };
    }
  };
  
  const colors = getColors();

  return (
    <Card className="shadow-sm border-border/60 transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</CardTitle>
        <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${colors.icon}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colors.text}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

// Fallback empty state for Recharts
function EmptyChartState({ text } : { text: string }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/20">
      <Activity className="w-10 h-10 text-muted-foreground/30 mb-3" />
      <p className="text-sm font-medium text-muted-foreground">{text}</p>
    </div>
  )
}