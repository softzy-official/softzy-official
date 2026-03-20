"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCheckoutOrder, verifyPaymentAndCompleteOrder } from "@/app/actions/checkoutActions";
import Script from "next/script";
import { useCart, CartItem } from "@/hooks/use-cart";

// 1. Strict TypeScript Definitions to avoid 'any'
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: string | number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  theme: { color: string };
}

interface RazorpayError {
  error: { description: string };
}

interface RazorpayInstance {
  on: (event: string, callback: (response: RazorpayError) => void) => void;
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function CheckoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { items, clearCart } = useCart();

  const subTotal = items.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
  const shippingFee = subTotal > 0 && subTotal < 1400 ? 149 : 0;
  const grandTotal = subTotal + shippingFee;

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating secure order...");

    try {
      const res = await createCheckoutOrder(items);

      if (!res.success || !res.orderId) {
        toast.error(res.error || "Order creation failed", { id: toastId });
        setLoading(false);
        return;
      }

      toast.success("Order mapped securely! Redirecting to payment...", { id: toastId });

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.amount as number,
        currency: res.currency as string,
        name: "Softzy",
        description: "Secure Checkout",
        order_id: res.orderId,
        handler: async function (response: RazorpayResponse) {
          toast.loading("Verifying payment...", { id: "verify" });

          const verifyRes = await verifyPaymentAndCompleteOrder(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            res.dbOrderId as string
          );

          if (verifyRes.success) {
            toast.success("Payment Successful! Order Confirmed 🎉", { id: "verify" });
            clearCart();
            router.push("/profile");
          } else {
            toast.error(verifyRes.error || "Payment verification failed", { id: "verify" });
          }
        },
        theme: { color: "#000000" },
      };

      const razorpayWindow = new window.Razorpay(options);

      razorpayWindow.on("payment.failed", function (response: RazorpayError) {
        toast.error(response.error.description);
      });

      razorpayWindow.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong handling the checkout.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="flex justify-between font-semibold">
        <span>Subtotal:</span>
        <span>₹{subTotal}</span>
      </div>
      <div className="flex justify-between text-muted-foreground text-sm">
        <span>Shipping:</span>
        <span>{shippingFee === 0 ? "Free" : `₹${shippingFee}`}</span>
      </div>
      <div className="flex justify-between font-bold text-lg border-t pt-4 mt-2">
        <span>Total:</span>
        <span>₹{grandTotal}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="w-full bg-black text-white p-3 rounded-lg hover:bg-neutral-800 disabled:opacity-50 mt-4 transition-all"
      >
        {loading ? "Processing..." : `Checkout securely (₹${grandTotal})`}
      </button>
    </div>
  );
}