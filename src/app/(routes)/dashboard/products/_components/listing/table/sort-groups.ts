export const productSortGroups = [
  {
    label: "Nombre",
    options: [
      { label: "Alfabético (A-Z)", value: [{ id: "name", desc: false }] },
      { label: "Alfabético (Z-A)", value: [{ id: "name", desc: true }] },
    ],
  },
  {
    label: "Precio",
    options: [
      { label: "Menor a Mayor", value: [{ id: "price", desc: false }] },
      { label: "Mayor a Menor", value: [{ id: "price", desc: true }] },
    ],
  },
  {
    label: "Stock",
    options: [
      { label: "Menor a Mayor", value: [{ id: "stock", desc: false }] },
      { label: "Mayor a Menor", value: [{ id: "stock", desc: true }] },
    ],
  },
  {
    label: "Ventas",
    options: [
      {
        label: "Más Vendidos Primero",
        value: [{ id: "sales", desc: true }],
      },
      {
        label: "Menos Vendidos Primero",
        value: [{ id: "sales", desc: false }],
      },
    ],
  },
  {
    label: "Fecha de Creación",
    options: [
      {
        label: "Más Recientes Primero",
        value: [{ id: "createdAt", desc: true }],
      },
      {
        label: "Más Antiguos Primero",
        value: [{ id: "createdAt", desc: false }],
      },
    ],
  },
];
