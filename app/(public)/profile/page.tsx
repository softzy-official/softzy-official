"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Package, User as UserIcon, MapPin, Loader2 } from "lucide-react"; 
import { toast } from "sonner";
import { getUserOrders } from "@/app/actions/orderActions";
import { getUserProfile, updateProfile } from "@/app/actions/userActions";

interface Order {
  _id: string;
  createdAt: string;
  items: unknown[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | string;
}

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  // Profile State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
        setName(session.user.name || "");
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (session?.user?.id) {
      getUserOrders().then((data) => {
        setOrders(data);
        setLoadingOrders(false);
      });

      getUserProfile().then((data) => {
        if (data) {
          if (data.name) setName(data.name);
          if (data.phone) setPhone(data.phone);
          if (data.address) setAddress(data.address);
        }
      });
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center text-muted-foreground inter">
        <Loader2 className="w-6 h-6 animate-spin mb-2" />
        Loading profile...
      </div>
    );
  }
  if (!session?.user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^[6-9]\d{9}$/; 
    const pinRegex = /^[1-9][0-9]{5}$/;

    if (!phoneRegex.test(phone.trim())) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!pinRegex.test(address.zip.trim())) {
      toast.error("Please enter a valid 6-digit PIN code.");
      return;
    }

    if (!address.street.trim() || !address.city.trim() || !address.state.trim()) {
      toast.error("Please fill in all address fields.");
      return;
    }

    setIsSaving(true);
    const res = await updateProfile({ name, phone, address });
    
    if (res.success) {
      toast.success("Profile updated successfully!");
      updateSession(); 
    } else {
      toast.error(res.message || "Failed to update profile.");
    }
    
    setIsSaving(false);
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "paid": return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200";
      case "shipped": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200";
      case "delivered": return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-10 px-4 sm:px-6 lg:px-8 inter">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 items-start">
          
          {/* Profile Sidebar */}
          <Card className="h-fit">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4 border">
                <AvatarImage src={session.user.image || ""} alt={name || "User"} />
                <AvatarFallback className="text-2xl">{name?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{name || session.user.name}</h2>
              <p className="text-sm text-muted-foreground mb-6">{session.user.email}</p>
              
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => signOut()}>
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-card border shadow-sm">
              <TabsTrigger value="details" className="flex items-center gap-2"><UserIcon className="h-4 w-4"/> Details</TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Addresses</TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2"><Package className="h-4 w-4"/> Orders</TabsTrigger>
            </TabsList>

            {/* Account Details Tab */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>Manage your basic account information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input defaultValue={session.user.email || ""} disabled className="bg-muted" />
                      <p className="text-xs text-muted-foreground">Connected via Google SSO</p>
                    </div>
                    <Button type="submit" disabled={isSaving}>
                       {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Saving...</> : "Save Details"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Details</CardTitle>
                  <CardDescription>Update your mobile number and where you want your orders delivered.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-8">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-primary font-medium">Deliver to (Full Name) <span className="text-red-500">*</span></Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-primary font-medium">Mobile Number <span className="text-red-500">*</span></Label>
                        <Input 
                          placeholder="10-digit mobile number" 
                          value={phone} 
                          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="border-t pt-6 space-y-6">
                      <Label className="text-primary font-medium text-base">Shipping Address</Label>
                      <div className="space-y-2">
                        <Label>Street Address <span className="text-red-500">*</span></Label>
                        <Input placeholder="123 Main St, Apt 4B" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} required/>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label>City <span className="text-red-500">*</span></Label>
                          <Input placeholder="Mumbai" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required/>
                        </div>
                        <div className="space-y-2">
                          <Label>State <span className="text-red-500">*</span></Label>
                          <Input placeholder="Maharashtra" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} required/>
                        </div>
                        <div className="space-y-2">
                          <Label>PIN Code <span className="text-red-500">*</span></Label>
                          <Input 
                             placeholder="400001" 
                             value={address.zip} 
                             onChange={e => setAddress({...address, zip: e.target.value.replace(/\D/g, '').slice(0, 6)})} 
                             required 
                          />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" disabled={isSaving}>
                       {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Saving...</> : "Save Address"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your recent orders and their status.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <div className="py-10 flex flex-col items-center justify-center text-muted-foreground">
                       <Loader2 className="w-6 h-6 animate-spin mb-2" />
                       Loading orders...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/10">
                      <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <h3 className="text-lg font-medium text-foreground">No orders yet</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">When you buy something, it will appear here.</p>
                      <Button onClick={() => router.push('/shop')}>Start Shopping</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border rounded-lg p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-colors hover:bg-muted/10">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                               <p className="font-semibold text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                               <Badge className={`uppercase text-[10px] tracking-wider font-semibold ${getStatusColor(order.status)}`} variant="outline">
                                 {order.status}
                               </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                            <div className="text-sm font-medium">
                              Items: {order.items?.length || 0} &nbsp;|&nbsp; Total: ₹{order.totalAmount.toLocaleString("en-IN")}
                            </div>
                          </div>
                          
                          <div className="w-full md:w-auto">
                            <Button variant="outline" className="w-full md:w-auto" onClick={() => router.push(`/order/${order._id}`)}>
                              Track & Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}