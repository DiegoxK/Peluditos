interface NavigationLink {
  label: string;
  href: string;
}

export const navigation: NavigationLink[] = [
  {
    label: "home",
    href: "/",
  },
  {
    label: "about",
    href: "/about",
  },
  {
    label: "products",
    href: "/products",
  },
];
