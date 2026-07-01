import { useNavigate } from "react-router-dom";

function ShippingReturns() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Content */}
      <div className="flex-1 mx-auto max-w-5xl px-6 py-8 w-full">
        <div className="space-y-5">
          {/* Title with Back Button */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Shipping & Returns</h1>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
            </button>
          </div>

          <div className="space-y-5 text-gray-700">
            {/* Shipping Section */}
            <div className="space-y-2">
              <h3 className="text-[15px] font-semibold text-gray-900">Shipping</h3>
              <p className="text-sm leading-6">
                All orders are processed within 1–2 business days after payment confirmation.
                We offer Standard domestic delivery in 5–10 business days, Express domestic
                delivery in 2–4 business days, and International shipping in 10–20 business
                days depending on destination.
              </p>
            </div>

            {/* Return Policy */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <h3 className="text-[15px] font-semibold text-gray-900">Return Policy</h3>
              <p className="text-sm leading-6">
                We accept returns within <strong>1 week</strong> of the delivery date on items
                that are unused and in their original condition with all packaging intact.
                To initiate a return, please contact us via email with your order number
                and a brief reason for the return.
              </p>
            </div>

            {/* Refunds */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <h3 className="text-[15px] font-semibold text-gray-900">Refunds</h3>
              <p className="text-sm leading-6">
                Once we receive and inspect the returned item, your refund will be processed
                to the original payment method within 5–7 business days. If your order was
                placed using Cash on Delivery, our team will contact you to arrange the
                refund through your preferred method.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <h3 className="text-[15px] font-semibold text-gray-900">Questions?</h3>
              <p className="text-sm leading-6">
                If you have any questions about your shipment, a return, or a refund, our
                support team is ready to help. Reach out to us via email or phone and
                we'll get back to you as soon as possible.
              </p>
              <p className="text-sm leading-6">
                Email:{" "}
                <a href="mailto:info@woodenhive.com" className="text-blue-600 hover:text-blue-700 underline">
                  info@woodenhive.com
                </a>
                {" "}· Phone:{" "}
                <a href="tel:+923110719503" className="text-blue-600 hover:text-blue-700 underline">
                  +92 311 071 9503
                </a>
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

export default ShippingReturns;
