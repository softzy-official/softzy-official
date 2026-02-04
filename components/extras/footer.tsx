import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { RiWhatsappLine } from "@remixicon/react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    { name: "New Arrivals", href: "/shop?filter=new-arrivals" },
    { name: "Best Sellers", href: "/shop?filter=best-sellers" },
    { name: "Beauty Picks", href: "/shop?filter=beauty-picks" },
    { name: "Bag Essentials", href: "/shop?filter=bag-essentials" },
  ];

  const supportLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "#faqs" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { name: "Whatsapp", icon: RiWhatsappLine, href: "#" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { name: "Youtube", icon: Youtube, href: "https://youtube.com" },
  ];

  return (
    <footer className="w-full bg-secondary text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          
          <div className="col-span-2 lg:col-span-1 pb-6 sm:pb-0 border-b border-white/10 sm:border-b-0">
            <Link href="/" className="inline-block ">
              <Image
                src="/logo2.png"
                alt="Softzy"
                width={120}
                height={48}
                className="h-12 sm:h-14 lg:h-20 w-auto"
              />
            </Link>

            <p className="text-xs sm:text-sm text-white/70 poppins leading-relaxed mb-5 max-w-xs sm:max-w-sm">
              Your one-stop destination for trendy fashion, beautiful jewelry,
              and unique home decor. Made to feel good.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-2.5">
              <a
                href="mailto:hello@softzy.com"
                className="flex items-center gap-2 text-xs sm:text-sm text-white/70 hover:text-white transition-colors poppins"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                hello@softzy.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-xs sm:text-sm text-white/70 hover:text-white transition-colors poppins"
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                +91 XXXXXXXXXX
              </a>
              <p className="flex items-start gap-2 text-xs sm:text-sm text-white/70 poppins">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                Greater Noida, Uttar Pradesh, India
              </p>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Shop Links */}
              <div>
                <h4 className="text-xs sm:text-base  md:text-lg font-medium text-white playfair mb-3 sm:mb-4">
                  Shop
                </h4>
                <ul className="space-y-1.5 sm:space-y-2.5">
                  {shopLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-[11px] sm:text-sm text-white/70 hover:text-white transition-colors inter font-normal leading-relaxed"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h4 className="text-xs sm:text-base  md:text-lg font-medium text-white playfair mb-3 sm:mb-4">
                  Support
                </h4>
                <ul className="space-y-1.5 sm:space-y-2.5">
                  {supportLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-[11px] sm:text-sm text-white/70 hover:text-white transition-colors inter font-normal leading-relaxed"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <p className="text-[10px] sm:text-xs lg:text-sm text-white/60 poppins text-center sm:text-left">
              © {currentYear} Softzy. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <social.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </a>
              ))}
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;