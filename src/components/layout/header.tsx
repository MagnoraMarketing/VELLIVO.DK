"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { Logo } from "@/components/layout/logo";
import { BagIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";
import { mainNav } from "@/config/site";

export function Header() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);

  // Luk mobilmenuen ved navigation og med Escape.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-sand/80 bg-cream/90 backdrop-blur supports-[backdrop-filter]:bg-cream/75">
      <a href="#indhold" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-white">
        Spring til indhold
      </a>
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Logo />
        <nav aria-label="Hovedmenu" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-sand/70 ${
                    isActive(item.href) ? "text-forest" : "text-ink/80"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1">
          <Link
            href="/kurv"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand/70"
            aria-label={ready && count > 0 ? `Kurv, ${count} ${count === 1 ? "vare" : "varer"}` : "Kurv"}
          >
            <BagIcon />
            {ready && count > 0 && (
              <span className="absolute top-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1 text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand/70 lg:hidden"
            aria-expanded={open}
            aria-controls="mobilmenu"
            aria-label={open ? "Luk menu" : "Åbn menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobilmenu" aria-label="Mobilmenu" className="fade-up border-t border-sand bg-cream lg:hidden">
          <ul className="container-page flex h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto py-4">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3 text-lg font-medium hover:bg-sand/70 ${isActive(item.href) ? "text-forest" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-4 border-t border-sand pt-4">
              <Link href="/faq" className="block rounded-xl px-4 py-3 text-muted hover:bg-sand/70">
                Ofte stillede spørgsmål
              </Link>
            </li>
            <li>
              <Link href="/guides" className="block rounded-xl px-4 py-3 text-muted hover:bg-sand/70">
                Købsguides
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
