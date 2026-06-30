import { useNavigate } from "react-router-dom";

function WarrantyCare() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Content */}
      <div className="flex-1 mx-auto max-w-5xl px-6 py-8 w-full">
        <div className="space-y-4">
          {/* Title with Back Button */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Warranty & Care</h1>
            <button
              onClick={() => navigate(-1)}
              className="mt-1 text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              ← Back
            </button>
          </div>

          <div className="space-y-4 text-gray-700">
            {/* Warranty Coverage */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">Warranty Coverage</h3>
              <p className="text-sm leading-relaxed">
                All WoodenHive products come with a <strong>1-year warranty</strong> against manufacturing defects including structural failures and joint separation. Does not cover normal wear, accidents, or misuse.
              </p>
            </div>

            {/* Care Instructions */}
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <h3 className="text-base font-bold text-gray-900">Care Instructions</h3>
              
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-900">Daily Care</p>
                <p className="text-xs leading-relaxed">Dust with soft cloth. Wipe spills immediately. Avoid hot items directly on surfaces.</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-900">Weekly/Monthly</p>
                <p className="text-xs leading-relaxed">Clean with wood cleaner. Dry immediately. Apply oil/polish every 3–6 months.</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-900">Seasonal Care</p>
                <p className="text-xs leading-relaxed">Maintain humidity 35–55%. Avoid direct sunlight and heat vents. Use furniture pads.</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-900">Storage</p>
                <p className="text-xs leading-relaxed">Keep in dry, temperature-controlled areas. Cover with breathable cloth. Allow 24–48h acclimatization.</p>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <h3 className="text-base font-bold text-gray-900">Product-Specific Tips</h3>
              <ul className="space-y-1 text-xs leading-relaxed">
                <li><strong>Tables & Desks:</strong> Use placemats and coasters. No dragging heavy objects.</li>
                <li><strong>Chairs & Stools:</strong> Check screws regularly. Don't lean back. Clean cushions separately.</li>
                <li><strong>Cabinets & Shelving:</strong> Don't overload. Dust interiors monthly. Keep level.</li>
                <li><strong>Decorative Pieces:</strong> Avoid direct sunlight. Keep away from moisture.</li>
              </ul>
            </div>

            {/* Warranty Claims */}
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <h3 className="text-base font-bold text-gray-900">Warranty Claims</h3>
              <p className="text-xs leading-relaxed">
                Contact us within 30 days of discovering a defect with photos and order number.
              </p>
              <p className="text-xs leading-relaxed">
                Email:{" "}
                <a
                  href="mailto:info@woodenhive.com"
                  className="font-semibold text-blue-600 hover:text-blue-700 underline"
                >
                  info@woodenhive.com
                </a>
              </p>
              <p className="text-xs leading-relaxed">
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

export default WarrantyCare;
