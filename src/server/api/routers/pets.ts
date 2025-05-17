import { z } from "zod";
import { PetSchema, type Pet } from "@/server/db/schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

const mascotasIniciales: Pet[] = [
  {
    name: "Luna",
    specie: "Perro",
    breed: "Labrador",
    age: 2,
    status: "disponible",
    image: "/placeholder.svg?height=80&width=80",
    entryDate: "2023-05-15",
    description: "Juguetona y cariñosa, le encanta correr y jugar con pelotas.",
    gender: "Hembra",
    weight: 12.5,
    vaccinated: true,
    sterilized: true,
  },
  {
    name: "Simba",
    specie: "Gato",
    breed: "Siamés",
    age: 1,
    status: "adoptado",
    image: "/placeholder.svg?height=80&width=80",
    entryDate: "2023-04-20",
    description: "Tranquilo y muy limpio, le gusta dormir en lugares altos.",
    gender: "Macho",
    weight: 4.2,
    vaccinated: true,
    sterilized: false,
  },
  {
    name: "Rocky",
    specie: "Perro",
    breed: "Pastor Alemán",
    age: 3,
    status: "disponible",
    image: "/placeholder.svg?height=80&width=80",
    entryDate: "2023-05-02",
    description: "Inteligente y protector, ideal para familias con niños.",
    gender: "Macho",
    weight: 28.3,
    vaccinated: true,
    sterilized: true,
  },
  {
    name: "Milo",
    specie: "Gato",
    breed: "Persa",
    age: 2,
    status: "disponible",
    image: "/placeholder.svg?height=80&width=80",
    entryDate: "2023-05-10",
    description: "Pelaje suave y abundante, necesita cepillado diario.",
    gender: "Macho",
    weight: 5.1,
    vaccinated: true,
    sterilized: true,
  },
  {
    name: "Coco",
    specie: "Perro",
    breed: "Bulldog",
    age: 4,
    status: "adoptado",
    image: "/placeholder.svg?height=80&width=80",
    entryDate: "2023-03-15",
    description: "Tranquilo y amigable, le encanta dormir y los mimos.",
    gender: "Macho",
    weight: 18.7,
    vaccinated: true,
    sterilized: true,
  },
  {
    name: "Nala",
    specie: "Gato",
    breed: "Bengalí",
    age: 1,
    status: "disponible",
    image: "/placeholder.svg?height=80&width=80",
    entryDate: "2023-05-08",
    description: "Muy activa y juguetona, necesita mucho ejercicio.",
    gender: "Hembra",
    weight: 3.8,
    vaccinated: true,
    sterilized: false,
  },
  {
    name: "Max",
    specie: "Perro",
    breed: "Golden Retriever",
    age: 2,
    status: "disponible",
    image: "/placeholder.svg?height=80&width=80",
    entryDate: "2023-04-28",
    description: "Amigable con todos, especialmente con niños.",
    gender: "Macho",
    weight: 25.2,
    vaccinated: true,
    sterilized: true,
  },
  {
    name: "Bella",
    specie: "Perro",
    breed: "Beagle",
    age: 3,
    status: "adoptado",
    image: "/placeholder.svg?height=80&width=80",
    entryDate: "2023-03-22",
    description: "Energética y curiosa, le encanta explorar.",
    gender: "Hembra",
    weight: 12.8,
    vaccinated: true,
    sterilized: true,
  },
];

export const petRouter = createTRPCRouter({
  getAllPets: protectedProcedure.query(async ({ ctx }) => {
    // const pets = await ctx.db
    //   .collection<Pet>("pets")
    //   .find({})
    //   .sort({ createdAt: -1 })
    //   .toArray();

    return mascotasIniciales;
  }),
});
