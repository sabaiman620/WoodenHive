import { useNavigate } from "react-router-dom";

function WarrantyCare() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Content */}
      <div className="flex-1 mx-auto max-w-5xl px-6 py-8 w-full">
        <div className="space-y-6">
          {/* Title with Back Button */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Warranty & Care</h1>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
            </button>
          </div>

          <div className="space-y-6 text-gray-700">

            <div className="space-y-4 border-t border-gray-200 pt-5">
              <h3 className="text-lg font-bold text-gray-900">Care Instructions</h3>

              <div className="space-y-1">
                <p className="text-[15px] font-semibold text-gray-900">Daily Care</p>
                <p className="text-[15px] leading-7 text-gray-700">
                  Dust your wooden pieces regularly using a soft, dry cloth to prevent buildup of
                  dirt and grime. Wipe any spills immediately with a slightly damp cloth and avoid
                  placing hot items directly on surfaces — always use coasters or trivets to
                  protect the finish.
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[15px] font-semibold text-gray-900">Weekly / Monthly Maintenance</p>
                <p className="text-[15px] leading-7 text-gray-700">
                  Clean surfaces with a wood-specific cleaner or mild soap solution, then dry
                  thoroughly right away to prevent moisture absorption. Apply a quality wood oil
                  or polish every 3–6 months to restore the natural sheen and protect the finish
                  from drying out.
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[15px] font-semibold text-gray-900">Storage</p>
                <p className="text-[15px] leading-7 text-gray-700">
                  Store wooden items in a dry, temperature-controlled space — avoid damp
                  basements or hot attics. Cover with a breathable cloth to keep dust off, and
                  allow 24–48 hours of acclimatization when moving pieces between different
                  environments or temperatures.
                </p>
              </div>
            </div>

            {/* Product-Specific Tips */}
            <div className="space-y-4 border-t border-gray-200 pt-5">
              <h3 className="text-lg font-bold text-gray-900">Product-Specific Tips</h3>
              <ul className="space-y-4 text-[15px]">
                <li className="leading-7">
                  <span className="font-semibold text-gray-900">Vases & Flower Holders — </span>
                  Do not fill wooden vases directly with water. Always use a glass or plastic
                  insert to hold water for flowers. Wipe any moisture from the outer surface
                  immediately to prevent water stains, swelling, or finish damage.
                </li>
            
                <li className="leading-7">
                  <span className="font-semibold text-gray-900">Wall Art & Calligraphy Pieces — </span>
                  Mount on a dry, stable wall away from direct sunlight, moisture, or kitchen
                  steam that can cause warping or fading. Dust gently with a soft brush or dry
                  cloth. Avoid using liquid cleaners on carved or painted wall art surfaces.
                </li>
                <li className="leading-7">
                  <span className="font-semibold text-gray-900">Wooden Clocks — </span>
                  Keep clocks away from damp walls and areas with high humidity. Replace
                  batteries before they run out to avoid battery leakage damage. Clean the
                  clock face with a dry cloth only and avoid pressing hard on the hands or frame.
                </li>
                <li className="leading-7">
                  <span className="font-semibold text-gray-900">Trays & Serving Items — </span>
                  Wooden trays are designed for dry use only. Avoid placing wet items directly
                  on the surface for extended periods. Clean with a lightly damp cloth and dry
                  immediately. Apply food-safe wood oil periodically to maintain the finish.
                </li>
            
              </ul>
            </div>

            {/* Warranty Claims */}
            <div className="space-y-2 border-t border-gray-200 pt-5">
              <h3 className="text-lg font-bold text-gray-900">Warranty Claims</h3>
              <p className="text-[15px] leading-7">
                To file a warranty claim, contact us within 30 days of discovering the defect.
                Please include clear photos of the issue along with your order number so our
                team can assess and resolve your claim promptly.
              </p>
              <p className="text-[15px] leading-7">
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

      <div className="border-t border-gray-200 py-3 px-6 text-center">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} WoodenHive. All rights reserved.</p>
      </div>
    </div>
  );
}

export default WarrantyCare;
