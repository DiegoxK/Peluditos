import { Logo } from "@/assets/vectors";
import { NavLink } from "./navigation/nav-link";
import MainNav from "./navigation/main-nav";
import MobileNav from "./navigation/mobile-nav";

export default function Header() {
  return (
    <header className="w-full">
      <div className="mx-6 flex items-center py-6 md:mx-10">
        <div className="flex w-full items-center justify-between gap-6">
          <NavLink
            href="/"
            className="text-primary flex items-center gap-2 font-semibold"
          >
            <Logo className="fill-primary" width={40} height={40} />
            <span className="text-2xl font-bold">Peluditos</span>
          </NavLink>
          <MainNav />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
