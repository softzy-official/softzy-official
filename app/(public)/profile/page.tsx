"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, User, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Basic Address state (Will wire to DB in next step if desired)
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    // If unauthenticated, redirect strictly to user login
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") return <div className="min-h-screen pt-24 text-center">Loading profile...</div>;
  if (!session?.user) return null;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save, we will implement actual DB mutation next
    toast.success("Address updated successfully!");
  };

  return (
    <div className="min-h-screen bg-muted/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold font-playfair mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Profile Sidebar Quick Info */}
          <Card className="h-fit">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4 border-2">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                <AvatarFallback className="text-2xl">{session.user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{session.user.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{session.user.email}</p>
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" onClick={() => router.push('/api/auth/signout')}>
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-card border">
              <TabsTrigger value="details" className="flex items-center gap-2"><User className="h-4 w-4"/> Details</TabsTrigger>
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
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input defaultValue={session.user.name || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue={session.user.email || ""} disabled />
                    <p className="text-xs text-muted-foreground">Connected via Google SSO</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                  <CardDescription>Update where you want your orders delivered.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Street Address</Label>
                      <Input placeholder="123 Main St, Apt 4B" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} required/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input placeholder="Mumbai" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required/>
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input placeholder="Maharashtra" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} required/>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>PIN Code</Label>
                      <Input placeholder="400001" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} required/>
                    </div>
                    <Button type="submit">Save Address</Button>
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
                   <div className="text-center py-10 border-2 border-dashed rounded-lg bg-muted/10">
                     <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                     <h3 className="text-lg font-medium text-foreground">No orders yet</h3>
                     <p className="text-sm text-muted-foreground mt-1 mb-4">When you buy something, it will appear here.</p>
                     <Button onClick={() => router.push('/shop')}>Start Shopping</Button>
                   </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}