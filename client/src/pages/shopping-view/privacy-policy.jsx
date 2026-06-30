import { useNavigate } from "react-router-dom";

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Content */}
      <div className="flex-1 mx-auto max-w-5xl px-6 py-8 w-full">
        <div className="space-y-4">
          {/* Title with Back Button */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <button
              onClick={() => navigate(-1)}
              className="mt-1 text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              ← Back
            </button>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-sm leading-relaxed">
              WoodenHive respects your privacy and is committed to protecting your personal data. This policy describes how we collect and use your information when you visit our website or make a purchase.
            </p>

            {/* Information We Collect */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">Information We Collect</h3>
              <ul className="space-y-1 text-sm">
                <li className="flex gap-3">
                  <span className="min-w-fit">•</span>
                  <span>Contact details (name, email, phone) when you create an account or place an order.</span>
                </li>
                <li className="flex gap-3">
                  <span className="min-w-fit">•</span>
                  <span>Order history and billing/shipping addresses to process and deliver orders.</span>
                </li>
                <li className="flex gap-3">
                  <span className="min-w-fit">•</span>
                  <span>Payment information is processed securely via our payment provider and is not stored on our servers.</span>
                </li>
              </ul>
            </div>

            {/* How We Use Your Data */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">How We Use Your Data</h3>
              <p className="text-sm leading-relaxed">
                We use your information to process orders, respond to inquiries, and improve our products and service. With your consent we may send promotional emails; you can unsubscribe at any time.
              </p>
            </div>

            {/* Security & Sharing */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">Security & Sharing</h3>
              <p className="text-sm leading-relaxed">
                We follow industry standards to keep your data secure. We never sell your personal information. We may share necessary data with trusted partners (shipping carriers, payment gateways) only for order fulfillment.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <h3 className="text-base font-bold text-gray-900">Contact Us</h3>
              <p className="text-sm leading-relaxed">
                For any questions about privacy or data removal, contact us at{" "}
                <a
                  href="mailto:info@woodenhive.com"
                  className="font-semibold text-blue-600 hover:text-blue-700 underline"
                >
                  info@woodenhive.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white py-3 px-6 text-center">
        <p className="text-xs text-gray-600">© {new Date().getFullYear()} WoodenHive. All rights reserved.</p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
