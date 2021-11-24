import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productosSchema = Schema({
  img: { type: String, required: [true, "Enlace de imagen obligatorio"] },
  tipoProducto: String,
  nombre: { type: String, required: [true, "Nombre obligatorio"] },
  stock: Number,
  precio: { type: Number, required: [true, "El precio es obligatorio"] },
  descripcion: { type: String, required: [true, "Descripción obligatoria"] },
});

// Convertir a modelo

const productos = mongoose.model("Producto", productosSchema);
export default productos;
