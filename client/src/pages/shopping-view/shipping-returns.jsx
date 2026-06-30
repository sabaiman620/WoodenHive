import { useNavigate } from "react-router-dom";

function ShippingReturns() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Content */}
      <div className="flex-1 mx-auto max-w-5xl px-6 py-8 w-full">
        <div className="space-y-4">
          {/* Title with Back Button */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Shipping & Returns</h1>
            <button
              onClick={() => navigate(-1)}
              className="mt-1 text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              ← Back
            </button>
          </div>

          <div className="space-y-4 text-gray-700">
            {/* Shipping Section */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">Shipping</h3>
              <p className="text-sm leading-relaxed">
                Orders are processed in 1–2 business days. Standard (5–10 days), Express (2–4 days), International (10–20 days).
              </p>
            </div>

            {/* Return Policy */}
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <h3 className="text-base font-bold text-gray-900">Return Policy</h3>
              <p className="text-sm leading-relaxed">
                We accept returns within <strong>1 week</strong> of delivery on items that are unworn and in original condition. Contact us via email to start a return.
              </p>
            </div>

            {/* Refunds */}
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <h3 className="text-base font-bold text-gray-900">Refunds</h3>
              <p className="text-sm leading-relaxed">
                Once received and inspected, refunds are processed to the original payment method within 5–7 business days. Cash on Delivery refunds issued via preferred method.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <h3 className="text-base font-bold text-gray-900">Questions?</h3>
              <p className="text-sm leading-relaxed">
                Email:{" "}
                <a
                  href="mailto:info@woodenhive.com"
                  className="font-semibold text-blue-600 hover:text-blue-700 underline"
                >
                  info@woodenhive.com
                </a>
              </p>
              <p className="text-sm leading-relaxed">
                Phone:{" "}
                <a href="tel:+923110719503" className="font-semibold text-blue-600 hover:text-blue-700 underline">
                  +92 311 071 9503
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

export default ShippingReturns;
