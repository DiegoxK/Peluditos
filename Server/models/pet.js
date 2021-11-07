import mongoose from "mongoose";
const Schema = mongoose.Schema;

const mascotasSchema = Schema({
  img: { type: String, required: [true, "Enlace de imagen Obligatorio"] },
  nombre: { type: String, required: [true, "Nombre Obligatorio"] },
  edadMascota: { type: Number, required: [true, "La Edad es obligatoria"] },
  descripcion: { type: String, required: [true, "Descripción Obligatoria"] },
});

// Convertir a modelo

const mascotas = mongoose.model("Mascota", mascotasSchema);
export default mascotas;
