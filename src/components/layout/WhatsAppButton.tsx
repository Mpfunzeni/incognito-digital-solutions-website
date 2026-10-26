import { site, whatsappUrl } from "@/content/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/** Floating "Chat on WhatsApp" button, bottom right on every page. */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp: ${site.contact.whatsappDisplay}`}
      data-track="whatsapp_floating"
      className="fixed right-4 bottom-4 z-[60] inline-flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-ink-900 shadow-[0_10px_30px_-8px_rgb(37_211_102/0.7)] transition-transform duration-200 hover:scale-105 hover:bg-[#3ee07c] focus-visible:outline-offset-4 sm:right-6 sm:bottom-6 sm:px-5 print:hidden"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <WhatsAppIcon className="size-7 sm:size-6" />
      <span className="hidden text-[0.95rem] font-semibold sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
