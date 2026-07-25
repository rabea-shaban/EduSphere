"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  activeClassName?: string;
  exact?: boolean;
}

export function NavLink({
  href,
  className,
  activeClassName,
  exact = false,
  children,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const hrefString = typeof href === "object" ? href.pathname || "" : href;

  // Strips the locale prefix for active checking
  const normalizedPathname = pathname.replace(/^\/(ar|en)(\/|$)/, "/");
  const normalizedHref = hrefString.replace(/^\/(ar|en)(\/|$)/, "/");

  const isActive = exact
    ? normalizedPathname === normalizedHref
    : normalizedPathname.startsWith(normalizedHref) &&
      (normalizedPathname[normalizedHref.length] === "/" || normalizedPathname === normalizedHref);

  return (
    <Link
      href={href}
      className={cn(className, isActive && activeClassName)}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
export default NavLink;
