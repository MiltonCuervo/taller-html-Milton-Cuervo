// Referencia a la API de Rick and Morty
// Se muestran los primeros resultados de la primera página (máximo 20)
var API_URL = "https://rickandmortyapi.com/api/character";

// Referencia a elementos del DOM
var campoBusqueda = document.getElementById("campo-busqueda");
var btnBuscar = document.getElementById("btn-buscar");
var btnLimpiar = document.getElementById("btn-limpiar");
var btnTema = document.getElementById("btn-tema");
var contenedorResultados = document.getElementById("resultados");
var contenedorMensaje = document.getElementById("mensaje");
var contenedorCargando = document.getElementById("cargando");
var contenedorEstadisticas = document.getElementById("estadisticas");
var contenedorContador = document.getElementById("contador-resultados");

// =============================================
// Función de búsqueda
// =============================================

function buscarPersonajes(nombre) {
    return fetch(API_URL + "?name=" + encodeURIComponent(nombre))
        .then(function(respuesta) {
            if (respuesta.ok) {
                return respuesta.json();
            }
            // Si la API retorna error (404, etc.)
            return { results: [], error: true };
        })
        .catch(function(error) {
            // Error de conexión
            return { results: [], error: true };
        });
}

// =============================================
// Mostrar personajes en tarjetas
// =============================================

function mostrarPersonajes(personajes) {
    contenedorResultados.innerHTML = "";

    // Validar si no hay resultados
    if (!personajes || personajes.length === 0) {
        mostrarMensaje("No se encontraron resultados.", "error");
        ocultarEstadisticas();
        return;
    }

    var html = "";

    for (var i = 0; i < personajes.length; i++) {
        var personaje = personajes[i];

        // Determinar clase del badge según el estado
        var claseBadge = "badge-unknown";
        if (personaje.status === "Alive") {
            claseBadge = "badge-alive";
        } else if (personaje.status === "Dead") {
            claseBadge = "badge-dead";
        }

        html += '<div class="card">' +
            '<img src="' + personaje.image + '" alt="' + personaje.name + '">' +
            '<div class="card-contenido">' +
                '<h3>' + personaje.name + '</h3>' +
                '<p class="especie">' + personaje.species + '</p>' +
                '<span class="badge ' + claseBadge + '">' + personaje.status + '</span>' +
                '<p class="origen">Origen: ' + personaje.origin.name + '</p>' +
            '</div>' +
        '</div>';
    }

    contenedorResultados.innerHTML = html;
}

// =============================================
// Mostrar estadísticas
// =============================================

function mostrarEstadisticas(personajes) {
    if (!personajes || personajes.length === 0) {
        ocultarEstadisticas();
        return;
    }

    var total = personajes.length;
    var vivos = 0;
    var muertos = 0;
    var desconocidos = 0;

    for (var i = 0; i < personajes.length; i++) {
        if (personajes[i].status === "Alive") {
            vivos++;
        } else if (personajes[i].status === "Dead") {
            muertos++;
        } else {
            desconocidos++;
        }
    }

    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-vivos").textContent = vivos;
    document.getElementById("stat-muertos").textContent = muertos;
    document.getElementById("stat-desconocido").textContent = desconocidos;

    contenedorEstadisticas.classList.remove("oculto");
    contenedorContador.textContent = "Se encontraron " + total + " personajes.";
    contenedorContador.classList.remove("oculto");
}

function ocultarEstadisticas() {
    contenedorEstadisticas.classList.add("oculto");
    contenedorContador.classList.add("oculto");
}

// =============================================
// Indicador de carga
// =============================================

function mostrarCargando() {
    contenedorCargando.classList.remove("oculto");
}

function ocultarCargando() {
    contenedorCargando.classList.add("oculto");
}

// =============================================
// Mensajes de retroalimentación
// =============================================

function mostrarMensaje(texto, tipo) {
    contenedorMensaje.textContent = texto;
    contenedorMensaje.className = "";
    if (tipo === "error") {
        contenedorMensaje.className = "mensaje-error";
    } else {
        contenedorMensaje.className = "mensaje-info";
    }
}

function limpiarMensaje() {
    contenedorMensaje.textContent = "";
    contenedorMensaje.className = "";
}

// =============================================
// Realizar búsqueda
// =============================================

function realizarBusqueda() {
    var valor = campoBusqueda.value.trim();

    // Validar campo vacío
    if (valor === "") {
        mostrarMensaje("Por favor ingrese un nombre.", "error");
        return;
    }

    // Limpiar resultados y mensajes previos
    contenedorResultados.innerHTML = "";
    limpiarMensaje();
    mostrarCargando();

    buscarPersonajes(valor)
        .then(function(data) {
            ocultarCargando();

            // Verificar si hubo error o no hay resultados
            if (data.error || !data.results || data.results.length === 0) {
                mostrarMensaje("No se encontraron resultados.", "error");
                mostrarPersonajes([]);
                return;
            }

            mostrarPersonajes(data.results);
            mostrarEstadisticas(data.results);
        });
}

// =============================================
// Carga inicial de personajes
// =============================================

function cargarPersonajesIniciales() {
    mostrarCargando();

    fetch(API_URL)
        .then(function(respuesta) {
            return respuesta.json();
        })
        .then(function(data) {
            ocultarCargando();
            mostrarPersonajes(data.results);
            mostrarEstadisticas(data.results);
        })
        .catch(function(error) {
            ocultarCargando();
            mostrarMensaje("Error al conectar con la API.", "error");
        });
}

// =============================================
// Limpiar búsqueda
// =============================================

function limpiarBusqueda() {
    campoBusqueda.value = "";
    limpiarMensaje();
    contenedorResultados.innerHTML = "";
    cargarPersonajesIniciales();
}

// =============================================
// Eventos de la interfaz
// =============================================

btnBuscar.addEventListener("click", realizarBusqueda);

campoBusqueda.addEventListener("keydown", function(evento) {
    if (evento.key === "Enter") {
        realizarBusqueda();
    }
});

btnLimpiar.addEventListener("click", limpiarBusqueda);

// =============================================
// Modo claro / oscuro
// =============================================

function cambiarTema() {
    document.body.classList.toggle("modo-oscuro");

    // Guardar preferencia en localStorage
    if (document.body.classList.contains("modo-oscuro")) {
        localStorage.setItem("tema", "oscuro");
        btnTema.textContent = "\u2600\uFE0F";
    } else {
        localStorage.setItem("tema", "claro");
        btnTema.textContent = "\uD83C\uDF19";
    }
}

// Cargar tema guardado al abrir la página
function cargarTemaGuardado() {
    var temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "oscuro") {
        document.body.classList.add("modo-oscuro");
        btnTema.textContent = "\u2600\uFE0F";
    }
}

// Carga inicial al abrir la página
document.addEventListener("DOMContentLoaded", function() {
    cargarTemaGuardado();
    btnTema.addEventListener("click", cambiarTema);
    cargarPersonajesIniciales();
});
