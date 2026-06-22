import React from "react";

function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/923110719503?text=Hello%20WoodenHive"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transform-gpu transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="currentColor"
        >
          <path d="M20.52 3.48A11.95 11.95 0 0 0 12 0C5.373 0 .1 5.373.1 12c0 2.116.553 4.16 1.603 5.985L0 24l6.295-1.633A11.95 11.95 0 0 0 12 24c6.627 0 11.999-5.373 11.999-12 0-3.203-1.246-6.205-3.479-8.52zM12 21.6c-1.14 0-2.256-.298-3.234-.86l-.233-.135-3.743.97.998-3.648-.152-.261A8.4 8.4 0 1 1 20.4 12 8.379 8.379 0 0 1 12 21.6z" />
          <path d="M17.25 14.1c-.28-.14-1.66-.82-1.92-.92-.26-.1-.45-.14-.64.14-.19.28-.74.92-.91 1.11-.17.19-.33.21-.61.07-.28-.14-1.18-.43-2.24-1.38-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.19-.28.28-.47.09-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.5-.47-.43-.64-.44l-.55-.01c-.19 0-.5.07-.76.34-.26.27-1 1-1 2.44 0 1.44 1.03 2.84 1.17 3.04.14.19 2.02 3.08 4.9 4.32 2.06.86 2.72.93 3.3.78.58-.16 1.66-.68 1.9-1.33.24-.65.24-1.21.17-1.33-.07-.11-.26-.18-.54-.32z" fill="#fff" />
        </svg>
      </div>
    </a>
  );
}

export default WhatsAppFloat;
