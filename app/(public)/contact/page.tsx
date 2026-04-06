import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { RiWhatsappLine } from "@remixicon/react";

const ContactPage = () => {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-10 bg-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full poppins mb-4 uppercase tracking-[0.12em]">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground poppins mb-6 playfair">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground poppins leading-relaxed max-w-2xl mx-auto">
            Have a question or need help? We&apos;re here for you. Reach out and
            we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Contact Form */}
            <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 lg:p-10">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground inter mb-2">
                Send us a Message
              </h2>
              <p className="text-sm text-muted-foreground poppins mb-8">
                Fill out the form below and we&apos;ll respond within 24 hours.
              </p>

              <form className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground poppins mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground poppins focus:outline-none focus:border-secondary/50 transition-colors"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground poppins mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground poppins focus:outline-none focus:border-secondary/50 transition-colors"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground poppins mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="What is this about?"
                    className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground poppins focus:outline-none focus:border-secondary/50 transition-colors"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground poppins mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground poppins focus:outline-none focus:border-secondary/50 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button - Disabled */}
                <button
                  type="button"
                  className="w-full py-3.5 bg-secondary/50 text-white text-sm font-medium rounded-xl poppins cursor-not-allowed"
                >
                  Send Message
                </button>
                <p className="text-xs text-muted-foreground poppins text-center hidden">
                  Form submission is currently disabled.
                </p>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground inter mb-2">
                  Contact Information
                </h2>
                <p className="text-sm text-muted-foreground poppins">
                  Prefer to reach out directly? Here&apos;s how you can contact
                  us.
                </p>
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground poppins mb-1">
                        Email Us
                      </h3>
                      <p className="text-sm text-muted-foreground poppins">
                        officialsoftzy@gmail.com 
                      </p>
                      <p className="text-xs text-muted-foreground poppins mt-1">
                        We reply within 24 hours
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 border border-border rounded-2xl p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground poppins mb-1">
                        Call Us
                      </h3>
                      <p className="text-sm text-muted-foreground poppins">
                        +91 9992300775
                      </p>
                      <p className="text-xs text-muted-foreground poppins mt-1">
                        Available 24 hours
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 border border-border rounded-2xl p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground poppins mb-1">
                        Our Address
                      </h3>
                      <p className="text-sm text-muted-foreground poppins">
                        Hisar, Haryana
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white border border-border rounded-2xl p-5 sm:p-6">
                <h3 className="text-base font-semibold text-foreground poppins mb-4">
                  Follow Us
                </h3>
                <div className="flex items-center gap-3">
                  <Link
                    href="#"
                    className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground"
                  >
                    <Facebook className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground"
                  >
                    <Instagram className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground"
                  >
                    <RiWhatsappLine className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground"
                  >
                    <Twitter className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground"
                  >
                    <Linkedin className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-16 sm:py-20 bg-secondary/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground poppins mb-4">
            Looking for Quick Answers?
          </h2>
          <p className="text-muted-foreground poppins mb-8">
            Check out our FAQ section for answers to common questions.
          </p>
          <Link
            href="/faq"
            className="inline-flex px-8 py-3 bg-secondary text-white text-sm font-medium rounded-xl poppins"
          >
            View FAQs
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
