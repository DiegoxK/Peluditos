import { Menu } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";

import { navigation } from "@/config";
import { Logo } from "@/assets/vectors";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "./nav-link";
import { Cart } from "../cart/shopping-cart";

export default function MobileNav() {
  return (
    <Drawer>
      <DrawerTrigger className="block md:hidden">
        <Menu />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>Page navigation</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <Separator />
        </div>

        <nav className="flex max-h-[50vh] w-full flex-col gap-4 overflow-auto p-4">
          {navigation.map((link) => (
            <NavLink mobile key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
          <div className="flex items-center justify-center gap-2 border-t pt-4">
            <Cart />
            Carrito de compras
          </div>
        </nav>
        <div className="px-4">
          <Separator />
        </div>
        <DrawerFooter>
          <NavLink
            href="/"
            className="text-primary mb-1 flex items-center gap-2 self-center font-semibold"
          >
            <Logo className="fill-primary" width={36} height={36} />
            <span className="text-2xl font-bold">Peluditos</span>
          </NavLink>
          <DrawerClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
