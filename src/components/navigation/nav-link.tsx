"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  mobile?: boolean;
}

export function NavLink({
  href,
  className,
  children,
  mobile,
  ...props
}: NavLinkProps): ReactNode | null {
  const pathname = usePathname();

  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      className={cn(
        "hover:text-primary text-base capitalize transition-colors",
        isActive ? "text-primary font-bold" : "text-foreground",
        isActive && mobile && "bg-primary text-white",
        mobile && "border p-4",
        className,
      )}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}
