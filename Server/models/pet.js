import mongoose from "mongoose";
const Schema = mongoose.Schema;

const mascotasSchema = Schema({
  img: { type: String, required: [true, "Enlace de imagen Obligatorio"] },
  nombre: { type: String, required: [true, "Nombre Obligatorio"] },
  descripcion: { type: String, required: [true, "Descripción Obligatoria"] },
  edadAñosMascota: Number,
  edadMesesMascota: Number,
  genero: { type: String, required: [true, "Género Obligatorio"] },
  tamaño: { type: String, required: [true, "Tamaño Obligatorio"] },
  castrado: { type: Boolean, default: false },
  vacunado: { type: Boolean, default: false },
  niños: { type: Boolean, default: false },
  otrasMascotas: { type: Boolean, default: false },
  direccion: { type: String, required: [true, "Dirección Obligatoria"] },
  correoDeContacto: { type: String, required: [true, "Correo Obligatorio"] },
  telefono: Number,
  localizacion: { type: String, required: [true, "Localización Obligatoria"] },
});

// Convertir a modelo

const mascotas = mongoose.model("Mascota", mascotasSchema);
export default mascotas;
