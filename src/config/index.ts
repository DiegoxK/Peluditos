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
    label: "Adopciones",
    href: "/adopt",
  },
  {
    label: "productos",
    href: "/products",
  },
];
