export const userSortGroups = [
  {
    label: "Nombre",
    options: [
      { label: "Alfabético (A-Z)", value: [{ id: "name", desc: false }] },
      { label: "Alfabético (Z-A)", value: [{ id: "name", desc: true }] },
    ],
  },
  {
    label: "Correo Electrónico",
    options: [
      { label: "Alfabético (A-Z)", value: [{ id: "email", desc: false }] },
      { label: "Alfabético (Z-A)", value: [{ id: "email", desc: true }] },
    ],
  },
  {
    label: "Rol",
    options: [
      { label: "Alfabético (A-Z)", value: [{ id: "role", desc: false }] },
      { label: "Alfabético (Z-A)", value: [{ id: "role", desc: true }] },
    ],
  },
];
