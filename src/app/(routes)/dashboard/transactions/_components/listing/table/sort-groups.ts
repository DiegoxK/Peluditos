export const orderSortGroups = [
  {
    label: "ID del Pedido",
    options: [
      { label: "Alfabético (A-Z)", value: [{ id: "orderId", desc: false }] },
      { label: "Alfabético (Z-A)", value: [{ id: "orderId", desc: true }] },
    ],
  },
  {
    label: "Total del Pedido",
    options: [
      { label: "Menor a Mayor", value: [{ id: "total", desc: false }] },
      { label: "Mayor a Menor", value: [{ id: "total", desc: true }] },
    ],
  },
  {
    label: "Estado del Pedido",
    options: [
      {
        label: "Alfabético (A-Z)",
        value: [{ id: "orderStatus", desc: false }],
      },
      { label: "Alfabético (Z-A)", value: [{ id: "orderStatus", desc: true }] },
    ],
  },
  {
    label: "Estado del Pago",
    options: [
      {
        label: "Alfabético (A-Z)",
        value: [{ id: "paymentStatus", desc: false }],
      },
      {
        label: "Alfabético (Z-A)",
        value: [{ id: "paymentStatus", desc: true }],
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
