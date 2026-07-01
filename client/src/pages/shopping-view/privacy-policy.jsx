import { useNavigate } from "react-router-dom";

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Content */}
      <div className="flex-1 mx-auto max-w-5xl px-6 py-8 w-full">
        <div className="space-y-5">
          {/* Title with Back Button */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:text-gray-800"
            >

            </button>
          </div>

          <div className="space-y-5 text-gray-700">
            <p className="text-sm leading-6">
              WoodenHive respects your privacy and is committed to protecting your personal data.
              This policy describes how we collect and use your information when you visit our
              website or make a purchase.
            </p>

            {/* Information We Collect */}
            <div className="space-y-3">
              <h3 className="text-[15px] font-semibold text-gray-900">Information We Collect</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3 leading-6">
                  <span className="mt-0.5 min-w-fit">•</span>
                  <span>We collect your contact details such as name, email address, and phone
                  number when you create an account or place an order on our platform.</span>
                </li>
                <li className="flex gap-3 leading-6">
                  <span className="mt-0.5 min-w-fit">•</span>
                  <span>Your order history along with billing and shipping addresses are stored
                  to help us process, fulfill, and deliver your orders accurately.</span>
                </li>
                <li className="flex gap-3 leading-6">
                  <span className="mt-0.5 min-w-fit">•</span>
                  <span>Payment information is processed securely through our trusted payment
                  provider and is never stored on our servers in any form.</span>
                </li>
              </ul>
            </div>

            {/* How We Use Your Data */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <h3 className="text-[15px] font-semibold text-gray-900">How We Use Your Data</h3>
              <p className="text-sm leading-6">
                We use your information to process and fulfill orders, respond to customer
                inquiries, and continuously improve our products and services. With your explicit
                consent, we may occasionally send promotional emails — you can unsubscribe at
                any time using the link provided in each email.
              </p>
            </div>

            {/* Security & Sharing */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <h3 className="text-[15px] font-semibold text-gray-900">Security & Sharing</h3>
              <p className="text-sm leading-6">
                We adhere to industry-standard security practices to keep your personal data
                safe and protected at all times. We never sell your information to third parties.
                We may only share necessary data with trusted partners — such as shipping carriers
                and payment gateways — strictly for the purpose of completing your order.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <h3 className="text-[15px] font-semibold text-gray-900">Contact Us</h3>
              <p className="text-sm leading-6">
                If you have any questions about this privacy policy or wish to request removal
                of your personal data, please reach out to us at{" "}
                <a
                  href="mailto:info@woodenhive.com"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  info@woodenhive.com
                </a>
                . We are happy to assist.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 py-3 px-6 text-center">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} WoodenHive. All rights reserved.</p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
