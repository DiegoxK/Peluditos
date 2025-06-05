export const petSortGroups = [
  {
    label: "Nombre",
    options: [
      { label: "Alfabético (A-Z)", value: [{ id: "name", desc: false }] },
      { label: "Alfabético (Z-A)", value: [{ id: "name", desc: true }] },
    ],
  },
  {
    label: "Estado",
    options: [
      { label: "Alfabético (A-Z)", value: [{ id: "status", desc: false }] },
      { label: "Alfabético (Z-A)", value: [{ id: "status", desc: true }] },
    ],
  },
  {
    label: "Edad",
    options: [
      { label: "Menor a Mayor", value: [{ id: "age", desc: false }] },
      { label: "Mayor a Menor", value: [{ id: "age", desc: true }] },
    ],
  },
  {
    label: "Fecha de Ingreso",
    options: [
      {
        label: "Más Recientes Primero",
        value: [{ id: "entryDate", desc: true }],
      },
      {
        label: "Más Antiguos Primero",
        value: [{ id: "entryDate", desc: false }],
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
