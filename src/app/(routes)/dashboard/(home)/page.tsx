"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Download,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Datos ficticios de mascotas
const mascotasIniciales = [
  {
    id: 1,
    nombre: "Luna",
    especie: "Perro",
    raza: "Labrador",
    edad: 2,
    estado: "disponible",
    imagen: "/placeholder.svg?height=80&width=80",
    fechaIngreso: "2023-05-15",
    descripcion: "Juguetona y cariñosa, le encanta correr y jugar con pelotas.",
    sexo: "Hembra",
    peso: 12.5,
    vacunado: true,
    esterilizado: true,
  },
  {
    id: 2,
    nombre: "Simba",
    especie: "Gato",
    raza: "Siamés",
    edad: 1,
    estado: "adoptado",
    imagen: "/placeholder.svg?height=80&width=80",
    fechaIngreso: "2023-04-20",
    descripcion: "Tranquilo y muy limpio, le gusta dormir en lugares altos.",
    sexo: "Macho",
    peso: 4.2,
    vacunado: true,
    esterilizado: false,
  },
  {
    id: 3,
    nombre: "Rocky",
    especie: "Perro",
    raza: "Pastor Alemán",
    edad: 3,
    estado: "disponible",
    imagen: "/placeholder.svg?height=80&width=80",
    fechaIngreso: "2023-05-02",
    descripcion: "Inteligente y protector, ideal para familias con niños.",
    sexo: "Macho",
    peso: 28.3,
    vacunado: true,
    esterilizado: true,
  },
  {
    id: 4,
    nombre: "Milo",
    especie: "Gato",
    raza: "Persa",
    edad: 2,
    estado: "disponible",
    imagen: "/placeholder.svg?height=80&width=80",
    fechaIngreso: "2023-05-10",
    descripcion: "Pelaje suave y abundante, necesita cepillado diario.",
    sexo: "Macho",
    peso: 5.1,
    vacunado: true,
    esterilizado: true,
  },
  {
    id: 5,
    nombre: "Coco",
    especie: "Perro",
    raza: "Bulldog",
    edad: 4,
    estado: "adoptado",
    imagen: "/placeholder.svg?height=80&width=80",
    fechaIngreso: "2023-03-15",
    descripcion: "Tranquilo y amigable, le encanta dormir y los mimos.",
    sexo: "Macho",
    peso: 18.7,
    vacunado: true,
    esterilizado: true,
  },
  {
    id: 6,
    nombre: "Nala",
    especie: "Gato",
    raza: "Bengalí",
    edad: 1,
    estado: "disponible",
    imagen: "/placeholder.svg?height=80&width=80",
    fechaIngreso: "2023-05-08",
    descripcion: "Muy activa y juguetona, necesita mucho ejercicio.",
    sexo: "Hembra",
    peso: 3.8,
    vacunado: true,
    esterilizado: false,
  },
  {
    id: 7,
    nombre: "Max",
    especie: "Perro",
    raza: "Golden Retriever",
    edad: 2,
    estado: "disponible",
    imagen: "/placeholder.svg?height=80&width=80",
    fechaIngreso: "2023-04-28",
    descripcion: "Amigable con todos, especialmente con niños.",
    sexo: "Macho",
    peso: 25.2,
    vacunado: true,
    esterilizado: true,
  },
  {
    id: 8,
    nombre: "Bella",
    especie: "Perro",
    raza: "Beagle",
    edad: 3,
    estado: "adoptado",
    imagen: "/placeholder.svg?height=80&width=80",
    fechaIngreso: "2023-03-22",
    descripcion: "Energética y curiosa, le encanta explorar.",
    sexo: "Hembra",
    peso: 12.8,
    vacunado: true,
    esterilizado: true,
  },
];

// Especies disponibles
const especies = ["Perro", "Gato", "Ave", "Otro"];

// Estados disponibles
const estados = ["disponible", "adoptado", "en tratamiento", "en cuarentena"];

// Colores para gráficos
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function MascotasPage() {
  const [mascotas, setMascotas] = useState(mascotasIniciales);
  const [mascotaActual, setMascotaActual] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEspecie, setFiltroEspecie] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState(null);
  const [ordenarPor, setOrdenarPor] = useState("nombre-asc");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [dialogoEliminar, setDialogoEliminar] = useState(false);
  const [dialogoDetalles, setDialogoDetalles] = useState(false);

  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    try {
      const fecha = new Date(fechaStr);
      return format(fecha, "dd/MM/yyyy", { locale: es });
    } catch (error) {
      return fechaStr;
    }
  };

  // Filtrar mascotas
  const mascotasFiltradas = mascotas
    .filter((mascota) => {
      // Filtro de búsqueda
      const coincideBusqueda =
        mascota.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        mascota.raza.toLowerCase().includes(busqueda.toLowerCase()) ||
        mascota.especie.toLowerCase().includes(busqueda.toLowerCase());

      // Filtro de especie
      const coincideEspecie =
        filtroEspecie.length === 0 || filtroEspecie.includes(mascota.especie);

      // Filtro de estado
      const coincideEstado =
        filtroEstado.length === 0 || filtroEstado.includes(mascota.estado);

      // Filtro de fecha
      const coincideFecha =
        !filtroFecha || mascota.fechaIngreso === filtroFecha;

      return (
        coincideBusqueda && coincideEspecie && coincideEstado && coincideFecha
      );
    })
    .sort((a, b) => {
      // Ordenamiento
      if (ordenarPor === "nombre-asc") {
        return a.nombre.localeCompare(b.nombre);
      } else if (ordenarPor === "nombre-desc") {
        return b.nombre.localeCompare(a.nombre);
      } else if (ordenarPor === "edad-asc") {
        return a.edad - b.edad;
      } else if (ordenarPor === "edad-desc") {
        return b.edad - a.edad;
      } else if (ordenarPor === "fecha-asc") {
        return new Date(a.fechaIngreso) - new Date(b.fechaIngreso);
      } else if (ordenarPor === "fecha-desc") {
        return new Date(b.fechaIngreso) - new Date(a.fechaIngreso);
      }
      return 0;
    });

  // Abrir formulario para nueva mascota
  const abrirNuevaMascota = () => {
    setMascotaActual({
      id: mascotas.length + 1,
      nombre: "",
      especie: "Perro",
      raza: "",
      edad: 1,
      estado: "disponible",
      imagen: "/placeholder.svg?height=80&width=80",
      fechaIngreso: format(new Date(), "yyyy-MM-dd"),
      descripcion: "",
      sexo: "Macho",
      peso: 0,
      vacunado: false,
      esterilizado: false,
    });
    setDialogoAbierto(true);
  };

  // Abrir formulario para editar mascota
  const editarMascota = (mascota) => {
    setMascotaActual(mascota);
    setDialogoAbierto(true);
  };

  // Confirmar eliminación de mascota
  const confirmarEliminar = (mascota) => {
    setMascotaActual(mascota);
    setDialogoEliminar(true);
  };

  // Eliminar mascota
  const eliminarMascota = () => {
    setMascotas(mascotas.filter((m) => m.id !== mascotaActual.id));
    setDialogoEliminar(false);
  };

  // Guardar mascota (nueva o editada)
  const guardarMascota = (e) => {
    e.preventDefault();
    if (mascotas.find((m) => m.id === mascotaActual.id)) {
      // Actualizar mascota existente
      setMascotas(
        mascotas.map((m) => (m.id === mascotaActual.id ? mascotaActual : m)),
      );
    } else {
      // Agregar nueva mascota
      setMascotas([...mascotas, mascotaActual]);
    }
    setDialogoAbierto(false);
  };

  // Ver detalles de mascota
  const verDetalles = (mascota) => {
    setMascotaActual(mascota);
    setDialogoDetalles(true);
  };

  // Calcular datos para el gráfico de especies
  const contarMascotasPorEspecie = () => {
    const conteo = {};
    especies.forEach((especie) => {
      conteo[especie] = mascotas.filter((m) => m.especie === especie).length;
    });
    return Object.keys(conteo).map((key) => ({
      name: key,
      value: conteo[key],
    }));
  };

  // Calcular datos para el gráfico de estados
  const contarMascotasPorEstado = () => {
    const conteo = {};
    estados.forEach((estado) => {
      conteo[estado] = mascotas.filter((m) => m.estado === estado).length;
    });
    return Object.keys(conteo).map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: conteo[key],
    }));
  };

  // Exportar a Excel (simulado)
  const exportarExcel = () => {
    alert("Exportando mascotas a Excel...");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestión de Mascotas
        </h1>
        <p className="text-muted-foreground">
          Administra las mascotas disponibles para adopción
        </p>
      </div>

      <Tabs defaultValue="listado" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listado">Listado de Mascotas</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="listado" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground text-sm font-medium">
                    Total de Mascotas
                  </div>
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {mascotasFiltradas.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground text-sm font-medium">
                    Disponibles para Adopción
                  </div>
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {
                    mascotasFiltradas.filter((m) => m.estado === "disponible")
                      .length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground text-sm font-medium">
                    Adoptadas
                  </div>
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {
                    mascotasFiltradas.filter((m) => m.estado === "adoptado")
                      .length
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Search className="text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, raza o especie..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar por Especie
                    {filtroEspecie.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 rounded-sm px-1"
                      >
                        {filtroEspecie.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {especies.map((especie) => (
                    <DropdownMenuCheckboxItem
                      key={especie}
                      checked={filtroEspecie.includes(especie)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFiltroEspecie([...filtroEspecie, especie]);
                        } else {
                          setFiltroEspecie(
                            filtroEspecie.filter((e) => e !== especie),
                          );
                        }
                      }}
                    >
                      {especie}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar por Estado
                    {filtroEstado.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 rounded-sm px-1"
                      >
                        {filtroEstado.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {estados.map((estado) => (
                    <DropdownMenuCheckboxItem
                      key={estado}
                      checked={filtroEstado.includes(estado)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFiltroEstado([...filtroEstado, estado]);
                        } else {
                          setFiltroEstado(
                            filtroEstado.filter((e) => e !== estado),
                          );
                        }
                      }}
                    >
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    {filtroFecha
                      ? formatearFecha(filtroFecha)
                      : "Filtrar por Fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={filtroFecha ? new Date(filtroFecha) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setFiltroFecha(format(date, "yyyy-MM-dd"));
                      } else {
                        setFiltroFecha(null);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Ordenar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setOrdenarPor("nombre-asc")}>
                    Nombre (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setOrdenarPor("nombre-desc")}
                  >
                    Nombre (Z-A)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOrdenarPor("edad-asc")}>
                    Edad (menor a mayor)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOrdenarPor("edad-desc")}>
                    Edad (mayor a menor)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOrdenarPor("fecha-desc")}>
                    Más recientes primero
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOrdenarPor("fecha-asc")}>
                    Más antiguos primero
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBusqueda("");
                  setFiltroEspecie([]);
                  setFiltroEstado([]);
                  setFiltroFecha(null);
                  setOrdenarPor("nombre-asc");
                }}
              >
                Limpiar filtros
              </Button>

              <Button variant="outline" size="sm" onClick={exportarExcel}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Listado de Mascotas</CardTitle>
                <CardDescription>
                  {mascotasFiltradas.length}{" "}
                  {mascotasFiltradas.length === 1 ? "mascota" : "mascotas"}{" "}
                  encontradas
                </CardDescription>
              </div>
              <Button onClick={abrirNuevaMascota}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Mascota
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Especie</TableHead>
                      <TableHead>Raza</TableHead>
                      <TableHead>Edad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Ingreso</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mascotasFiltradas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No se encontraron mascotas.
                        </TableCell>
                      </TableRow>
                    ) : (
                      mascotasFiltradas.map((mascota) => (
                        <TableRow key={mascota.id}>
                          <TableCell>
                            <img
                              src={mascota.imagen || "/placeholder.svg"}
                              alt={mascota.nombre}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {mascota.nombre}
                          </TableCell>
                          <TableCell>{mascota.especie}</TableCell>
                          <TableCell>{mascota.raza}</TableCell>
                          <TableCell>
                            {mascota.edad} {mascota.edad === 1 ? "año" : "años"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                mascota.estado === "disponible"
                                  ? "default"
                                  : mascota.estado === "adoptado"
                                    ? "secondary"
                                    : mascota.estado === "en tratamiento"
                                      ? "outline"
                                      : "destructive"
                              }
                            >
                              {mascota.estado.charAt(0).toUpperCase() +
                                mascota.estado.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatearFecha(mascota.fechaIngreso)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <span className="sr-only">Abrir menú</span>
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => verDetalles(mascota)}
                                >
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => editarMascota(mascota)}
                                >
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => confirmarEliminar(mascota)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Especie</CardTitle>
                <CardDescription>
                  Cantidad de mascotas por especie
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contarMascotasPorEspecie()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {contarMascotasPorEspecie().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado de Mascotas</CardTitle>
                <CardDescription>Distribución por estado</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={contarMascotasPorEstado()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Cantidad" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumen de Mascotas</CardTitle>
              <CardDescription>Datos generales del refugio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-muted-foreground text-sm font-medium">
                    Total Mascotas
                  </div>
                  <div className="text-3xl font-bold">{mascotas.length}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-muted-foreground text-sm font-medium">
                    Disponibles
                  </div>
                  <div className="text-3xl font-bold">
                    {mascotas.filter((m) => m.estado === "disponible").length}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-muted-foreground text-sm font-medium">
                    Adoptadas
                  </div>
                  <div className="text-3xl font-bold">
                    {mascotas.filter((m) => m.estado === "adoptado").length}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-muted-foreground text-sm font-medium">
                    En Tratamiento
                  </div>
                  <div className="text-3xl font-bold">
                    {
                      mascotas.filter((m) => m.estado === "en tratamiento")
                        .length
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para crear/editar mascota */}
      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {mascotaActual && mascotaActual.nombre
                ? "Editar Mascota"
                : "Nueva Mascota"}
            </DialogTitle>
            <DialogDescription>
              Complete los detalles de la mascota y guarde los cambios.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={guardarMascota}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={mascotaActual?.nombre || ""}
                    onChange={(e) =>
                      setMascotaActual({
                        ...mascotaActual,
                        nombre: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="especie">Especie</Label>
                  <Select
                    value={mascotaActual?.especie || "Perro"}
                    onValueChange={(value) =>
                      setMascotaActual({ ...mascotaActual, especie: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar especie" />
                    </SelectTrigger>
                    <SelectContent>
                      {especies.map((especie) => (
                        <SelectItem key={especie} value={especie}>
                          {especie}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="raza">Raza</Label>
                  <Input
                    id="raza"
                    value={mascotaActual?.raza || ""}
                    onChange={(e) =>
                      setMascotaActual({
                        ...mascotaActual,
                        raza: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select
                    value={mascotaActual?.sexo || "Macho"}
                    onValueChange={(value) =>
                      setMascotaActual({ ...mascotaActual, sexo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Macho">Macho</SelectItem>
                      <SelectItem value="Hembra">Hembra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edad">Edad (años)</Label>
                  <Input
                    id="edad"
                    type="number"
                    min="0"
                    value={mascotaActual?.edad || 1}
                    onChange={(e) =>
                      setMascotaActual({
                        ...mascotaActual,
                        edad: Number.parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    min="0"
                    step="0.1"
                    value={mascotaActual?.peso || 0}
                    onChange={(e) =>
                      setMascotaActual({
                        ...mascotaActual,
                        peso: Number.parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={mascotaActual?.estado || "disponible"}
                    onValueChange={(value) =>
                      setMascotaActual({ ...mascotaActual, estado: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado.charAt(0).toUpperCase() + estado.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vacunado">Vacunado</Label>
                  <Select
                    value={mascotaActual?.vacunado ? "si" : "no"}
                    onValueChange={(value) =>
                      setMascotaActual({
                        ...mascotaActual,
                        vacunado: value === "si",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="¿Está vacunado?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="esterilizado">Esterilizado</Label>
                  <Select
                    value={mascotaActual?.esterilizado ? "si" : "no"}
                    onValueChange={(value) =>
                      setMascotaActual({
                        ...mascotaActual,
                        esterilizado: value === "si",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="¿Está esterilizado?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      type="button"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {mascotaActual?.fechaIngreso
                        ? formatearFecha(mascotaActual.fechaIngreso)
                        : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={
                        mascotaActual?.fechaIngreso
                          ? new Date(mascotaActual.fechaIngreso)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          setMascotaActual({
                            ...mascotaActual,
                            fechaIngreso: format(date, "yyyy-MM-dd"),
                          });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={mascotaActual?.descripcion || ""}
                  onChange={(e) =>
                    setMascotaActual({
                      ...mascotaActual,
                      descripcion: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Describa la personalidad y características de la mascota..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={dialogoEliminar} onOpenChange={setDialogoEliminar}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar a {mascotaActual?.nombre}? Esta
              acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoEliminar(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={eliminarMascota}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para ver detalles */}
      <Dialog open={dialogoDetalles} onOpenChange={setDialogoDetalles}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles de {mascotaActual?.nombre}</DialogTitle>
            <DialogDescription>
              Información completa de la mascota
            </DialogDescription>
          </DialogHeader>

          {mascotaActual && (
            <div className="grid gap-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <img
                  src={mascotaActual.imagen || "/placeholder.svg"}
                  alt={mascotaActual.nombre}
                  className="h-32 w-32 rounded-full object-cover"
                />
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-2xl font-bold">{mascotaActual.nombre}</h3>
                  <p className="text-muted-foreground">
                    {mascotaActual.especie} - {mascotaActual.raza}
                  </p>
                  <Badge
                    variant={
                      mascotaActual.estado === "disponible"
                        ? "default"
                        : mascotaActual.estado === "adoptado"
                          ? "secondary"
                          : mascotaActual.estado === "en tratamiento"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {mascotaActual.estado.charAt(0).toUpperCase() +
                      mascotaActual.estado.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Información Básica</h4>
                  <div className="rounded-md border p-3">
                    <div className="grid gap-1">
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">Edad:</span>
                        <span className="text-sm">
                          {mascotaActual.edad}{" "}
                          {mascotaActual.edad === 1 ? "año" : "años"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">Sexo:</span>
                        <span className="text-sm">{mascotaActual.sexo}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">Peso:</span>
                        <span className="text-sm">{mascotaActual.peso} kg</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">
                          Fecha de Ingreso:
                        </span>
                        <span className="text-sm">
                          {formatearFecha(mascotaActual.fechaIngreso)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Estado de Salud</h4>
                  <div className="rounded-md border p-3">
                    <div className="grid gap-1">
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">Vacunado:</span>
                        <span className="text-sm">
                          {mascotaActual.vacunado ? "Sí" : "No"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">
                          Esterilizado:
                        </span>
                        <span className="text-sm">
                          {mascotaActual.esterilizado ? "Sí" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Descripción</h4>
                <div className="rounded-md border p-3">
                  <p className="text-sm">
                    {mascotaActual.descripcion ||
                      "No hay descripción disponible."}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogoDetalles(false)}
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    setDialogoDetalles(false);
                    editarMascota(mascotaActual);
                  }}
                >
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
