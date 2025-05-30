// "use client";

// import { useState } from "react";
// import { format, parseISO } from "date-fns";
// import { es } from "date-fns/locale";
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import {
//   ArrowUpDown,
//   Calendar,
//   Download,
//   Filter,
//   MoreHorizontal,
//   Pencil,
//   Plus,
//   Search,
//   Share2,
//   ShoppingCart,
//   Tag,
//   Trash2,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Textarea } from "@/components/ui/textarea";

// // Datos ficticios de productos
// const productosIniciales = [
//   {
//     id: 1,
//     nombre: "Collar Premium",
//     categoria: "Accesorios",
//     subcategoria: "Collares",
//     precio: 24990,
//     precioAnterior: 29990,
//     stock: 45,
//     stockMinimo: 10,
//     fechaCreacion: "2023-04-15",
//     ultimaActualizacion: "2023-05-10",
//     descripcion:
//       "Collar de alta calidad para perros de todos los tamaños. Material resistente y duradero.",
//     caracteristicas: ["Ajustable", "Resistente al agua", "Hebilla reforzada"],
//     imagen: "/placeholder.svg?height=80&width=80",
//     ventas: 28,
//     visualizaciones: 120,
//     destacado: true,
//   },
//   {
//     id: 2,
//     nombre: "Comida para Perros Premium",
//     categoria: "Alimentos",
//     subcategoria: "Comida seca",
//     precio: 32500,
//     precioAnterior: null,
//     stock: 120,
//     stockMinimo: 20,
//     fechaCreacion: "2023-03-20",
//     ultimaActualizacion: "2023-05-05",
//     descripcion:
//       "Alimento balanceado para perros adultos. Rico en proteínas y nutrientes esenciales.",
//     caracteristicas: [
//       "Sin conservantes",
//       "Alto en proteínas",
//       "Para todas las razas",
//     ],
//     imagen: "/placeholder.svg?height=80&width=80",
//     ventas: 45,
//     visualizaciones: 95,
//     destacado: false,
//   },
//   {
//     id: 3,
//     nombre: "Juguete Interactivo",
//     categoria: "Juguetes",
//     subcategoria: "Interactivos",
//     precio: 18750,
//     precioAnterior: 22000,
//     stock: 30,
//     stockMinimo: 5,
//     fechaCreacion: "2023-02-10",
//     ultimaActualizacion: "2023-05-08",
//     descripcion:
//       "Juguete interactivo para estimular la mente de tu mascota. Ideal para perros y gatos.",
//     caracteristicas: [
//       "Dispensador de premios",
//       "Material no tóxico",
//       "Fácil de limpiar",
//     ],
//     imagen: "/placeholder.svg?height=80&width=80",
//     ventas: 15,
//     visualizaciones: 210,
//     destacado: true,
//   },
//   {
//     id: 4,
//     nombre: "Cama para Mascotas",
//     categoria: "Accesorios",
//     subcategoria: "Camas",
//     precio: 45000,
//     precioAnterior: null,
//     stock: 15,
//     stockMinimo: 3,
//     fechaCreacion: "2023-04-05",
//     ultimaActualizacion: "2023-05-12",
//     descripcion:
//       "Cama cómoda y acogedora para perros y gatos. Funda lavable y relleno suave.",
//     caracteristicas: [
//       "Lavable a máquina",
//       "Base antideslizante",
//       "Tamaño mediano",
//     ],
//     imagen: "/placeholder.svg?height=80&width=80",
//     ventas: 8,
//     visualizaciones: 85,
//     destacado: false,
//   },
//   {
//     id: 5,
//     nombre: "Comida para Gatos Premium",
//     categoria: "Alimentos",
//     subcategoria: "Comida seca",
//     precio: 28990,
//     precioAnterior: 32000,
//     stock: 80,
//     stockMinimo: 15,
//     fechaCreacion: "2023-01-15",
//     ultimaActualizacion: "2023-04-20",
//     descripcion:
//       "Alimento balanceado para gatos adultos. Rico en proteínas y nutrientes esenciales.",
//     caracteristicas: [
//       "Sin conservantes",
//       "Alto en proteínas",
//       "Control bolas de pelo",
//     ],
//     imagen: "/placeholder.svg?height=80&width=80",
//     ventas: 32,
//     visualizaciones: 150,
//     destacado: true,
//   },
//   {
//     id: 6,
//     nombre: "Rascador para Gatos",
//     categoria: "Accesorios",
//     subcategoria: "Rascadores",
//     precio: 35500,
//     precioAnterior: null,
//     stock: 25,
//     stockMinimo: 5,
//     fechaCreacion: "2023-04-25",
//     ultimaActualizacion: "2023-05-15",
//     descripcion:
//       "Rascador de sisal natural para gatos. Ayuda a mantener las uñas saludables.",
//     caracteristicas: [
//       "Base estable",
//       "Sisal natural",
//       "Incluye juguete colgante",
//     ],
//     imagen: "/placeholder.svg?height=80&width=80",
//     ventas: 12,
//     visualizaciones: 110,
//     destacado: false,
//   },
//   {
//     id: 7,
//     nombre: "Arnés para Perros",
//     categoria: "Accesorios",
//     subcategoria: "Arneses",
//     precio: 19990,
//     precioAnterior: 24990,
//     stock: 40,
//     stockMinimo: 8,
//     fechaCreacion: "2023-03-10",
//     ultimaActualizacion: "2023-05-02",
//     descripcion:
//       "Arnés cómodo y seguro para perros. Ajustable y con acolchado para mayor comodidad.",
//     caracteristicas: ["Ajustable", "Acolchado", "Reflectante"],
//     imagen: "/placeholder.svg?height=80&width=80",
//     ventas: 22,
//     visualizaciones: 180,
//     destacado: true,
//   },
//   {
//     id: 8,
//     nombre: "Shampoo para Perros",
//     categoria: "Higiene",
//     subcategoria: "Shampoo",
//     precio: 15990,
//     precioAnterior: null,
//     stock: 60,
//     stockMinimo: 10,
//     fechaCreacion: "2023-04-18",
//     ultimaActualizacion: "2023-05-14",
//     descripcion:
//       "Shampoo suave para perros. Limpia y acondiciona el pelaje dejándolo suave y brillante.",
//     caracteristicas: ["pH balanceado", "Sin parabenos", "Aroma a lavanda"],
//     imagen: "/placeholder.svg?height=80&width=80",
//     ventas: 18,
//     visualizaciones: 65,
//     destacado: false,
//   },
// ];

// // Datos para gráficos
// const datosVentasMensuales = [
//   { mes: "Ene", ventas: 1250000 },
//   { mes: "Feb", ventas: 1580000 },
//   { mes: "Mar", ventas: 1420000 },
//   { mes: "Abr", ventas: 1680000 },
//   { mes: "May", ventas: 1950000 },
//   { mes: "Jun", ventas: 0 },
// ];

// // Colores para el gráfico de categorías
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// // Categorías disponibles
// const categorias = [
//   "Alimentos",
//   "Juguetes",
//   "Accesorios",
//   "Higiene",
//   "Medicamentos",
// ];

// // Subcategorías por categoría
// const subcategorias = {
//   Alimentos: ["Comida seca", "Comida húmeda", "Snacks", "Suplementos"],
//   Juguetes: ["Pelotas", "Interactivos", "Peluches", "Cuerdas"],
//   Accesorios: ["Collares", "Arneses", "Camas", "Rascadores", "Transportadoras"],
//   Higiene: ["Shampoo", "Cepillos", "Cortauñas", "Limpieza dental"],
//   Medicamentos: [
//     "Antiparasitarios",
//     "Vitaminas",
//     "Antibióticos",
//     "Suplementos",
//   ],
// };

// // Formatear fecha
// const formatearFecha = (fechaStr) => {
//   if (!fechaStr) return "";
//   try {
//     const fecha = parseISO(fechaStr);
//     return format(fecha, "dd/MM/yyyy", { locale: es });
//   } catch (error) {
//     return fechaStr;
//   }
// };

// // Formatear moneda colombiana
// const formatearMoneda = (valor) => {
//   return new Intl.NumberFormat("es-CO", {
//     style: "currency",
//     currency: "COP",
//     minimumFractionDigits: 0,
//   }).format(valor);
// };

// export default function ProductosPage() {
//   const [productos, setProductos] = useState(productosIniciales);
//   const [productoActual, setProductoActual] = useState(null);
//   const [busqueda, setBusqueda] = useState("");
//   const [filtroCategoria, setFiltroCategoria] = useState([]);
//   const [filtroStock, setFiltroStock] = useState(null);
//   const [filtroDestacado, setFiltroDestacado] = useState(false);
//   const [filtroFecha, setFiltroFecha] = useState(null);
//   const [ordenarPor, setOrdenarPor] = useState("fecha-desc");
//   const [dialogoAbierto, setDialogoAbierto] = useState(false);
//   const [dialogoEliminar, setDialogoEliminar] = useState(false);
//   const [dialogoDetalles, setDialogoDetalles] = useState(false);
//   const [mesSeleccionado, setMesSeleccionado] = useState("May");

//   // Calcular datos para el gráfico de categorías
//   const contarProductosPorCategoria = () => {
//     const conteo = {};
//     productos.forEach((producto) => {
//       conteo[producto.categoria] = (conteo[producto.categoria] || 0) + 1;
//     });
//     return Object.keys(conteo).map((key) => ({
//       name: key,
//       value: conteo[key],
//     }));
//   };

//   // Calcular datos para el gráfico de ventas por categoría
//   const ventasPorCategoria = () => {
//     const conteo = {};
//     productos.forEach((producto) => {
//       conteo[producto.categoria] =
//         (conteo[producto.categoria] || 0) + producto.ventas;
//     });
//     return Object.keys(conteo).map((key) => ({
//       name: key,
//       value: conteo[key],
//     }));
//   };

//   // Filtrar productos
//   const productosFiltrados = productos
//     .filter((producto) => {
//       // Filtro de búsqueda
//       const coincideBusqueda =
//         producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
//         producto.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
//         producto.subcategoria.toLowerCase().includes(busqueda.toLowerCase());

//       // Filtro de categoría
//       const coincideCategoria =
//         filtroCategoria.length === 0 ||
//         filtroCategoria.includes(producto.categoria);

//       // Filtro de stock
//       const coincideStock =
//         filtroStock === null ||
//         (filtroStock === "bajo" && producto.stock <= producto.stockMinimo) ||
//         (filtroStock === "agotado" && producto.stock === 0) ||
//         (filtroStock === "disponible" && producto.stock > 0);

//       // Filtro de destacado
//       const coincideDestacado = !filtroDestacado || producto.destacado;

//       // Filtro de fecha
//       const coincideFecha =
//         !filtroFecha || producto.fechaCreacion === filtroFecha;

//       return (
//         coincideBusqueda &&
//         coincideCategoria &&
//         coincideStock &&
//         coincideDestacado &&
//         coincideFecha
//       );
//     })
//     .sort((a, b) => {
//       // Ordenamiento
//       if (ordenarPor === "fecha-asc") {
//         return new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
//       } else if (ordenarPor === "fecha-desc") {
//         return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
//       } else if (ordenarPor === "nombre-asc") {
//         return a.nombre.localeCompare(b.nombre);
//       } else if (ordenarPor === "nombre-desc") {
//         return b.nombre.localeCompare(a.nombre);
//       } else if (ordenarPor === "precio-asc") {
//         return a.precio - b.precio;
//       } else if (ordenarPor === "precio-desc") {
//         return b.precio - a.precio;
//       } else if (ordenarPor === "ventas-desc") {
//         return b.ventas - a.ventas;
//       }
//       return 0;
//     });

//   // Abrir formulario para nuevo producto
//   const abrirNuevoProducto = () => {
//     setProductoActual({
//       id: productos.length + 1,
//       nombre: "",
//       categoria: "Accesorios",
//       subcategoria: "",
//       precio: 0,
//       precioAnterior: null,
//       stock: 0,
//       stockMinimo: 5,
//       fechaCreacion: format(new Date(), "yyyy-MM-dd"),
//       ultimaActualizacion: format(new Date(), "yyyy-MM-dd"),
//       descripcion: "",
//       caracteristicas: [],
//       imagen: "/placeholder.svg?height=80&width=80",
//       ventas: 0,
//       visualizaciones: 0,
//       destacado: false,
//     });
//     setDialogoAbierto(true);
//   };

//   // Abrir formulario para editar producto
//   const editarProducto = (producto) => {
//     setProductoActual(producto);
//     setDialogoAbierto(true);
//   };

//   // Abrir detalles de producto
//   const verDetallesProducto = (producto) => {
//     setProductoActual(producto);
//     setDialogoDetalles(true);
//   };

//   // Confirmar eliminación de producto
//   const confirmarEliminar = (producto) => {
//     setProductoActual(producto);
//     setDialogoEliminar(true);
//   };

//   // Eliminar producto
//   const eliminarProducto = () => {
//     setProductos(productos.filter((p) => p.id !== productoActual.id));
//     setDialogoEliminar(false);
//   };

//   // Guardar producto (nuevo o editado)
//   const guardarProducto = (e) => {
//     e.preventDefault();
//     if (productos.find((p) => p.id === productoActual.id)) {
//       // Actualizar producto existente
//       setProductos(
//         productos.map((p) => (p.id === productoActual.id ? productoActual : p)),
//       );
//     } else {
//       // Agregar nuevo producto
//       setProductos([...productos, productoActual]);
//     }
//     setDialogoAbierto(false);
//   };

//   // Cambiar estado destacado
//   const cambiarDestacado = (producto) => {
//     setProductos(
//       productos.map((p) => {
//         if (p.id === producto.id) {
//           return { ...p, destacado: !p.destacado };
//         }
//         return p;
//       }),
//     );
//   };

//   // Exportar a Excel (simulado)
//   const exportarExcel = () => {
//     alert("Exportando productos a Excel...");
//   };

//   // Compartir producto (simulado)
//   const compartirProducto = (producto) => {
//     alert(`Compartiendo producto ${producto.nombre}...`);
//   };

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold tracking-tight">
//           Gestión de Productos
//         </h1>
//         <p className="text-muted-foreground">
//           Administra el inventario de productos para mascotas
//         </p>
//       </div>

//       <Tabs defaultValue="productos" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="productos">Productos</TabsTrigger>
//           <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
//         </TabsList>

//         <TabsContent value="productos" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-3">
//             <Card>
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-2">
//                   <div className="text-muted-foreground text-sm font-medium">
//                     Total de Productos
//                   </div>
//                 </div>
//                 <div className="mt-1 text-2xl font-bold">
//                   {productos.length}
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-2">
//                   <div className="text-muted-foreground text-sm font-medium">
//                     Productos con Stock Bajo
//                   </div>
//                 </div>
//                 <div className="mt-1 text-2xl font-bold">
//                   {
//                     productos.filter(
//                       (p) => p.stock <= p.stockMinimo && p.stock > 0,
//                     ).length
//                   }
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-2">
//                   <div className="text-muted-foreground text-sm font-medium">
//                     Productos Agotados
//                   </div>
//                 </div>
//                 <div className="mt-1 text-2xl font-bold">
//                   {productos.filter((p) => p.stock === 0).length}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex items-center gap-2">
//               <Search className="text-muted-foreground h-4 w-4" />
//               <Input
//                 placeholder="Buscar por nombre, categoría o subcategoría..."
//                 value={busqueda}
//                 onChange={(e) => setBusqueda(e.target.value)}
//                 className="max-w-sm"
//               />
//             </div>
//             <div className="flex flex-wrap items-center gap-2">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="sm">
//                     <Filter className="mr-2 h-4 w-4" />
//                     Filtrar
//                     {(filtroCategoria.length > 0 ||
//                       filtroStock ||
//                       filtroDestacado) && (
//                       <Badge
//                         variant="secondary"
//                         className="ml-2 rounded-sm px-1"
//                       >
//                         {filtroCategoria.length +
//                           (filtroStock ? 1 : 0) +
//                           (filtroDestacado ? 1 : 0)}
//                       </Badge>
//                     )}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-[200px]">
//                   <DropdownMenuLabel>Categoría</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   {categorias.map((categoria) => (
//                     <DropdownMenuCheckboxItem
//                       key={categoria}
//                       checked={filtroCategoria.includes(categoria)}
//                       onCheckedChange={(checked) => {
//                         if (checked) {
//                           setFiltroCategoria([...filtroCategoria, categoria]);
//                         } else {
//                           setFiltroCategoria(
//                             filtroCategoria.filter((c) => c !== categoria),
//                           );
//                         }
//                       }}
//                     >
//                       {categoria}
//                     </DropdownMenuCheckboxItem>
//                   ))}
//                   <DropdownMenuLabel className="mt-2">Stock</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuCheckboxItem
//                     checked={filtroStock === "bajo"}
//                     onCheckedChange={(checked) => {
//                       setFiltroStock(checked ? "bajo" : null);
//                     }}
//                   >
//                     Stock bajo
//                   </DropdownMenuCheckboxItem>
//                   <DropdownMenuCheckboxItem
//                     checked={filtroStock === "agotado"}
//                     onCheckedChange={(checked) => {
//                       setFiltroStock(checked ? "agotado" : null);
//                     }}
//                   >
//                     Agotado
//                   </DropdownMenuCheckboxItem>
//                   <DropdownMenuCheckboxItem
//                     checked={filtroStock === "disponible"}
//                     onCheckedChange={(checked) => {
//                       setFiltroStock(checked ? "disponible" : null);
//                     }}
//                   >
//                     Disponible
//                   </DropdownMenuCheckboxItem>
//                   <DropdownMenuLabel className="mt-2">Otros</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuCheckboxItem
//                     checked={filtroDestacado}
//                     onCheckedChange={(checked) => {
//                       setFiltroDestacado(checked);
//                     }}
//                   >
//                     Solo destacados
//                   </DropdownMenuCheckboxItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline" size="sm">
//                     <Calendar className="mr-2 h-4 w-4" />
//                     {filtroFecha
//                       ? formatearFecha(filtroFecha)
//                       : "Filtrar por Fecha"}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="end">
//                   <CalendarComponent
//                     mode="single"
//                     selected={filtroFecha ? new Date(filtroFecha) : undefined}
//                     onSelect={(date) => {
//                       if (date) {
//                         setFiltroFecha(format(date, "yyyy-MM-dd"));
//                       } else {
//                         setFiltroFecha(null);
//                       }
//                     }}
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="sm">
//                     <ArrowUpDown className="mr-2 h-4 w-4" />
//                     Ordenar
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem onClick={() => setOrdenarPor("fecha-desc")}>
//                     Más recientes primero
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setOrdenarPor("fecha-asc")}>
//                     Más antiguos primero
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setOrdenarPor("nombre-asc")}>
//                     Nombre (A-Z)
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => setOrdenarPor("nombre-desc")}
//                   >
//                     Nombre (Z-A)
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setOrdenarPor("precio-asc")}>
//                     Precio (menor a mayor)
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => setOrdenarPor("precio-desc")}
//                   >
//                     Precio (mayor a menor)
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => setOrdenarPor("ventas-desc")}
//                   >
//                     Más vendidos primero
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   setBusqueda("");
//                   setFiltroCategoria([]);
//                   setFiltroStock(null);
//                   setFiltroDestacado(false);
//                   setFiltroFecha(null);
//                   setOrdenarPor("fecha-desc");
//                 }}
//               >
//                 Limpiar filtros
//               </Button>

//               <Button variant="outline" size="sm" onClick={exportarExcel}>
//                 <Download className="mr-2 h-4 w-4" />
//                 Exportar
//               </Button>

//               <Button onClick={abrirNuevoProducto}>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Nuevo Producto
//               </Button>
//             </div>
//           </div>

//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Imagen</TableHead>
//                   <TableHead>Nombre</TableHead>
//                   <TableHead>Categoría</TableHead>
//                   <TableHead>Precio</TableHead>
//                   <TableHead>Stock</TableHead>
//                   <TableHead>Ventas</TableHead>
//                   <TableHead>Estado</TableHead>
//                   <TableHead className="text-right">Acciones</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {productosFiltrados.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={8} className="h-24 text-center">
//                       No se encontraron productos.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   productosFiltrados.map((producto) => (
//                     <TableRow key={producto.id} className="group">
//                       <TableCell>
//                         <img
//                           src={producto.imagen || "/placeholder.svg"}
//                           alt={producto.nombre}
//                           className="h-10 w-10 rounded-md object-cover"
//                         />
//                       </TableCell>
//                       <TableCell className="font-medium">
//                         <div className="flex flex-col">
//                           <span>{producto.nombre}</span>
//                           {producto.destacado && (
//                             <Badge variant="outline" className="mt-1 w-fit">
//                               Destacado
//                             </Badge>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex flex-col">
//                           <span>{producto.categoria}</span>
//                           <span className="text-muted-foreground text-xs">
//                             {producto.subcategoria}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex flex-col">
//                           <span>{formatearMoneda(producto.precio)}</span>
//                           {producto.precioAnterior && (
//                             <span className="text-muted-foreground text-xs line-through">
//                               {formatearMoneda(producto.precioAnterior)}
//                             </span>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex flex-col">
//                           <span>{producto.stock} unidades</span>
//                           {producto.stock <= producto.stockMinimo &&
//                             producto.stock > 0 && (
//                               <span className="text-xs text-amber-500">
//                                 Stock bajo
//                               </span>
//                             )}
//                           {producto.stock === 0 && (
//                             <span className="text-destructive text-xs">
//                               Agotado
//                             </span>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-1">
//                           <ShoppingCart className="text-muted-foreground h-4 w-4" />
//                           <span>{producto.ventas}</span>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Badge
//                           variant={
//                             producto.stock > producto.stockMinimo
//                               ? "default"
//                               : producto.stock > 0
//                                 ? "outline"
//                                 : "destructive"
//                           }
//                         >
//                           {producto.stock > producto.stockMinimo
//                             ? "En stock"
//                             : producto.stock > 0
//                               ? "Stock bajo"
//                               : "Agotado"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => verDetallesProducto(producto)}
//                             title="Ver detalles"
//                           >
//                             <Search className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => editarProducto(producto)}
//                             title="Editar producto"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </Button>
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="icon">
//                                 <MoreHorizontal className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuItem
//                                 onClick={() => compartirProducto(producto)}
//                               >
//                                 <Share2 className="mr-2 h-4 w-4" />
//                                 Compartir producto
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 onClick={() => cambiarDestacado(producto)}
//                               >
//                                 <Tag className="mr-2 h-4 w-4" />
//                                 {producto.destacado
//                                   ? "Quitar destacado"
//                                   : "Marcar como destacado"}
//                               </DropdownMenuItem>
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem
//                                 onClick={() => confirmarEliminar(producto)}
//                                 className="text-destructive focus:text-destructive"
//                               >
//                                 <Trash2 className="mr-2 h-4 w-4" />
//                                 Eliminar
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>

//         <TabsContent value="estadisticas" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Ventas Mensuales</CardTitle>
//                 <CardDescription>Ingresos por ventas por mes</CardDescription>
//                 <Select
//                   value={mesSeleccionado}
//                   onValueChange={setMesSeleccionado}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Seleccionar mes" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {datosVentasMensuales.map((item) => (
//                       <SelectItem key={item.mes} value={item.mes}>
//                         {item.mes} 2023
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </CardHeader>
//               <CardContent className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={datosVentasMensuales}
//                     margin={{
//                       top: 5,
//                       right: 30,
//                       left: 20,
//                       bottom: 5,
//                     }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="mes" />
//                     <YAxis
//                       tickFormatter={(value) =>
//                         new Intl.NumberFormat("es-CO", {
//                           notation: "compact",
//                           compactDisplay: "short",
//                           currency: "COP",
//                         }).format(value)
//                       }
//                     />
//                     <Tooltip
//                       formatter={(value) =>
//                         new Intl.NumberFormat("es-CO", {
//                           style: "currency",
//                           currency: "COP",
//                           minimumFractionDigits: 0,
//                         }).format(value)
//                       }
//                     />
//                     <Legend />
//                     <Bar dataKey="ventas" fill="#8884d8" name="Ventas" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Distribución por Categoría</CardTitle>
//                 <CardDescription>Productos por categoría</CardDescription>
//               </CardHeader>
//               <CardContent className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={contarProductosPorCategoria()}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={true}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                       label={({ name, percent }) =>
//                         `${name} ${(percent * 100).toFixed(0)}%`
//                       }
//                     >
//                       {contarProductosPorCategoria().map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Ventas por Categoría</CardTitle>
//               <CardDescription>
//                 Número de unidades vendidas por categoría
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={ventasPorCategoria()}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={true}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                     label={({ name, percent }) =>
//                       `${name} ${(percent * 100).toFixed(0)}%`
//                     }
//                   >
//                     {ventasPorCategoria().map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Diálogo para crear/editar producto */}
//       <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>
//               {productoActual && productoActual.nombre
//                 ? "Editar Producto"
//                 : "Nuevo Producto"}
//             </DialogTitle>
//             <DialogDescription>
//               Complete los detalles del producto y guarde los cambios.
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={guardarProducto}>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="nombre">Nombre</Label>
//                   <Input
//                     id="nombre"
//                     value={productoActual?.nombre || ""}
//                     onChange={(e) =>
//                       setProductoActual({
//                         ...productoActual,
//                         nombre: e.target.value,
//                       })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="categoria">Categoría</Label>
//                   <Select
//                     value={productoActual?.categoria || "Accesorios"}
//                     onValueChange={(value) => {
//                       setProductoActual({
//                         ...productoActual,
//                         categoria: value,
//                         subcategoria: subcategorias[value][0],
//                       });
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Seleccionar categoría" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categorias.map((cat) => (
//                         <SelectItem key={cat} value={cat}>
//                           {cat}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="subcategoria">Subcategoría</Label>
//                   <Select
//                     value={productoActual?.subcategoria || ""}
//                     onValueChange={(value) =>
//                       setProductoActual({
//                         ...productoActual,
//                         subcategoria: value,
//                       })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Seleccionar subcategoría" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {productoActual?.categoria &&
//                         subcategorias[productoActual.categoria].map(
//                           (subcat) => (
//                             <SelectItem key={subcat} value={subcat}>
//                               {subcat}
//                             </SelectItem>
//                           ),
//                         )}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="destacado">Destacado</Label>
//                   <div className="flex items-center gap-2 pt-2">
//                     <input
//                       type="checkbox"
//                       id="destacado"
//                       checked={productoActual?.destacado || false}
//                       onChange={(e) =>
//                         setProductoActual({
//                           ...productoActual,
//                           destacado: e.target.checked,
//                         })
//                       }
//                       className="h-4 w-4 rounded border-gray-300"
//                     />
//                     <Label htmlFor="destacado" className="font-normal">
//                       Marcar como producto destacado
//                     </Label>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="precio">Precio</Label>
//                   <Input
//                     id="precio"
//                     type="number"
//                     min="0"
//                     value={productoActual?.precio || 0}
//                     onChange={(e) =>
//                       setProductoActual({
//                         ...productoActual,
//                         precio: Number.parseInt(e.target.value),
//                       })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="precioAnterior">
//                     Precio Anterior (opcional)
//                   </Label>
//                   <Input
//                     id="precioAnterior"
//                     type="number"
//                     min="0"
//                     value={productoActual?.precioAnterior || ""}
//                     onChange={(e) =>
//                       setProductoActual({
//                         ...productoActual,
//                         precioAnterior: e.target.value
//                           ? Number.parseInt(e.target.value)
//                           : null,
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="stock">Stock</Label>
//                   <Input
//                     id="stock"
//                     type="number"
//                     min="0"
//                     value={productoActual?.stock || 0}
//                     onChange={(e) =>
//                       setProductoActual({
//                         ...productoActual,
//                         stock: Number.parseInt(e.target.value),
//                       })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="stockMinimo">Stock Mínimo</Label>
//                   <Input
//                     id="stockMinimo"
//                     type="number"
//                     min="0"
//                     value={productoActual?.stockMinimo || 5}
//                     onChange={(e) =>
//                       setProductoActual({
//                         ...productoActual,
//                         stockMinimo: Number.parseInt(e.target.value),
//                       })
//                     }
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="descripcion">Descripción</Label>
//                 <Textarea
//                   id="descripcion"
//                   value={productoActual?.descripcion || ""}
//                   onChange={(e) =>
//                     setProductoActual({
//                       ...productoActual,
//                       descripcion: e.target.value,
//                     })
//                   }
//                   rows={3}
//                   placeholder="Describa el producto..."
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="caracteristicas">
//                   Características (una por línea)
//                 </Label>
//                 <Textarea
//                   id="caracteristicas"
//                   value={productoActual?.caracteristicas?.join("\n") || ""}
//                   onChange={(e) =>
//                     setProductoActual({
//                       ...productoActual,
//                       caracteristicas: e.target.value
//                         .split("\n")
//                         .filter((c) => c.trim() !== ""),
//                     })
//                   }
//                   rows={3}
//                   placeholder="Ingrese las características del producto, una por línea..."
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="submit">Guardar cambios</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Diálogo para confirmar eliminación */}
//       <Dialog open={dialogoEliminar} onOpenChange={setDialogoEliminar}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Confirmar eliminación</DialogTitle>
//             <DialogDescription>
//               ¿Está seguro que desea eliminar el producto{" "}
//               {productoActual?.nombre}? Esta acción no se puede deshacer.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDialogoEliminar(false)}>
//               Cancelar
//             </Button>
//             <Button variant="destructive" onClick={eliminarProducto}>
//               Eliminar
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Diálogo para ver detalles de producto */}
//       <Dialog open={dialogoDetalles} onOpenChange={setDialogoDetalles}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>Detalles de {productoActual?.nombre}</DialogTitle>
//             <DialogDescription>
//               Información completa del producto creado el{" "}
//               {productoActual && formatearFecha(productoActual.fechaCreacion)}
//             </DialogDescription>
//           </DialogHeader>

//           {productoActual && (
//             <div className="grid gap-6">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={productoActual.imagen || "/placeholder.svg"}
//                   alt={productoActual.nombre}
//                   className="h-24 w-24 rounded-md object-cover"
//                 />
//                 <div>
//                   <h2 className="text-2xl font-bold">
//                     {productoActual.nombre}
//                   </h2>
//                   <p className="text-muted-foreground">
//                     {productoActual.categoria} • {productoActual.subcategoria}
//                   </p>
//                   <div className="mt-1 flex items-center gap-2">
//                     <Badge
//                       variant={
//                         productoActual.stock > productoActual.stockMinimo
//                           ? "default"
//                           : productoActual.stock > 0
//                             ? "outline"
//                             : "destructive"
//                       }
//                     >
//                       {productoActual.stock > productoActual.stockMinimo
//                         ? "En stock"
//                         : productoActual.stock > 0
//                           ? "Stock bajo"
//                           : "Agotado"}
//                     </Badge>
//                     {productoActual.destacado && (
//                       <Badge variant="secondary">Destacado</Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <h3 className="mb-2 font-medium">Información de Precio</h3>
//                   <div className="rounded-md border p-3">
//                     <div className="grid gap-1">
//                       <div className="grid grid-cols-2">
//                         <span className="text-sm font-medium">
//                           Precio actual:
//                         </span>
//                         <span className="text-sm">
//                           {formatearMoneda(productoActual.precio)}
//                         </span>
//                       </div>
//                       {productoActual.precioAnterior && (
//                         <div className="grid grid-cols-2">
//                           <span className="text-sm font-medium">
//                             Precio anterior:
//                           </span>
//                           <span className="text-sm line-through">
//                             {formatearMoneda(productoActual.precioAnterior)}
//                           </span>
//                         </div>
//                       )}
//                       {productoActual.precioAnterior && (
//                         <div className="grid grid-cols-2">
//                           <span className="text-sm font-medium">
//                             Descuento:
//                           </span>
//                           <span className="text-sm text-green-600">
//                             {Math.round(
//                               ((productoActual.precioAnterior -
//                                 productoActual.precio) /
//                                 productoActual.precioAnterior) *
//                                 100,
//                             )}
//                             %
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="mb-2 font-medium">Información de Stock</h3>
//                   <div className="rounded-md border p-3">
//                     <div className="grid gap-1">
//                       <div className="grid grid-cols-2">
//                         <span className="text-sm font-medium">
//                           Stock actual:
//                         </span>
//                         <span className="text-sm">
//                           {productoActual.stock} unidades
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-sm font-medium">
//                           Stock mínimo:
//                         </span>
//                         <span className="text-sm">
//                           {productoActual.stockMinimo} unidades
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-sm font-medium">Estado:</span>
//                         <span
//                           className={`text-sm ${
//                             productoActual.stock === 0
//                               ? "text-destructive"
//                               : productoActual.stock <=
//                                   productoActual.stockMinimo
//                                 ? "text-amber-500"
//                                 : "text-green-600"
//                           }`}
//                         >
//                           {productoActual.stock === 0
//                             ? "Agotado"
//                             : productoActual.stock <= productoActual.stockMinimo
//                               ? "Stock bajo"
//                               : "Disponible"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <h3 className="mb-2 font-medium">Estadísticas</h3>
//                   <div className="rounded-md border p-3">
//                     <div className="grid gap-1">
//                       <div className="grid grid-cols-2">
//                         <span className="text-sm font-medium">Ventas:</span>
//                         <span className="text-sm">
//                           {productoActual.ventas} unidades
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-sm font-medium">
//                           Visualizaciones:
//                         </span>
//                         <span className="text-sm">
//                           {productoActual.visualizaciones}
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-sm font-medium">
//                           Tasa de conversión:
//                         </span>
//                         <span className="text-sm">
//                           {productoActual.visualizaciones > 0
//                             ? (
//                                 (productoActual.ventas /
//                                   productoActual.visualizaciones) *
//                                 100
//                               ).toFixed(1)
//                             : 0}
//                           %
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="mb-2 font-medium">Fechas</h3>
//                   <div className="rounded-md border p-3">
//                     <div className="grid gap-1">
//                       <div className="grid grid-cols-2">
//                         <span className="text-sm font-medium">
//                           Fecha de creación:
//                         </span>
//                         <span className="text-sm">
//                           {formatearFecha(productoActual.fechaCreacion)}
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2">
//                         <span className="text-sm font-medium">
//                           Última actualización:
//                         </span>
//                         <span className="text-sm">
//                           {formatearFecha(productoActual.ultimaActualizacion)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="mb-2 font-medium">Descripción</h3>
//                 <div className="rounded-md border p-3">
//                   <p className="text-sm">
//                     {productoActual.descripcion ||
//                       "No hay descripción disponible."}
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="mb-2 font-medium">Características</h3>
//                 <div className="rounded-md border p-3">
//                   {productoActual.caracteristicas &&
//                   productoActual.caracteristicas.length > 0 ? (
//                     <ul className="ml-5 list-disc text-sm">
//                       {productoActual.caracteristicas.map(
//                         (caracteristica, index) => (
//                           <li key={index}>{caracteristica}</li>
//                         ),
//                       )}
//                     </ul>
//                   ) : (
//                     <p className="text-sm">
//                       No hay características disponibles.
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="flex justify-between">
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => compartirProducto(productoActual)}
//                     className="gap-2"
//                   >
//                     <Share2 className="h-4 w-4" />
//                     Compartir producto
//                   </Button>
//                   <Button
//                     variant={productoActual.destacado ? "outline" : "default"}
//                     onClick={() => {
//                       cambiarDestacado(productoActual);
//                       setDialogoDetalles(false);
//                     }}
//                     className="gap-2"
//                   >
//                     <Tag className="h-4 w-4" />
//                     {productoActual.destacado
//                       ? "Quitar destacado"
//                       : "Marcar como destacado"}
//                   </Button>
//                 </div>
//                 <Button
//                   variant="outline"
//                   onClick={() => setDialogoDetalles(false)}
//                 >
//                   Cerrar
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
