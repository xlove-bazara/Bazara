import React, { useState } from 'react';
import { X, ShieldCheck, FileText, RefreshCw, Truck, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export default function PolicyModal({ isOpen, onClose, initialTab = 'terms' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  const tabs = [
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'refund', label: 'Refund Policy', icon: RefreshCw },
    { id: 'shipping', label: 'Digital Delivery', icon: Truck },
    { id: 'contact', label: 'Contact Us', icon: Mail }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-[#0e111d] border border-white/15 shadow-2xl flex flex-col overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#121626]">
          <div className="flex items-center space-x-2.5">
            <img src="/logo.png?v=2" alt="bazara.in Logo" className="w-7 h-7 rounded-lg object-contain shadow-sm" />
            <div>

              <h3 className="text-sm font-bold text-white">bazara.in Official Legal Policies</h3>
              <p className="text-[10px] text-slate-400">Compliant with Indian IT Act, Consumer Protection & Payment Gateway Norms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1 p-2 bg-[#0a0d16] border-b border-white/[0.06] overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300">
          
          {/* TAB 1: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-3.5">
              <h4 className="text-sm font-bold text-white">Terms and Conditions of Service</h4>
              <p className="text-[11px] text-slate-400">Last updated: September 2026</p>

              <div className="space-y-1">
                <strong className="text-white block">1. Agreement to Terms</strong>
                <p>
                  By visiting, browsing, or enrolling in any digital course on <strong>bazara.in</strong> ("Website", "Platform", "We", "Us"), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you must discontinue use of this platform immediately.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-white block">2. Nature of Services</strong>
                <p>
                  bazara.in is an online educational and skill-development platform offering structured video masterclasses, downloadable project files, templates, and mentorship for skills such as Website Development with AI and digital technologies.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-white block">3. User License & Intellectual Property</strong>
                <p>
                  Upon successful enrollment and payment, bazara.in grants you a personal, non-exclusive, non-transferable, revocable license to view, stream, and access the educational course materials for individual learning purposes. You may not broadcast, re-sell, distribute, or publicly share access credentials without express written authorization.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-white block">4. Account Responsibility & Fair Use</strong>
                <p>
                  Users must provide accurate, active contact information (email and mobile number) during checkout to facilitate instant course link delivery and verification. Sharing account access with multiple unauthorized users may result in license termination.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-white block">5. Governing Law & Jurisdiction</strong>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of India.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-3.5">
              <h4 className="text-sm font-bold text-white">Privacy & Data Protection Policy</h4>
              <p className="text-[11px] text-slate-400">Effective Date: September 2026</p>

              <div className="space-y-1">
                <strong className="text-white block">1. Information We Collect</strong>
                <p>
                  When you purchase a course or register on bazara.in, we collect necessary transactional information:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-300">
                  <li>Full Name</li>
                  <li>Email address (for receipt and course link delivery)</li>
                  <li>Phone / WhatsApp number (for instant SMS/WhatsApp delivery & support)</li>
                  <li>IP address and standard browser analytics</li>
                </ul>
              </div>

              <div className="space-y-1">
                <strong className="text-white block">2. How We Protect Your Payment Data</strong>
                <p>
                  We do NOT store or process your credit card, debit card, or net banking passwords on our servers. All financial transactions are securely processed through RBI-authorized payment gateways (such as Razorpay / Cashfree) with 256-bit SSL encryption.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-white block">3. Non-Disclosure & Zero Spam Policy</strong>
                <p>
                  We respect your privacy. We never sell, rent, or trade your personal data with third-party marketing companies. Your contact details are used strictly for delivering course access, transaction receipts, essential course updates, and student support.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-white block">4. Cookies and Session Storage</strong>
                <p>
                  We use cookies and browser storage strictly to remember your active session, course progress, and improve page loading performance.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: REFUND & CANCELLATION POLICY */}
          {activeTab === 'refund' && (
            <div className="space-y-3.5">
              <h4 className="text-sm font-bold text-white">Refund and Cancellation Policy</h4>
              <p className="text-[11px] text-slate-400">Standard Digital Education Policy</p>

              <div className="space-y-1">
                <strong className="text-white block">1. Digital Nature of Products</strong>
                <p>
                  bazara.in offers non-tangible, irrevocable digital video courses and downloadable educational assets. Access to course videos, source code, and resources is delivered immediately after successful payment completion.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-white block">2. Eligibility for Refund</strong>
                <p>
                  We want you to have a confident learning experience. You are eligible for a refund under the following circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-300">
                  <li><strong>Double Charge / Duplicate Payment:</strong> If your account was debited twice for the same transaction due to a network glitch, the excess amount will be refunded automatically within 3–5 business days.</li>
                  <li><strong>Technical Inaccessibility:</strong> If you are unable to access the course content due to a verified technical fault from our end that cannot be resolved within 48 hours by our support team.</li>
                </ul>
              </div>

              <div className="space-y-1">
                <strong className="text-white block">3. How to Request a Refund</strong>
                <p>
                  To initiate a refund request, please email us at <span className="text-emerald-400 font-semibold">supporthubindia@gmail.com</span> or message our WhatsApp support with your Order ID, registered email/phone number, and payment proof.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-white block">4. Refund Processing Timeline</strong>
                <p>
                  Approved refunds are processed to the original payment method (Bank Account, UPI, or Card) within 5 to 7 working days, in accordance with banking guidelines.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: DIGITAL DELIVERY / SHIPPING POLICY */}
          {activeTab === 'shipping' && (
            <div className="space-y-3.5">
              <h4 className="text-sm font-bold text-white">Shipping & Digital Delivery Policy</h4>
              <p className="text-[11px] text-slate-400">Applicable to all digital course enrollments</p>

              <div className="space-y-1">
                <strong className="text-white block">1. 100% Digital Delivery (No Physical Shipping)</strong>
                <p>
                  All offerings on <strong>bazara.in</strong> are online video masterclasses and digital learning resources. No physical parcel, book, DVD, or package will be shipped to your postal address.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-white block">2. Delivery Timeframe</strong>
                <p>
                  Course access is delivered <strong>instantly (typically within 1 to 5 minutes)</strong> upon successful confirmation of payment by the payment gateway.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-white block">3. Delivery Channels</strong>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-300">
                  <li><strong>On-Screen Access Dashboard:</strong> Immediately following payment, your browser redirects to the Access Dashboard with direct links to stream and download the course.</li>
                  <li><strong>Email Confirmation:</strong> A purchase confirmation receipt and permanent Google Drive master folder link are sent to your provided email address.</li>
                  <li><strong>WhatsApp Notification:</strong> An instant WhatsApp message containing your direct access credentials is dispatched to your registered mobile number.</li>
                </ul>
              </div>

              <div className="space-y-1">
                <strong className="text-white block">4. Non-Receipt of Digital Access</strong>
                <p>
                  In rare cases of email spam filters or incorrect phone numbers, if you do not receive access within 10 minutes, please contact our helpline via WhatsApp (+91 98373 71137) or email supporthubindia@gmail.com with your payment ID for immediate manual resolution.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT US */}
          {activeTab === 'contact' && (
            <div className="space-y-3.5">
              <h4 className="text-sm font-bold text-white">Contact & Operational Information</h4>
              <p className="text-[11px] text-slate-400">For student inquiries, technical support & grievances</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Mail className="w-4 h-4" />
                    <span className="font-bold text-white">Official Support Email</span>
                  </div>
                  <a href="mailto:supporthubindia@gmail.com" className="text-xs text-slate-300 hover:text-emerald-400 font-mono block">
                    supporthubindia@gmail.com
                  </a>
                  <p className="text-[10px] text-slate-500">Response time: Within 24 hours</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Phone className="w-4 h-4" />
                    <span className="font-bold text-white">Student Helpline & WhatsApp</span>
                  </div>
                  <a href="https://wa.me/919837371137" target="_blank" rel="noreferrer" className="text-xs text-slate-300 hover:text-emerald-400 font-mono block">
                    +91 98373 71137
                  </a>
                  <p className="text-[10px] text-slate-500">Available: Mon–Sat, 10 AM – 7 PM IST</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1 sm:col-span-2">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <MapPin className="w-4 h-4" />
                    <span className="font-bold text-white">Platform Operational Details</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Platform Name:</strong> bazara.in (Digital Education & Online Courses)
                  </p>
                  <p className="text-xs text-slate-300">
                    <strong>Lead Mentor / Representative:</strong> Viplav Kumar
                  </p>
                  <p className="text-xs text-slate-300">
                    <strong>Operating Country:</strong> India
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between bg-[#121626] text-[11px] text-slate-400">
          <span>bazara.in • All Rights Reserved</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
