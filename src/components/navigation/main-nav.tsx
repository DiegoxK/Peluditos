import { navigation } from "@/config";
import { Button } from "../ui/button";
import { NavLink } from "./nav-link";
import Link from "next/link";
import { Cart } from "../ui/shopping-cart";

export default function MainNav() {
  return (
    <nav className="hidden items-center gap-6 text-sm md:flex">
      <div className="flex gap-6">
        {navigation.map((link) => (
          <NavLink key={link.href} href={link.href}>
            {link.label}
          </NavLink>
        ))}
      </div>
      {/* Call to action button */}
      <Button asChild className="bg-primary px-6">
        <Link href="/adopt">Adopta!</Link>
      </Button>
      <Cart />
    </nav>
  );
}
