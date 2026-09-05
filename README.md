# Rick and Morty - Buscador de Personajes

## Descripción

Aplicación web que consume la API pública de Rick and Morty para buscar personajes por nombre y visualizar su información de forma dinámica. Desarrollada con HTML, CSS y JavaScript puro sin frameworks externos.

## Tecnologías utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsive, animaciones, Flexbox
- **JavaScript (ES6+)** - Lógica de la aplicación
- **Fetch API** - Consumo de la API REST

## Estructura del proyecto

```
Taller_evaluativo_1/
├── index.html      ← Estructura HTML
├── styles.css      ← Estilos y diseño
├── script.js       ← Lógica y consumo de API
└── README.md       ← Documentación
```

## Instrucciones de ejecución

1. Copiar los cuatro archivos en una misma carpeta
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

### Resultados
- Tarjetas con imagen, nombre, especie, estado y origen
- Badge de color según estado (Alive, Dead, unknown)
- Animación de aparición gradual en cada tarjeta
- Efecto hover con elevación en tarjetas

### Indicadores
- Loader animado mientras se carga la información
- Contador de resultados encontrados
- Estadísticas: total, vivos, muertos, desconocidos

### Diseño
- Diseño responsive para PC, tablet y celular
- Colores inspirados en la serie Rick and Morty
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

**Datos obtenidos por personaje:**
- Imagen (`image`)
- Nombre (`name`)
- Especie (`species`)
- Estado (`status`)
- Origen (`origin.name`)

**Notas:**
- La API retorna máximo 20 personajes por página
- Se muestran solo los primeros resultados (sin paginación)
- Cuando no hay coincidencias la API retorna estado 404

## Capturas sugeridas

1. **Página inicial** - Vista con los primeros 20 personajes cargados
2. **Búsqueda exitosa** - Resultados al buscar un nombre
3. **Sin resultados** - Mensaje cuando no se encuentran coincidencias
4. **Vista móvil** - Responsive en dispositivo celular

## Autor

Nombre del estudiante
Ingeniería de Sistemas
