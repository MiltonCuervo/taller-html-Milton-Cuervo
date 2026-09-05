# Rick and Morty - Buscador de Personajes

## Descripción

Aplicación web que consume la API pública de Rick and Morty para buscar personajes por nombre y visualizar su información de forma dinámica. Desarrollada con HTML, CSS y JavaScript puro sin frameworks externos.

## Tecnologías utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsive, animaciones, Flexbox, modo oscuro
- **JavaScript (ES6+)** - Lógica de la aplicación, paginación
- **Fetch API** - Consumo de la API REST
- **localStorage** - Guardar preferencia de tema

## Estructura del proyecto

```
Taller_evaluativo_1/
├── index.html      ← Estructura HTML
├── styles.css      ← Estilos y diseño (modo claro/oscuro)
├── script.js       ← Lógica, consumo de API y paginación
├── logo.png        ← Logo de la serie
└── README.md       ← Documentación
```

## Instrucciones de ejecución

1. Copiar todos los archivos en una misma carpeta
2. Abrir el archivo `index.html` en cualquier navegador web
3. Alternativamente, usar Live Server en Visual Studio Code

No se requiere instalación de dependencias ni servidor local.

## Funcionalidades implementadas

### Búsqueda
- Campo de texto para buscar personajes por nombre
- Botón "Buscar" para ejecutar la búsqueda
- Búsqueda con tecla Enter
- Validación de campos vacíos
- Botón "Limpiar" que reinicia la vista

### Paginación
- Botón "Ver más" para cargar siguientes resultados
- La API retorna máximo 20 personajes por página
- Se acumulan los resultados al cargar más páginas
- El botón desaparece cuando no hay más páginas

### Resultados
- Tarjetas con imagen, nombre, especie, estado y origen
- Badge de color según estado (Alive, Dead, unknown)
- Animación de aparición gradual en cada tarjeta
- Efecto hover con elevación en tarjetas

### Indicadores
- Loader animado mientras se carga la información
- Contador de resultados encontrados
- Estadísticas dinámicas: total, vivos, muertos, desconocidos
- Las estadísticas se actualizan al cargar más resultados

### Modo claro / oscuro
- Botón para alternar entre temas
- Tema claro por defecto
- Tema oscuro con estilo espacial y verde neón
- La preferencia se guarda en localStorage
- Transiciones suaves entre temas

### Diseño
- Logo de la serie Rick and Morty en el encabezado
- Diseño responsive para PC, tablet y celular
- Colores inspirados en la serie (verde, morado, azul)
- Flexbox para layout flexible
- Scroll suave activado

### Manejo de errores
- Mensaje cuando la búsqueda no encuentra resultados
- Mensaje cuando falla la conexión con la API
- Mensaje cuando el campo está vacío
- Todos los mensajes en español

## Uso de la API

**Endpoints utilizados:**

- Carga inicial: `GET https://rickandmortyapi.com/api/character`
- Búsqueda por nombre: `GET https://rickandmortyapi.com/api/character?name=rick`
- Página específica: `GET https://rickandmortyapi.com/api/character?name=rick&page=2`

**Datos obtenidos por personaje:**
- Imagen (`image`)
- Nombre (`name`)
- Especie (`species`)
- Estado (`status`)
- Origen (`origin.name`)

**Estructura de respuesta:**
```json
{
  "info": {
    "count": 23,
    "pages": 2,
    "next": "https://rickandmortyapi.com/api/character/?page=2&name=rick",
    "prev": null
  },
  "results": [...]
}
```

**Notas:**
- La API retorna máximo 20 personajes por página
- Se implementa paginación con botón "Ver más"
- Cuando no hay coincidencias la API retorna estado 404
