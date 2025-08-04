export default function Sidebar() {
  return (
    <div className="min-h-[calc(100vh-88px)] w-112 grow rounded-md border bg-white/70 p-4 shadow-sm">
      <div className="flex flex-col space-y-4">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="species" className="block text-sm font-medium">
              Especie
            </label>
            <select
              id="species"
              name="species"
              className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Todas</option>
              <option value="dog">Perro</option>
              <option value="cat">Gato</option>
            </select>
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium">
              Edad
            </label>
            <select
              id="age"
              name="age"
              className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Todas</option>
              <option value="puppy">Cachorro</option>
              <option value="adult">Adulto</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 w-full rounded-md px-4 py-2 text-white"
          >
            Aplicar Filtros
          </button>
        </form>
      </div>
    </div>
  );
}
