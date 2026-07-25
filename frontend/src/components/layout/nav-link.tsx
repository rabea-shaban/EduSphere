"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

  const isActive = exact
    ? pathname === hrefString
    : pathname.startsWith(hrefString) &&
      (pathname[hrefString.length] === "/" || pathname === hrefString);

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
