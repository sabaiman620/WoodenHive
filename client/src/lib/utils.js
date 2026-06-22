import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Generate or return a persistent guest user id for non-logged-in users
export function getOrCreateGuestId() {
  if (typeof window === "undefined") return null;

  const storageKey = "guest_user_id";

  let guestId = window.localStorage.getItem(storageKey);

  if (guestId) {
    console.log("Using existing guest ID:", guestId);
    return guestId;
  }

  // Create a unique ID with timestamp and random chars for better uniqueness
  const timestamp = Date.now().toString(36);
  const chars = "abcdef0123456789";
  let randomPart = "";
  for (let i = 0; i < 16; i += 1) {
    randomPart += chars[Math.floor(Math.random() * chars.length)];
  }

  // Create 24-character ID: guest_ prefix + timestamp + random
  guestId = `guest_${timestamp}${randomPart}`.substring(0, 24);

  // Store in localStorage for persistence across sessions
  window.localStorage.setItem(storageKey, guestId);

  console.log("Created new guest ID:", guestId);
  return guestId;
}

// Store guest email for order tracking
export function setGuestEmail(email) {
  if (typeof window === "undefined" || !email) return;

  window.localStorage.setItem("guest_email", email.toLowerCase().trim());
}

// Get stored guest email
export function getGuestEmail() {
  if (typeof window === "undefined") return null;

  return window.localStorage.getItem("guest_email");
}

// Create a new guest session (useful for testing or when user wants to start fresh)
export function createNewGuestSession() {
  if (typeof window === "undefined") return null;

  // Clear existing guest data
  window.localStorage.removeItem("guest_user_id");
  window.localStorage.removeItem("guest_email");

  // Generate new guest ID
  return getOrCreateGuestId();
}

// Clear all guest data (useful when user logs in)
export function clearGuestData() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem("guest_user_id");
  window.localStorage.removeItem("guest_email");
}
