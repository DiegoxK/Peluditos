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
//   ChevronDown,
//   Download,
//   Filter,
//   Mail,
//   MessageSquare,
//   Package,
//   Search,
//   Truck,
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

// // Datos ficticios de pedidos
// const pedidosIniciales = [
//   {
//     id: "PED-001",
//     cliente: {
//       nombre: "María Fernández",
//       telefono: "315-789-4562",
//       email: "maria.fernandez@gmail.com",
//       direccion: {
//         ciudad: "Bogotá",
//         departamento: "Cundinamarca",
//         barrio: "Chapinero",
//         detalles: "Calle 53 #25-30, Apto 502",
//       },
//     },
//     productos: [
//       { nombre: "Collar Premium para Perro", cantidad: 1, precio: 45000 },
//       {
//         nombre: "Comida para Perros Adultos (5kg)",
//         cantidad: 2,
//         precio: 75000,
//       },
//     ],
//     total: 195000,
//     metodoPago: "PSE",
//     estadoPago: "aprobado",
//     estadoPedido: "enviado",
//     envio: {
//       empresa: "Servientrega",
//       codigo: "SER78945612",
//       fechaEstimada: "2023-05-20",
//     },
//     observaciones: "Cliente frecuente, enviar muestra de snacks",
//     fechaCreacion: "2023-05-15",
//   },
//   {
//     id: "PED-002",
//     cliente: {
//       nombre: "Carlos Rodríguez",
//       telefono: "300-456-7890",
//       email: "carlos.rodriguez@hotmail.com",
//       direccion: {
//         ciudad: "Medellín",
//         departamento: "Antioquia",
//         barrio: "El Poblado",
//         detalles: "Carrera 43A #15-85, Casa 7",
//       },
//     },
//     productos: [
//       { nombre: "Cama para Gatos", cantidad: 1, precio: 120000 },
//       { nombre: "Rascador para Gatos", cantidad: 1, precio: 85000 },
//       { nombre: "Juguete Interactivo", cantidad: 2, precio: 35000 },
//     ],
//     total: 275000,
//     metodoPago: "Tarjeta de Crédito",
//     estadoPago: "aprobado",
//     estadoPedido: "entregado",
//     envio: {
//       empresa: "InterRapidísimo",
//       codigo: "IR45678923",
//       fechaEstimada: "2023-05-18",
//     },
//     observaciones: "",
//     fechaCreacion: "2023-05-14",
//   },
//   {
//     id: "PED-003",
//     cliente: {
//       nombre: "Ana García",
//       telefono: "320-123-4567",
//       email: "ana.garcia@yahoo.com",
//       direccion: {
//         ciudad: "Cali",
//         departamento: "Valle del Cauca",
//         barrio: "Granada",
//         detalles: "Avenida 9N #15-25",
//       },
//     },
//     productos: [
//       { nombre: "Transportadora para Perros", cantidad: 1, precio: 180000 },
//       { nombre: "Correa Retráctil", cantidad: 1, precio: 45000 },
//     ],
//     total: 225000,
//     metodoPago: "Contra Entrega",
//     estadoPago: "pendiente",
//     estadoPedido: "en preparación",
//     envio: {
//       empresa: "",
//       codigo: "",
//       fechaEstimada: "",
//     },
//     observaciones: "Cliente solicitó entrega en horario de la tarde",
//     fechaCreacion: "2023-05-12",
//   },
//   {
//     id: "PED-004",
//     cliente: {
//       nombre: "Juan Martínez",
//       telefono: "310-987-6543",
//       email: "juan.martinez@gmail.com",
//       direccion: {
//         ciudad: "Barranquilla",
//         departamento: "Atlántico",
//         barrio: "El Prado",
//         detalles: "Calle 76 #56-20",
//       },
//     },
//     productos: [
//       { nombre: "Comida para Gatos (3kg)", cantidad: 3, precio: 65000 },
//       { nombre: "Arena para Gatos (10kg)", cantidad: 2, precio: 40000 },
//       { nombre: "Juguete con Catnip", cantidad: 2, precio: 25000 },
//     ],
//     total: 285000,
//     metodoPago: "PSE",
//     estadoPago: "aprobado",
//     estadoPedido: "pendiente",
//     envio: {
//       empresa: "",
//       codigo: "",
//       fechaEstimada: "",
//     },
//     observaciones: "",
//     fechaCreacion: "2023-05-10",
//   },
//   {
//     id: "PED-005",
//     cliente: {
//       nombre: "Laura Sánchez",
//       telefono: "305-456-7890",
//       email: "laura.sanchez@outlook.com",
//       direccion: {
//         ciudad: "Bucaramanga",
//         departamento: "Santander",
//         barrio: "Cabecera",
//         detalles: "Carrera 35 #48-25, Apto 301",
//       },
//     },
//     productos: [
//       { nombre: "Shampoo para Perros", cantidad: 2, precio: 35000 },
//       { nombre: "Cepillo Deslanador", cantidad: 1, precio: 28000 },
//       { nombre: "Cortauñas para Mascotas", cantidad: 1, precio: 22000 },
//     ],
//     total: 120000,
//     metodoPago: "Tarjeta de Débito",
//     estadoPago: "aprobado",
//     estadoPedido: "enviado",
//     envio: {
//       empresa: "Coordinadora",
//       codigo: "COO12345678",
//       fechaEstimada: "2023-05-17",
//     },
//     observaciones: "",
//     fechaCreacion: "2023-05-08",
//   },
//   {
//     id: "PED-006",
//     cliente: {
//       nombre: "Miguel Torres",
//       telefono: "318-765-4321",
//       email: "miguel.torres@gmail.com",
//       direccion: {
//         ciudad: "Cartagena",
//         departamento: "Bolívar",
//         barrio: "Bocagrande",
//         detalles: "Avenida San Martín #5-45, Edificio Mar Azul, Apto 1202",
//       },
//     },
//     productos: [
//       { nombre: "Comedero Automático", cantidad: 1, precio: 250000 },
//       { nombre: "Bebedero Fuente", cantidad: 1, precio: 180000 },
//     ],
//     total: 430000,
//     metodoPago: "PSE",
//     estadoPago: "fallido",
//     estadoPedido: "cancelado",
//     envio: {
//       empresa: "",
//       codigo: "",
//       fechaEstimada: "",
//     },
//     observaciones:
//       "Cliente intentó pagar 3 veces sin éxito, se canceló el pedido",
//     fechaCreacion: "2023-05-05",
//   },
//   {
//     id: "PED-007",
//     cliente: {
//       nombre: "Sofía Martínez",
//       telefono: "311-234-5678",
//       email: "sofia.martinez@hotmail.com",
//       direccion: {
//         ciudad: "Pereira",
//         departamento: "Risaralda",
//         barrio: "Pinares",
//         detalles: "Calle 14 #23-56",
//       },
//     },
//     productos: [
//       { nombre: "Arnés para Perro", cantidad: 1, precio: 65000 },
//       { nombre: "Placa de Identificación", cantidad: 2, precio: 25000 },
//       { nombre: "Snacks Dentales", cantidad: 3, precio: 18000 },
//     ],
//     total: 169000,
//     metodoPago: "Contra Entrega",
//     estadoPago: "pendiente",
//     estadoPedido: "en preparación",
//     envio: {
//       empresa: "",
//       codigo: "",
//       fechaEstimada: "",
//     },
//     observaciones: "",
//     fechaCreacion: "2023-05-03",
//   },
//   {
//     id: "PED-008",
//     cliente: {
//       nombre: "Diego López",
//       telefono: "314-876-5432",
//       email: "diego.lopez@gmail.com",
//       direccion: {
//         ciudad: "Manizales",
//         departamento: "Caldas",
//         barrio: "Palermo",
//         detalles: "Carrera 23 #65-42",
//       },
//     },
//     productos: [
//       { nombre: "Casa para Perros", cantidad: 1, precio: 350000 },
//       { nombre: "Colchoneta Impermeable", cantidad: 1, precio: 85000 },
//       { nombre: "Plato Doble", cantidad: 1, precio: 45000 },
//     ],
//     total: 480000,
//     metodoPago: "Tarjeta de Crédito",
//     estadoPago: "aprobado",
//     estadoPedido: "entregado",
//     envio: {
//       empresa: "Servientrega",
//       codigo: "SER98765432",
//       fechaEstimada: "2023-05-08",
//     },
//     observaciones: "Cliente solicitó factura electrónica",
//     fechaCreacion: "2023-05-01",
//   },
// ];

// // Datos para gráficos
// const datosIngresosMensuales = [
//   { mes: "Ene", ingresos: 2500000 },
//   { mes: "Feb", ingresos: 3200000 },
//   { mes: "Mar", ingresos: 2800000 },
//   { mes: "Abr", ingresos: 3500000 },
//   { mes: "May", ingresos: 4200000 },
//   { mes: "Jun", ingresos: 3800000 },
// ];

// // Colores para el gráfico de estados
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// // Empresas de envío disponibles
// const empresasEnvio = [
//   "Servientrega",
//   "InterRapidísimo",
//   "Coordinadora",
//   "Envía",
//   "TCC",
//   "Deprisa",
//   "472",
// ];

// // Estados de pedido disponibles
// const estadosPedido = [
//   "pendiente",
//   "en preparación",
//   "enviado",
//   "entregado",
//   "cancelado",
// ];

// // Función para formatear moneda colombiana
// const formatearMoneda = (valor) => {
//   return new Intl.NumberFormat("es-CO", {
//     style: "currency",
//     currency: "COP",
//     minimumFractionDigits: 0,
//   }).format(valor);
// };

// export default function TransaccionesPage() {
//   const [pedidos, setPedidos] = useState(pedidosIniciales);
//   const [pedidoActual, setPedidoActual] = useState(null);
//   const [busqueda, setBusqueda] = useState("");
//   const [filtroEstado, setFiltroEstado] = useState([]);
//   const [filtroFecha, setFiltroFecha] = useState(null);
//   const [ordenarPor, setOrdenarPor] = useState("fecha-desc");
//   const [modalEnvio, setModalEnvio] = useState(false);
//   const [modalDetalles, setModalDetalles] = useState(false);
//   const [modalObservaciones, setModalObservaciones] = useState(false);
//   const [mesSeleccionado, setMesSeleccionado] = useState("May");

//   // Calcular datos para el gráfico de estados
//   const contarPedidosPorEstado = () => {
//     const conteo = {};
//     estadosPedido.forEach((estado) => {
//       conteo[estado] = pedidos.filter((p) => p.estadoPedido === estado).length;
//     });
//     return Object.keys(conteo).map((key) => ({
//       name: key.charAt(0).toUpperCase() + key.slice(1),
//       value: conteo[key],
//     }));
//   };

//   // Formatear fecha
//   const formatearFecha = (fechaStr) => {
//     if (!fechaStr) return "";
//     try {
//       const fecha = parseISO(fechaStr);
//       return format(fecha, "dd/MM/yyyy", { locale: es });
//     } catch (error) {
//       return fechaStr;
//     }
//   };

//   // Filtrar pedidos
//   const pedidosFiltrados = pedidos
//     .filter((pedido) => {
//       // Filtro de búsqueda
//       const coincideBusqueda =
//         pedido.id.toLowerCase().includes(busqueda.toLowerCase()) ||
//         pedido.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
//         pedido.cliente.email.toLowerCase().includes(busqueda.toLowerCase());

//       // Filtro de estado
//       const coincideEstado =
//         filtroEstado.length === 0 || filtroEstado.includes(pedido.estadoPedido);

//       // Filtro de fecha
//       const coincideFecha =
//         !filtroFecha || pedido.fechaCreacion === filtroFecha;

//       return coincideBusqueda && coincideEstado && coincideFecha;
//     })
//     .sort((a, b) => {
//       // Ordenamiento
//       if (ordenarPor === "fecha-asc") {
//         return new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
//       } else if (ordenarPor === "fecha-desc") {
//         return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
//       } else if (ordenarPor === "monto-asc") {
//         return a.total - b.total;
//       } else if (ordenarPor === "monto-desc") {
//         return b.total - a.total;
//       }
//       return 0;
//     });

//   // Calcular total de ventas
//   const totalVentas = pedidosFiltrados
//     .filter((p) => p.estadoPago === "aprobado")
//     .reduce((sum, p) => sum + p.total, 0);

//   // Abrir modal para marcar como enviado
//   const abrirModalEnvio = (pedido) => {
//     setPedidoActual(pedido);
//     setModalEnvio(true);
//   };

//   // Guardar información de envío
//   const guardarEnvio = (e) => {
//     e.preventDefault();
//     setPedidos(
//       pedidos.map((p) => {
//         if (p.id === pedidoActual.id) {
//           return {
//             ...p,
//             estadoPedido: "enviado",
//             envio: {
//               ...pedidoActual.envio,
//             },
//           };
//         }
//         return p;
//       }),
//     );
//     setModalEnvio(false);
//   };

//   // Abrir modal de detalles
//   const abrirDetalles = (pedido) => {
//     setPedidoActual(pedido);
//     setModalDetalles(true);
//   };

//   // Abrir modal de observaciones
//   const abrirObservaciones = (pedido) => {
//     setPedidoActual(pedido);
//     setModalObservaciones(true);
//   };

//   // Guardar observaciones
//   const guardarObservaciones = (e) => {
//     e.preventDefault();
//     setPedidos(
//       pedidos.map((p) => {
//         if (p.id === pedidoActual.id) {
//           return {
//             ...p,
//             observaciones: pedidoActual.observaciones,
//           };
//         }
//         return p;
//       }),
//     );
//     setModalObservaciones(false);
//   };

//   // Cambiar estado del pedido
//   const cambiarEstadoPedido = (pedido, nuevoEstado) => {
//     setPedidos(
//       pedidos.map((p) => {
//         if (p.id === pedido.id) {
//           return {
//             ...p,
//             estadoPedido: nuevoEstado,
//           };
//         }
//         return p;
//       }),
//     );
//   };

//   // Cambiar empresa de envío
//   const cambiarEmpresaEnvio = (pedido, empresa) => {
//     setPedidos(
//       pedidos.map((p) => {
//         if (p.id === pedido.id) {
//           return {
//             ...p,
//             envio: {
//               ...p.envio,
//               empresa,
//             },
//           };
//         }
//         return p;
//       }),
//     );
//   };

//   // Cambiar código de seguimiento
//   const cambiarCodigoSeguimiento = (pedido, codigo) => {
//     setPedidos(
//       pedidos.map((p) => {
//         if (p.id === pedido.id) {
//           return {
//             ...p,
//             envio: {
//               ...p.envio,
//               codigo,
//             },
//           };
//         }
//         return p;
//       }),
//     );
//   };

//   // Enviar confirmación (simulado)
//   const enviarConfirmacion = (tipo, pedido) => {
//     alert(`Enviando confirmación por ${tipo} a ${pedido.cliente.nombre}`);
//   };

//   // Exportar a Excel (simulado)
//   const exportarExcel = () => {
//     alert("Exportando pedidos a Excel...");
//   };

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold tracking-tight">
//           Gestión de Pedidos
//         </h1>
//         <p className="text-muted-foreground">
//           Administra y da seguimiento a los pedidos de tus clientes
//         </p>
//       </div>

//       <Tabs defaultValue="pedidos" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
//           <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
//         </TabsList>

//         <TabsContent value="pedidos" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-3">
//             <Card>
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-2">
//                   <Package className="text-muted-foreground h-5 w-5" />
//                   <div className="text-muted-foreground text-sm font-medium">
//                     Total de Pedidos
//                   </div>
//                 </div>
//                 <div className="mt-1 text-2xl font-bold">
//                   {pedidosFiltrados.length}
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-2">
//                   <Truck className="text-muted-foreground h-5 w-5" />
//                   <div className="text-muted-foreground text-sm font-medium">
//                     Pedidos Enviados
//                   </div>
//                 </div>
//                 <div className="mt-1 text-2xl font-bold">
//                   {
//                     pedidosFiltrados.filter((p) => p.estadoPedido === "enviado")
//                       .length
//                   }
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-2">
//                   <div className="text-muted-foreground text-sm font-medium">
//                     Total Ventas
//                   </div>
//                 </div>
//                 <div className="mt-1 text-2xl font-bold">
//                   {formatearMoneda(totalVentas)}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex items-center gap-2">
//               <Search className="text-muted-foreground h-4 w-4" />
//               <Input
//                 placeholder="Buscar por cliente, correo o ID..."
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
//                     Filtrar por Estado
//                     {filtroEstado.length > 0 && (
//                       <Badge
//                         variant="secondary"
//                         className="ml-2 rounded-sm px-1"
//                       >
//                         {filtroEstado.length}
//                       </Badge>
//                     )}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-[200px]">
//                   {estadosPedido.map((estado) => (
//                     <DropdownMenuCheckboxItem
//                       key={estado}
//                       checked={filtroEstado.includes(estado)}
//                       onCheckedChange={(checked) => {
//                         if (checked) {
//                           setFiltroEstado([...filtroEstado, estado]);
//                         } else {
//                           setFiltroEstado(
//                             filtroEstado.filter((e) => e !== estado),
//                           );
//                         }
//                       }}
//                     >
//                       {estado.charAt(0).toUpperCase() + estado.slice(1)}
//                     </DropdownMenuCheckboxItem>
//                   ))}
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
//                   <DropdownMenuItem onClick={() => setOrdenarPor("monto-desc")}>
//                     Mayor monto primero
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setOrdenarPor("monto-asc")}>
//                     Menor monto primero
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   setBusqueda("");
//                   setFiltroEstado([]);
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
//             </div>
//           </div>

//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>ID</TableHead>
//                   <TableHead>Cliente</TableHead>
//                   <TableHead>Fecha</TableHead>
//                   <TableHead>Total</TableHead>
//                   <TableHead>Estado Pago</TableHead>
//                   <TableHead>Estado Pedido</TableHead>
//                   <TableHead>Envío</TableHead>
//                   <TableHead className="text-right">Acciones</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {pedidosFiltrados.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={8} className="h-24 text-center">
//                       No se encontraron pedidos.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   pedidosFiltrados.map((pedido) => (
//                     <TableRow key={pedido.id} className="group">
//                       <TableCell className="font-medium">{pedido.id}</TableCell>
//                       <TableCell>
//                         <div className="flex flex-col">
//                           <span className="font-medium">
//                             {pedido.cliente.nombre}
//                           </span>
//                           <span className="text-muted-foreground text-xs">
//                             {pedido.cliente.email}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         {formatearFecha(pedido.fechaCreacion)}
//                       </TableCell>
//                       <TableCell>{formatearMoneda(pedido.total)}</TableCell>
//                       <TableCell>
//                         <Badge
//                           variant={
//                             pedido.estadoPago === "aprobado"
//                               ? "default"
//                               : pedido.estadoPago === "pendiente"
//                                 ? "outline"
//                                 : "destructive"
//                           }
//                         >
//                           {pedido.estadoPago === "aprobado"
//                             ? "Aprobado"
//                             : pedido.estadoPago === "pendiente"
//                               ? "Pendiente"
//                               : "Fallido"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <Select
//                           value={pedido.estadoPedido}
//                           onValueChange={(value) =>
//                             cambiarEstadoPedido(pedido, value)
//                           }
//                           disabled={pedido.estadoPedido === "cancelado"}
//                         >
//                           <SelectTrigger className="h-8 w-[140px]">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {estadosPedido.map((estado) => (
//                               <SelectItem key={estado} value={estado}>
//                                 {estado.charAt(0).toUpperCase() +
//                                   estado.slice(1)}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </TableCell>
//                       <TableCell>
//                         {pedido.envio.empresa ? (
//                           <div className="flex flex-col">
//                             <span className="font-medium">
//                               {pedido.envio.empresa}
//                             </span>
//                             <span className="text-muted-foreground text-xs">
//                               {pedido.envio.codigo || "Sin código"}
//                             </span>
//                           </div>
//                         ) : (
//                           <span className="text-muted-foreground">
//                             No enviado
//                           </span>
//                         )}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => abrirDetalles(pedido)}
//                             title="Ver detalles"
//                           >
//                             <Search className="h-4 w-4" />
//                           </Button>
//                           {pedido.estadoPedido !== "enviado" &&
//                             pedido.estadoPedido !== "entregado" &&
//                             pedido.estadoPedido !== "cancelado" && (
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => abrirModalEnvio(pedido)}
//                                 title="Marcar como enviado"
//                               >
//                                 <Truck className="h-4 w-4" />
//                               </Button>
//                             )}
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="icon">
//                                 <ChevronDown className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuItem
//                                 onClick={() => abrirObservaciones(pedido)}
//                               >
//                                 Editar observaciones
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 onClick={() =>
//                                   enviarConfirmacion("WhatsApp", pedido)
//                                 }
//                               >
//                                 Enviar confirmación por WhatsApp
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 onClick={() =>
//                                   enviarConfirmacion("correo", pedido)
//                                 }
//                               >
//                                 Enviar confirmación por correo
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
//                 <CardTitle>Ingresos Mensuales</CardTitle>
//                 <CardDescription>Ventas totales por mes</CardDescription>
//                 <Select
//                   value={mesSeleccionado}
//                   onValueChange={setMesSeleccionado}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Seleccionar mes" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {datosIngresosMensuales.map((item) => (
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
//                     data={datosIngresosMensuales}
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
//                     <Bar dataKey="ingresos" fill="#8884d8" name="Ingresos" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Distribución de Pedidos</CardTitle>
//                 <CardDescription>Pedidos por estado</CardDescription>
//               </CardHeader>
//               <CardContent className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={contarPedidosPorEstado()}
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
//                       {contarPedidosPorEstado().map((entry, index) => (
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
//               <CardTitle>Resumen de Ventas</CardTitle>
//               <CardDescription>Datos acumulados del mes actual</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid gap-4 md:grid-cols-3">
//                 <div className="space-y-2">
//                   <div className="text-muted-foreground text-sm font-medium">
//                     Total Pedidos
//                   </div>
//                   <div className="text-3xl font-bold">{pedidos.length}</div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="text-muted-foreground text-sm font-medium">
//                     Pedidos Completados
//                   </div>
//                   <div className="text-3xl font-bold">
//                     {
//                       pedidos.filter((p) => p.estadoPedido === "entregado")
//                         .length
//                     }
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="text-muted-foreground text-sm font-medium">
//                     Ingresos Totales
//                   </div>
//                   <div className="text-3xl font-bold">
//                     {formatearMoneda(
//                       pedidos
//                         .filter((p) => p.estadoPago === "aprobado")
//                         .reduce((sum, p) => sum + p.total, 0),
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Modal para marcar como enviado */}
//       <Dialog open={modalEnvio} onOpenChange={setModalEnvio}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Marcar pedido como enviado</DialogTitle>
//             <DialogDescription>
//               Ingrese los detalles del envío para el pedido {pedidoActual?.id}
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={guardarEnvio}>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="empresa" className="text-right">
//                   Empresa de Envío
//                 </Label>
//                 <Select
//                   value={pedidoActual?.envio.empresa || ""}
//                   onValueChange={(value) =>
//                     setPedidoActual({
//                       ...pedidoActual,
//                       envio: { ...pedidoActual.envio, empresa: value },
//                     })
//                   }
//                   required
//                 >
//                   <SelectTrigger className="col-span-3">
//                     <SelectValue placeholder="Seleccionar empresa" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {empresasEnvio.map((empresa) => (
//                       <SelectItem key={empresa} value={empresa}>
//                         {empresa}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="codigo" className="text-right">
//                   Código de Seguimiento
//                 </Label>
//                 <Input
//                   id="codigo"
//                   value={pedidoActual?.envio.codigo || ""}
//                   onChange={(e) =>
//                     setPedidoActual({
//                       ...pedidoActual,
//                       envio: { ...pedidoActual.envio, codigo: e.target.value },
//                     })
//                   }
//                   className="col-span-3"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="fechaEstimada" className="text-right">
//                   Fecha Estimada
//                 </Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className={`col-span-3 justify-start text-left font-normal ${
//                         !pedidoActual?.envio.fechaEstimada &&
//                         "text-muted-foreground"
//                       }`}
//                     >
//                       <Calendar className="mr-2 h-4 w-4" />
//                       {pedidoActual?.envio.fechaEstimada
//                         ? formatearFecha(pedidoActual.envio.fechaEstimada)
//                         : "Seleccionar fecha"}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <CalendarComponent
//                       mode="single"
//                       selected={
//                         pedidoActual?.envio.fechaEstimada
//                           ? new Date(pedidoActual.envio.fechaEstimada)
//                           : undefined
//                       }
//                       onSelect={(date) => {
//                         if (date) {
//                           setPedidoActual({
//                             ...pedidoActual,
//                             envio: {
//                               ...pedidoActual.envio,
//                               fechaEstimada: format(date, "yyyy-MM-dd"),
//                             },
//                           });
//                         }
//                       }}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="submit">Guardar y Marcar como Enviado</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Modal para ver detalles del pedido */}
//       <Dialog open={modalDetalles} onOpenChange={setModalDetalles}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>Detalles del Pedido {pedidoActual?.id}</DialogTitle>
//             <DialogDescription>
//               Información completa del pedido realizado el{" "}
//               {pedidoActual && formatearFecha(pedidoActual.fechaCreacion)}
//             </DialogDescription>
//           </DialogHeader>

//           {pedidoActual && (
//             <div className="space-y-4">
//               <div>
//                 <h3 className="mb-2 font-medium">Información del Cliente</h3>
//                 <div className="rounded-md border p-3">
//                   <div className="grid gap-1">
//                     <div className="grid grid-cols-3">
//                       <span className="text-sm font-medium">Nombre:</span>
//                       <span className="col-span-2 text-sm">
//                         {pedidoActual.cliente.nombre}
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-3">
//                       <span className="text-sm font-medium">Teléfono:</span>
//                       <span className="col-span-2 text-sm">
//                         {pedidoActual.cliente.telefono}
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-3">
//                       <span className="text-sm font-medium">Email:</span>
//                       <span className="col-span-2 text-sm">
//                         {pedidoActual.cliente.email}
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-3">
//                       <span className="text-sm font-medium">Dirección:</span>
//                       <span className="col-span-2 text-sm">
//                         {pedidoActual.cliente.direccion.detalles},{" "}
//                         {pedidoActual.cliente.direccion.barrio},{" "}
//                         {pedidoActual.cliente.direccion.ciudad},{" "}
//                         {pedidoActual.cliente.direccion.departamento}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="mb-2 font-medium">Productos</h3>
//                 <div className="rounded-md border">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Producto</TableHead>
//                         <TableHead className="text-right">Cantidad</TableHead>
//                         <TableHead className="text-right">Precio</TableHead>
//                         <TableHead className="text-right">Subtotal</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {pedidoActual.productos.map((producto, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{producto.nombre}</TableCell>
//                           <TableCell className="text-right">
//                             {producto.cantidad}
//                           </TableCell>
//                           <TableCell className="text-right">
//                             {formatearMoneda(producto.precio)}
//                           </TableCell>
//                           <TableCell className="text-right">
//                             {formatearMoneda(
//                               producto.precio * producto.cantidad,
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                       <TableRow>
//                         <TableCell
//                           colSpan={3}
//                           className="text-right font-medium"
//                         >
//                           Total
//                         </TableCell>
//                         <TableCell className="text-right font-bold">
//                           {formatearMoneda(pedidoActual.total)}
//                         </TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <h3 className="mb-2 font-medium">Información de Pago</h3>
//                   <div className="rounded-md border p-3">
//                     <div className="grid gap-1">
//                       <div className="grid grid-cols-3">
//                         <span className="text-sm font-medium">Método:</span>
//                         <span className="col-span-2 text-sm">
//                           {pedidoActual.metodoPago}
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-3">
//                         <span className="text-sm font-medium">Estado:</span>
//                         <span className="col-span-2 text-sm">
//                           <Badge
//                             variant={
//                               pedidoActual.estadoPago === "aprobado"
//                                 ? "default"
//                                 : pedidoActual.estadoPago === "pendiente"
//                                   ? "outline"
//                                   : "destructive"
//                             }
//                           >
//                             {pedidoActual.estadoPago === "aprobado"
//                               ? "Aprobado"
//                               : pedidoActual.estadoPago === "pendiente"
//                                 ? "Pendiente"
//                                 : "Fallido"}
//                           </Badge>
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="mb-2 font-medium">Información de Envío</h3>
//                   <div className="rounded-md border p-3">
//                     <div className="grid gap-1">
//                       <div className="grid grid-cols-3">
//                         <span className="text-sm font-medium">Estado:</span>
//                         <span className="col-span-2 text-sm">
//                           <Badge
//                             variant={
//                               pedidoActual.estadoPedido === "entregado"
//                                 ? "default"
//                                 : pedidoActual.estadoPedido === "cancelado"
//                                   ? "destructive"
//                                   : "secondary"
//                             }
//                           >
//                             {pedidoActual.estadoPedido.charAt(0).toUpperCase() +
//                               pedidoActual.estadoPedido.slice(1)}
//                           </Badge>
//                         </span>
//                       </div>
//                       {pedidoActual.envio.empresa && (
//                         <>
//                           <div className="grid grid-cols-3">
//                             <span className="text-sm font-medium">
//                               Empresa:
//                             </span>
//                             <span className="col-span-2 text-sm">
//                               {pedidoActual.envio.empresa}
//                             </span>
//                           </div>
//                           <div className="grid grid-cols-3">
//                             <span className="text-sm font-medium">Código:</span>
//                             <span className="col-span-2 text-sm">
//                               {pedidoActual.envio.codigo}
//                             </span>
//                           </div>
//                           <div className="grid grid-cols-3">
//                             <span className="text-sm font-medium">
//                               Fecha estimada:
//                             </span>
//                             <span className="col-span-2 text-sm">
//                               {formatearFecha(pedidoActual.envio.fechaEstimada)}
//                             </span>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="mb-2 font-medium">Observaciones</h3>
//                 <div className="rounded-md border p-3">
//                   <p className="text-sm">
//                     {pedidoActual.observaciones ||
//                       "No hay observaciones para este pedido."}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex justify-between">
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => enviarConfirmacion("WhatsApp", pedidoActual)}
//                     className="gap-2"
//                   >
//                     <MessageSquare className="h-4 w-4" />
//                     Enviar por WhatsApp
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => enviarConfirmacion("correo", pedidoActual)}
//                     className="gap-2"
//                   >
//                     <Mail className="h-4 w-4" />
//                     Enviar por Correo
//                   </Button>
//                 </div>
//                 <Button
//                   variant="default"
//                   onClick={() => setModalDetalles(false)}
//                 >
//                   Cerrar
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Modal para editar observaciones */}
//       <Dialog open={modalObservaciones} onOpenChange={setModalObservaciones}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Editar Observaciones</DialogTitle>
//             <DialogDescription>
//               Agregue o modifique las observaciones internas para el pedido{" "}
//               {pedidoActual?.id}
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={guardarObservaciones}>
//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="observaciones">Observaciones</Label>
//                 <Textarea
//                   id="observaciones"
//                   value={pedidoActual?.observaciones || ""}
//                   onChange={(e) =>
//                     setPedidoActual({
//                       ...pedidoActual,
//                       observaciones: e.target.value,
//                     })
//                   }
//                   rows={5}
//                   placeholder="Ingrese observaciones internas sobre este pedido..."
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="submit">Guardar Observaciones</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
