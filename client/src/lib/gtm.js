// ─── Initialise dataLayer ────────────────────────────────────────────────────
if (typeof window !== "undefined") {
  window.dataLayer = window.dataLayer || [];
}

// ─── Low-level push ──────────────────────────────────────────────────────────

/**
 * Push any GTM event object to window.dataLayer.
 * Clears the previous ecommerce object first to avoid data bleed between events
 * (GTM best practice).
 *
 * @param {Object} eventObj - Full GTM event object to push
 */
export function pushEvent(eventObj) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // Clear previous ecommerce before pushing a new one
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push(eventObj);
}

// ─── Item mapper ─────────────────────────────────────────────────────────────

/**
 * Map a cart/order item to the GTM items array entry.
 * Works with both cart items (from Redux shopCart) and order cartItems.
 *
 * @param {Object} item
 * @param {number} [index]
 * @returns {Object}
 */
function mapItem(item, index = 0) {
  const price =
    item?.salePrice > 0
      ? item.salePrice
      : item?.price ?? 0;

  return {
    item_id: item?.productId || item?._id || "",
    item_name: item?.title || item?.name || "",
    price: Number(price),
    quantity: Number(item?.quantity ?? 1),
    index,
    ...(item?.category ? { item_category: item.category } : {}),
    ...(item?.image ? { item_variant: item.image } : {}),
  };
}

// ─── Event builders ──────────────────────────────────────────────────────────

/**
 * GTM AddToCart event.
 *
 * Called after a successful addToCart dispatch (in home, listing, search, product-details).
 *
 * @param {Object} params
 * @param {Object}  params.product  - Product object from productList / productDetails
 * @param {number}  params.quantity - Quantity added (usually 1)
 * @param {string} [params.source]  - Page the add came from ("home"|"listing"|"search"|"product_detail")
 *
 * Example payload:
 * {
 *   event: "AddToCart",
 *   ecommerce: {
 *     AddToCart: {
 *       actionField: { source: "listing" },
 *       currency: "PKR",
 *       value: 3500,
 *       items: [{ item_id: "abc123", item_name: "Wood Vase", price: 3500, quantity: 1, index: 0 }]
 *     }
 *   }
 * }
 */
export function gtmAddToCart({ product, quantity = 1, source }) {
  const price =
    product?.salePrice > 0
      ? product.salePrice
      : product?.price ?? 0;

  const item = {
    item_id: product?._id || product?.productId || "",
    item_name: product?.title || product?.name || "",
    price: Number(price),
    quantity: Number(quantity),
    index: 0,
    ...(product?.category ? { item_category: product.category } : {}),
  };

  const actionField = {
    ...(source ? { source } : {}),
    ...(typeof window !== "undefined"
      ? { page: window.location.pathname }
      : {}),
  };

  pushEvent({
    event: "AddToCart",
    ecommerce: {
      AddToCart: {
        ...(Object.keys(actionField).length ? { actionField } : {}),
        currency: "PKR",
        value: Number(price) * Number(quantity),
        items: [item],
      },
    },
  });
}

/**
 * GTM view_item event.
 *
 * Called when a product detail page fully loads (productDetails available).
 *
 * @param {Object} params
 * @param {Object} params.product - productDetails from Redux shopProducts
 *
 * Example payload:
 * {
 *   event: "view_item",
 *   ecommerce: {
 *     view_item: {
 *       actionField: { page: "/shop/product/abc123" },
 *       currency: "PKR",
 *       value: 4500,
 *       items: [{ item_id: "abc123", item_name: "Wooden Clock", price: 4500, quantity: 1, index: 0 }]
 *     }
 *   }
 * }
 */
export function gtmViewItem({ product }) {
  const price =
    product?.salePrice > 0
      ? product.salePrice
      : product?.price ?? 0;

  const item = {
    item_id: product?._id || "",
    item_name: product?.title || product?.name || "",
    price: Number(price),
    quantity: 1,
    index: 0,
    ...(product?.category ? { item_category: product.category } : {}),
  };

  const actionField = {
    ...(typeof window !== "undefined"
      ? { page: window.location.pathname }
      : {}),
  };

  pushEvent({
    event: "view_item",
    ecommerce: {
      view_item: {
        ...(Object.keys(actionField).length ? { actionField } : {}),
        currency: "PKR",
        value: Number(price),
        items: [item],
      },
    },
  });
}

/**
 * GTM InitiateCheckout event.
 *
 * Called when the user arrives on the checkout page with cart items present.
 *
 * @param {Object} params
 * @param {Array}  params.cartItems   - cartItems.items array from Redux shopCart
 * @param {number} params.totalAmount - totalCartAmount (subtotal, before shipping)
 * @param {number} params.shippingCost
 *
 * Example payload:
 * {
 *   event: "InitiateCheckout",
 *   ecommerce: {
 *     InitiateCheckout: {
 *       actionField: { value: 7000, shipping: 200, page: "/shop/checkout" },
 *       currency: "PKR",
 *       value: 7000,
 *       items: [ ... ]
 *     }
 *   }
 * }
 */
export function gtmInitiateCheckout({ cartItems, totalAmount, shippingCost }) {
  const items = (cartItems || []).map(mapItem);

  const actionField = {
    value: Number(totalAmount),
    shipping: Number(shippingCost ?? 0),
    ...(typeof window !== "undefined"
      ? { page: window.location.pathname }
      : {}),
  };

  pushEvent({
    event: "InitiateCheckout",
    ecommerce: {
      InitiateCheckout: {
        actionField,
        currency: "PKR",
        value: Number(totalAmount),
        items,
      },
    },
  });
}

/**
 * GTM purchase event.
 *
 * Called inside the createNewOrder .then() block on success, using the
 * order data that was already built for the API call.
 *
 * @param {Object} params
 * @param {Object} params.orderData   - The orderData object sent to createNewOrder
 * @param {string} params.orderId     - Returned order _id from API response data._id
 * @param {number} params.shippingCost
 *
 * Example payload:
 * {
 *   event: "purchase",
 *   ecommerce: {
 *     purchase: {
 *       actionField: {
 *         id: "6a437...",
 *         revenue: 7200,
 *         value: 7200,
 *         shipping: 200,
 *         source: "checkout"
 *       },
 *       currency: "PKR",
 *       value: 7200,
 *       items: [ ... ]
 *     }
 *   }
 * }
 */
export function gtmPurchase({ orderData, orderId, shippingCost }) {
  const grandTotal =
    Number(orderData?.totalAmount ?? 0);

  const items = (orderData?.cartItems || []).map((item, idx) =>
    mapItem(item, idx)
  );

  const actionField = {
    id: orderId || "",
    revenue: grandTotal,
    value: grandTotal,
    shipping: Number(shippingCost ?? 0),
    source: "checkout",
  };

  pushEvent({
    event: "purchase",
    ecommerce: {
      purchase: {
        actionField,
        currency: "PKR",
        value: grandTotal,
        items,
      },
    },
  });
}
