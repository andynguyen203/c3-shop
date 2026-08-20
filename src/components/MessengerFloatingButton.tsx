import Link from "next/link";
import { MessengerIcon } from "@/components/icons";

export default function MessengerFloatingButton() {
  return (
    <aside
      aria-label="Hỗ trợ trực tuyến"
      className="fixed bottom-6 right-6 z-50 flex items-center group"
    >
      <span className="hidden sm:inline-block pointer-events-none mr-2.5 rounded-full bg-zinc-900/90 dark:bg-white/90 px-3 py-1.5 text-xs font-semibold text-white dark:text-zinc-900 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
        Chat qua Messenger
      </span>

      <Link
        href="https://www.messenger.com/t/108292607259915"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat với shop qua Facebook Messenger"
        title="Chat với shop qua Messenger"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#0066FF] via-[#0084FF] to-[#00B2FE] text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-blue-500 opacity-20" />
        <MessengerIcon className="h-7 w-7 text-white drop-shadow-xs" />
      </Link>
    </aside>
  );
}
