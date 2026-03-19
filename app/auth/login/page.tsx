"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function UserLoginPage() {
  const router = useRouter();
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const handleSendOtp = () => {
    if (phone.length === 10) {
      setOtpSent(true);
      alert("Test OTP is 123456");
    } else {
      alert("Enter a valid 10 digit phone number.");
    }
  };

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserLoading(true);

    const res = await signIn("user-otp-login", {
      phone,
      otp,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/checkout"); 
    } else {
      alert("Invalid OTP");
    }
    setUserLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Package className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Softzy</CardTitle>
          <CardDescription>Sign in to your customer account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUserLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <span className="flex items-center justify-center bg-muted px-3 border rounded-md text-sm text-muted-foreground">+91</span>
                <Input 
                  id="phone" 
                  placeholder="9876543210" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  disabled={otpSent} 
                  required 
                />
              </div>
            </div>
            
            {otpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input 
                  id="otp" 
                  type="text" 
                  placeholder="123456" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  required 
                  maxLength={6}
                />
              </div>
            )}
            
            {!otpSent ? (
              <Button type="button" className="w-full" onClick={handleSendOtp}>
                Send OTP
              </Button>
            ) : (
              <Button type="submit" className="w-full" disabled={userLoading}>
                {userLoading ? "Logging in..." : "Verify & Login"}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}