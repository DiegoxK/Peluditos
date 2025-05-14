interface NavigationLink {
  label: string;
  href: string;
}

export const navigation: NavigationLink[] = [
  {
    label: "Inicio",
    href: "/",
  },
  {
    label: "Acerca",
    href: "/about",
  },
  {
    label: "productos",
    href: "/products",
  },
];
