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
//   Download,
//   Filter,
//   Key,
//   MoreHorizontal,
//   Pencil,
//   Search,
//   Trash2,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
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
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
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

// // Datos ficticios de administradores
// const administradoresIniciales = [
//   {
//     id: 1,
//     nombre: "Ana García",
//     correo: "ana.garcia@ejemplo.com",
//     telefono: "315-789-4562",
//     rol: "Administrador",
//     permisos: ["mascotas", "productos", "administradores", "transacciones"],
//     activo: true,
//     fechaCreacion: "2023-01-15",
//     ultimoAcceso: "2023-05-15T14:30:00",
//     avatar: "/placeholder.svg?height=80&width=80",
//     notas: "Administradora principal del sistema.",
//     acciones: 145,
//   },
//   {
//     id: 2,
//     nombre: "Carlos Rodríguez",
//     correo: "carlos.rodriguez@ejemplo.com",
//     telefono: "300-456-7890",
//     rol: "Editor",
//     permisos: ["mascotas", "productos"],
//     activo: true,
//     fechaCreacion: "2023-02-20",
//     ultimoAcceso: "2023-05-14T09:15:00",
//     avatar: "/placeholder.svg?height=80&width=80",
//     notas: "Encargado de actualizar productos y mascotas.",
//     acciones: 87,
//   },
//   {
//     id: 3,
//     nombre: "María López",
//     correo: "maria.lopez@ejemplo.com",
//     telefono: "320-123-4567",
//     rol: "Moderador",
//     permisos: ["mascotas"],
//     activo: false,
//     fechaCreacion: "2023-03-10",
//     ultimoAcceso: "2023-04-28T16:45:00",
//     avatar: "/placeholder.svg?height=80&width=80",
//     notas: "Cuenta temporalmente desactivada por vacaciones.",
//     acciones: 32,
//   },
//   {
//     id: 4,
//     nombre: "Juan Martínez",
//     correo: "juan.martinez@ejemplo.com",
//     telefono: "310-987-6543",
//     rol: "Administrador",
//     permisos: ["mascotas", "productos", "administradores", "transacciones"],
//     activo: true,
//     fechaCreacion: "2023-01-05",
//     ultimoAcceso: "2023-05-15T11:20:00",
//     avatar: "/placeholder.svg?height=80&width=80",
//     notas: "Administrador técnico del sistema.",
//     acciones: 156,
//   },
//   {
//     id: 5,
//     nombre: "Laura Sánchez",
//     correo: "laura.sanchez@ejemplo.com",
//     telefono: "305-456-7890",
//     rol: "Editor",
//     permisos: ["productos", "transacciones"],
//     activo: true,
//     fechaCreacion: "2023-04-12",
//     ultimoAcceso: "2023-05-13T10:05:00",
//     avatar: "/placeholder.svg?height=80&width=80",
//     notas: "Encargada de gestionar ventas y productos.",
//     acciones: 64,
//   },
//   {
//     id: 6,
//     nombre: "Pedro Gómez",
//     correo: "pedro.gomez@ejemplo.com",
//     telefono: "318-765-4321",
//     rol: "Visualizador",
//     permisos: ["mascotas", "productos"],
//     activo: true,
//     fechaCreacion: "2023-05-01",
//     ultimoAcceso: "2023-05-10T15:30:00",
//     avatar: "/placeholder.svg?height=80&width=80",
//     notas: "Usuario con permisos de solo lectura.",
//     acciones: 28,
//   },
//   {
//     id: 7,
//     nombre: "Sofía Martínez",
//     correo: "sofia.martinez@ejemplo.com",
//     telefono: "311-234-5678",
//     rol: "Editor",
//     permisos: ["mascotas"],
//     activo: true,
//     fechaCreacion: "2023-03-15",
//     ultimoAcceso: "2023-05-12T09:45:00",
//     avatar: "/placeholder.svg?height=80&width=80",
//     notas: "Encargada de la sección de mascotas.",
//     acciones: 76,
//   },
// ];

// // Datos para gráficos
// const datosActividadMensual = [
//   { mes: "Ene", acciones: 320 },
//   { mes: "Feb", acciones: 280 },
//   { mes: "Mar", acciones: 310 },
//   { mes: "Abr", acciones: 340 },
//   { mes: "May", acciones: 380 },
//   { mes: "Jun", acciones: 0 },
// ];

// // Colores para el gráfico de roles
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// // Roles disponibles
// const roles = ["Administrador", "Editor", "Moderador", "Visualizador"];

// // Permisos disponibles
// const permisos = [
//   { id: "mascotas", nombre: "Gestión de Mascotas" },
//   { id: "productos", nombre: "Gestión de Productos" },
//   { id: "administradores", nombre: "Gestión de Administradores" },
//   { id: "transacciones", nombre: "Gestión de Transacciones" },
// ];

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

// // Formatear fecha y hora
// const formatearFechaHora = (fechaStr) => {
//   if (!fechaStr) return "";
//   try {
//     const fecha = parseISO(fechaStr);
//     return format(fecha, "dd/MM/yyyy HH:mm", { locale: es });
//   } catch (error) {
//     return fechaStr;
//   }
// };

// export default function AdministradoresPage() {
//   const [administradores, setAdministradores] = useState(
//     administradoresIniciales,
//   );
//   const [administradorActual, setAdministradorActual] = useState(null);
//   const [busqueda, setBusqueda] = useState("");
//   const [filtroRol, setFiltroRol] = useState([]);
//   const [filtroActivo, setFiltroActivo] = useState(null);
//   const [filtroFecha, setFiltroFecha] = useState(null);
//   const [ordenarPor, setOrdenarPor] = useState("fecha-desc");
//   const [dialogoAbierto, setDialogoAbierto] = useState(false);
//   const [dialogoEliminar, setDialogoEliminar] = useState(false);
//   const [dialogoDetalles, setDialogoDetalles] = useState(false);
//   const [dialogoResetPassword, setDialogoResetPassword] = useState(false);
//   const [mesSeleccionado, setMesSeleccionado] = useState("May");

//   // Calcular datos para el gráfico de roles
//   const contarAdministradoresPorRol = () => {
//     const conteo = {};
//     administradores.forEach((admin) => {
//       conteo[admin.rol] = (conteo[admin.rol] || 0) + 1;
//     });
//     return Object.keys(conteo).map((key) => ({
//       name: key,
//       value: conteo[key],
//     }));
//   };

//   // Calcular datos para el gráfico de actividad por rol
//   const actividadPorRol = () => {
//     const conteo = {};
//     administradores.forEach((admin) => {
//       conteo[admin.rol] = (conteo[admin.rol] || 0) + admin.acciones;
//     });
//     return Object.keys(conteo).map((key) => ({
//       name: key,
//       value: conteo[key],
//     }));
//   };

//   // Filtrar administradores
//   const administradoresFiltrados = administradores
//     .filter((admin) => {
//       // Filtro de búsqueda
//       const coincideBusqueda =
//         admin.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
//         admin.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
//         admin.rol.toLowerCase().includes(busqueda.toLowerCase());

//       // Filtro de rol
//       const coincideRol =
//         filtroRol.length === 0 || filtroRol.includes(admin.rol);

//       // Filtro de estado activo
//       const coincideActivo =
//         filtroActivo === null ||
//         (filtroActivo === "activo" && admin.activo) ||
//         (filtroActivo === "inactivo" && !admin.activo);

//       // Filtro de fecha
//       const coincideFecha = !filtroFecha || admin.fechaCreacion === filtroFecha;

//       return coincideBusqueda && coincideRol && coincideActivo && coincideFecha;
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
//       } else if (ordenarPor === "actividad-desc") {
//         return b.acciones - a.acciones;
//       }
//       return 0;
//     });

//   // Abrir formulario para nuevo administrador
//   const abrirNuevoAdministrador = () => {
//     setAdministradorActual({
//       id: administradores.length + 1,
//       nombre: "",
//       correo: "",
//       telefono: "",
//       rol: "Editor",
//       permisos: ["mascotas"],
//       activo: true,
//       fechaCreacion: format(new Date(), "yyyy-MM-dd"),
//       ultimoAcceso: null,
//       avatar: "/placeholder.svg?height=80&width=80",
//       notas: "",
//       acciones: 0,
//     });
//     setDialogoAbierto(true);
//   };

//   // Abrir formulario para editar administrador
//   const editarAdministrador = (admin) => {
//     setAdministradorActual(admin);
//     setDialogoAbierto(true);
//   };

//   // Abrir detalles de administrador
//   const verDetallesAdministrador = (admin) => {
//     setAdministradorActual(admin);
//     setDialogoDetalles(true);
//   };

//   // Confirmar eliminación de administrador
//   const confirmarEliminar = (admin) => {
//     setAdministradorActual(admin);
//     setDialogoEliminar(true);
//   };

//   // Eliminar administrador
//   const eliminarAdministrador = () => {
//     setAdministradores(
//       administradores.filter((a) => a.id !== administradorActual.id),
//     );
//     setDialogoEliminar(false);
//   };

//   // Guardar administrador (nuevo o editado)
//   const guardarAdministrador = (e) => {
//     e.preventDefault();
//     if (administradores.find((a) => a.id === administradorActual.id)) {
//       // Actualizar administrador existente
//       setAdministradores(
//         administradores.map((a) =>
//           a.id === administradorActual.id ? administradorActual : a,
//         ),
//       );
//     } else {
//       // Agregar nuevo administrador
//       setAdministradores([...administradores, administradorActual]);
//     }
//     setDialogoAbierto(false);
//   };

//   // Cambiar estado activo/inactivo
//   const cambiarEstado = (admin) => {
//     const actualizado = { ...admin, activo: !admin.activo };
//     setAdministradores(
//       administradores.map((a) => (a.id === admin.id ? actualizado : a)),
//     );
//   };

//   // Abrir diálogo para resetear contraseña
//   const abrirResetPassword = (admin) => {
//     setAdministradorActual(admin);
//     setDialogoResetPassword(true);
//   };

//   // Resetear contraseña (simulado)
//   const resetearPassword = () => {
//     alert(
//       `Se ha enviado un correo a ${administradorActual.correo} con instrucciones para restablecer la contraseña.`,
//     );
//     setDialogoResetPassword(false);
//   };

//   // Exportar a Excel (simulado)
//   const exportarExcel = () => {
//     alert("Exportando administradores a Excel...");
//   };

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold tracking-tight">
//           Gestión de Administradores
//         </h1>
//         <p className="text-muted-foreground">
//           Administra los usuarios con acceso al panel de control
//         </p>
//       </div>

//       <Tabs defaultValue="administradores" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="administradores">Administradores</TabsTrigger>
//           <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
//         </TabsList>

//         <TabsContent value="administradores" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-3">
//             <Card>
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-2">
//                   <div className="text-muted-foreground text-sm font-medium">
//                     Total de Administradores
//                   </div>
//                 </div>
//                 <div className="mt-1 text-2xl font-bold">
//                   {administradores.length}
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-2">
//                   <div className="text-muted-foreground text-sm font-medium">
//                     Administradores Activos
//                   </div>
//                 </div>
//                 <div className="mt-1 text-2xl font-bold">
//                   {administradores.filter((a) => a.activo).length}
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-2">
//                   <div className="text-muted-foreground text-sm font-medium">
//                     Acciones Realizadas
//                   </div>
//                 </div>
//                 <div className="mt-1 text-2xl font-bold">
//                   {administradores.reduce(
//                     (total, admin) => total + admin.acciones,
//                     0,
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex items-center gap-2">
//               <Search className="text-muted-foreground h-4 w-4" />
//               <Input
//                 placeholder="Buscar por nombre, correo o rol..."
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
//                     {(filtroRol.length > 0 || filtroActivo) && (
//                       <Badge
//                         variant="secondary"
//                         className="ml-2 rounded-sm px-1"
//                       >
//                         {filtroRol.length + (filtroActivo ? 1 : 0)}
//                       </Badge>
//                     )}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-[200px]">
//                   <DropdownMenuLabel>Rol</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   {roles.map((rol) => (
//                     <DropdownMenuCheckboxItem
//                       key={rol}
//                       checked={filtroRol.includes(rol)}
//                       onCheckedChange={(checked) => {
//                         if (checked) {
//                           setFiltroRol([...filtroRol, rol]);
//                         } else {
//                           setFiltroRol(filtroRol.filter((r) => r !== rol));
//                         }
//                       }}
//                     >
//                       {rol}
//                     </DropdownMenuCheckboxItem>
//                   ))}
//                   <DropdownMenuSeparator />
//                   <DropdownMenuLabel>Estado</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuCheckboxItem
//                     checked={filtroActivo === "activo"}
//                     onCheckedChange={(checked) =>
//                       setFiltroActivo(checked ? "activo" : null)
//                     }
//                   >
//                     Activo
//                   </DropdownMenuCheckboxItem>
//                   <DropdownMenuCheckboxItem
//                     checked={filtroActivo === "inactivo"}
//                     onCheckedChange={(checked) =>
//                       setFiltroActivo(checked ? "inactivo" : null)
//                     }
//                   >
//                     Inactivo
//                   </DropdownMenuCheckboxItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuLabel>Fecha de Creación</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <Select value={filtroFecha} onValueChange={setFiltroFecha}>
//                     <SelectTrigger className="w-[180px]">
//                       <SelectValue placeholder="Selecciona una fecha" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {administradoresIniciales.map((admin) => (
//                         <SelectItem
//                           key={admin.fechaCreacion}
//                           value={admin.fechaCreacion}
//                         >
//                           {formatearFecha(admin.fechaCreacion)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//               <Button variant="outline" size="sm" onClick={exportarExcel}>
//                 <Download className="mr-2 h-4 w-4" />
//                 Exportar a Excel
//               </Button>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[100px]">Nombre</TableHead>
//                   <TableHead>Correo</TableHead>
//                   <TableHead>Teléfono</TableHead>
//                   <TableHead>Rol</TableHead>
//                   <TableHead>Estado</TableHead>
//                   <TableHead>Acciones</TableHead>
//                   <TableHead>Último Acceso</TableHead>
//                   <TableHead className="w-[100px]">Acciones</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {administradoresFiltrados.map((admin) => (
//                   <TableRow key={admin.id}>
//                     <TableCell className="font-medium">
//                       {admin.nombre}
//                     </TableCell>
//                     <TableCell>{admin.correo}</TableCell>
//                     <TableCell>{admin.telefono}</TableCell>
//                     <TableCell>{admin.rol}</TableCell>
//                     <TableCell>
//                       <Switch
//                         checked={admin.activo}
//                         onCheckedChange={() => cambiarEstado(admin)}
//                       />
//                     </TableCell>
//                     <TableCell>{admin.acciones}</TableCell>
//                     <TableCell>
//                       {formatearFechaHora(admin.ultimoAcceso)}
//                     </TableCell>
//                     <TableCell className="flex items-center justify-end gap-2">
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={() => editarAdministrador(admin)}
//                       >
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={() => verDetallesAdministrador(admin)}
//                       >
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={() => confirmarEliminar(admin)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={() => abrirResetPassword(admin)}
//                       >
//                         <Key className="h-4 w-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>

//         <TabsContent value="estadisticas" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Administradores por Rol</CardTitle>
//                 <CardDescription>
//                   Distribución de administradores según su rol
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="p-4">
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={contarAdministradoresPorRol()}
//                       cx={150}
//                       cy={120}
//                       labelLine={false}
//                       label={({ name, percent }) =>
//                         `${name} ${(percent * 100).toFixed(0)}%`
//                       }
//                       outerRadius={80}
//                       fill="#8884D8"
//                     >
//                       {contarAdministradoresPorRol().map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Actividad por Rol</CardTitle>
//                 <CardDescription>
//                   Acciones realizadas por cada rol
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="p-4">
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={actividadPorRol()}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="value" fill="#8884D8" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* Dialogo para nuevo/editar administrador */}
//       <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>
//               {administradorActual
//                 ? "Editar Administrador"
//                 : "Nuevo Administrador"}
//             </DialogTitle>
//             <DialogDescription>
//               {administradorActual
//                 ? "Edita la información del administrador."
//                 : "Agrega un nuevo administrador."}
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={guardarAdministrador}>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="nombre" className="text-right">
//                   Nombre
//                 </Label>
//                 <Input
//                   id="nombre"
//                   value={administradorActual?.nombre || ""}
//                   onChange={(e) =>
//                     setAdministradorActual({
//                       ...administradorActual,
//                       nombre: e.target.value,
//                     })
//                   }
//                   className="col-span-3"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="correo" className="text-right">
//                   Correo
//                 </Label>
//                 <Input
//                   id="correo"
//                   value={administradorActual?.correo || ""}
//                   onChange={(e) =>
//                     setAdministradorActual({
//                       ...administradorActual,
//                       correo: e.target.value,
//                     })
//                   }
//                   className="col-span-3"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="telefono" className="text-right">
//                   Teléfono
//                 </Label>
//                 <Input
//                   id="telefono"
//                   value={administradorActual?.telefono || ""}
//                   onChange={(e) =>
//                     setAdministradorActual({
//                       ...administradorActual,
//                       telefono: e.target.value,
//                     })
//                   }
//                   className="col-span-3"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="rol" className="text-right">
//                   Rol
//                 </Label>
//                 <Select
//                   value={administradorActual?.rol || "Editor"}
//                   onValueChange={(value) =>
//                     setAdministradorActual({
//                       ...administradorActual,
//                       rol: value,
//                     })
//                   }
//                   className="col-span-3"
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Selecciona un rol" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {roles.map((rol) => (
//                       <SelectItem key={rol} value={rol}>
//                         {rol}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="permisos" className="text-right">
//                   Permisos
//                 </Label>
//                 <Select
//                   multiple
//                   value={administradorActual?.permisos || []}
//                   onValueChange={(value) =>
//                     setAdministradorActual({
//                       ...administradorActual,
//                       permisos: value,
//                     })
//                   }
//                   className="col-span-3"
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Selecciona permisos" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {permisos.map((permiso) => (
//                       <SelectItem key={permiso.id} value={permiso.id}>
//                         {permiso.nombre}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="notas" className="text-right">
//                   Notas
//                 </Label>
//                 <Textarea
//                   id="notas"
//                   value={administradorActual?.notas || ""}
//                   onChange={(e) =>
//                     setAdministradorActual({
//                       ...administradorActual,
//                       notas: e.target.value,
//                     })
//                   }
//                   className="col-span-3"
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="submit" variant="default">
//                 Guardar
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Dialogo para detalles de administrador */}
//       <Dialog open={dialogoDetalles} onOpenChange={setDialogoDetalles}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Detalles del Administrador</DialogTitle>
//           </DialogHeader>
//           {administradorActual && (
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="nombre" className="text-right">
//                   Nombre
//                 </Label>
//                 <Input
//                   id="nombre"
//                   value={administradorActual.nombre}
//                   readOnly
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="correo" className="text-right">
//                   Correo
//                 </Label>
//                 <Input
//                   id="correo"
//                   value={administradorActual.correo}
//                   readOnly
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="telefono" className="text-right">
//                   Teléfono
//                 </Label>
//                 <Input
//                   id="telefono"
//                   value={administradorActual.telefono}
//                   readOnly
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="rol" className="text-right">
//                   Rol
//                 </Label>
//                 <Input
//                   id="rol"
//                   value={administradorActual.rol}
//                   readOnly
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="permisos" className="text-right">
//                   Permisos
//                 </Label>
//                 <Input
//                   id="permisos"
//                   value={administradorActual.permisos.join(", ")}
//                   readOnly
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="activo" className="text-right">
//                   Estado
//                 </Label>
//                 <Input
//                   id="activo"
//                   value={administradorActual.activo ? "Activo" : "Inactivo"}
//                   readOnly
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="fechaCreacion" className="text-right">
//                   Fecha de Creación
//                 </Label>
//                 <Input
//                   id="fechaCreacion"
//                   value={formatearFecha(administradorActual.fechaCreacion)}
//                   readOnly
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="ultimoAcceso" className="text-right">
//                   Último Acceso
//                 </Label>
//                 <Input
//                   id="ultimoAcceso"
//                   value={formatearFechaHora(administradorActual.ultimoAcceso)}
//                   readOnly
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="notas" className="text-right">
//                   Notas
//                 </Label>
//                 <Textarea
//                   id="notas"
//                   value={administradorActual.notas}
//                   readOnly
//                   className="col-span-3"
//                 />
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Dialogo para confirmar eliminación */}
//       <Dialog open={dialogoEliminar} onOpenChange={setDialogoEliminar}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Eliminar Administrador</DialogTitle>
//             <DialogDescription>
//               ¿Estás seguro de que quieres eliminar a{" "}
//               {administradorActual?.nombre}?
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDialogoEliminar(false)}>
//               Cancelar
//             </Button>
//             <Button variant="destructive" onClick={eliminarAdministrador}>
//               Eliminar
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Dialogo para resetear contraseña */}
//       <Dialog
//         open={dialogoResetPassword}
//         onOpenChange={setDialogoResetPassword}
//       >
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Restablecer Contraseña</DialogTitle>
//             <DialogDescription>
//               ¿Estás seguro de que quieres restablecer la contraseña de{" "}
//               {administradorActual?.nombre}?
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setDialogoResetPassword(false)}
//             >
//               Cancelar
//             </Button>
//             <Button variant="default" onClick={resetearPassword}>
//               Restablecer
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
