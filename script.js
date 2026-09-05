// Referencia a la API de Rick and Morty
// Se muestran los primeros resultados de la primera pagina (máximo 20)
var API_URL = "https://rickandmortyapi.com/api/character";

// Variables para paginación
var busquedaActual = "";
var paginaActual = 1;
var hayMasPaginas = false;

// Contadores acumulados para estadisticas
var totalVivos = 0;
var totalMuertos = 0;
var totalDesconocidos = 0;

// Referencia a elementos del DOM
var campoBusqueda = document.getElementById("campo-busqueda");
var btnBuscar = document.getElementById("btn-buscar");
var btnLimpiar = document.getElementById("btn-limpiar");
var btnTema = document.getElementById("btn-tema");
var btnVerMas = document.getElementById("btn-ver-mas");
var contenedorVerMas = document.getElementById("contenedor-ver-mas");
var contenedorResultados = document.getElementById("resultados");
var contenedorMensaje = document.getElementById("mensaje");
var contenedorCargando = document.getElementById("cargando");
var contenedorEstadisticas = document.getElementById("estadisticas");
var contenedorContador = document.getElementById("contador-resultados");

// Funcion de busqueda

function buscarPersonajes(nombre, pagina) {
    var url = API_URL + "?name=" + encodeURIComponent(nombre);
    if (pagina && pagina > 1) {
        url += "&page=" + pagina;
    }
    return fetch(url)
        .then(function(respuesta) {
            if (respuesta.ok) {
                return respuesta.json();
            }
            return { results: [], info: { count: 0, pages: 0, next: null }, error: true };
        })
        .catch(function(error) {
            return { results: [], info: { count: 0, pages: 0, next: null }, error: true };
        });
}

// Mostrar personajes en tarjetas

function mostrarPersonajes(personajes) {
    contenedorResultados.innerHTML = "";

    if (!personajes || personajes.length === 0) {
        mostrarMensaje("No se encontraron resultados.", "error");
        ocultarEstadisticas();
        return;
    }

    var html = "";

    for (var i = 0; i < personajes.length; i++) {
        var personaje = personajes[i];

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

// Mostrar estadisticas

function mostrarEstadisticas(personajes, totalReal) {
    if (!personajes || personajes.length === 0) {
        ocultarEstadisticas();
        return;
    }

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

    var total = totalReal || personajes.length;

    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-vivos").textContent = vivos;
    document.getElementById("stat-muertos").textContent = muertos;
    document.getElementById("stat-desconocido").textContent = desconocidos;

    contenedorEstadisticas.classList.remove("oculto");
    var mensaje = "Se encontraron " + total + " personajes.";
    if (total > personajes.length) {
        mensaje += " Se muestran los primeros " + personajes.length + ".";
    }
    contenedorContador.textContent = mensaje;
    contenedorContador.classList.remove("oculto");
}

function ocultarEstadisticas() {
    contenedorEstadisticas.classList.add("oculto");
    contenedorContador.classList.add("oculto");
}

// Indicador de carga

function mostrarCargando() {
    contenedorCargando.classList.remove("oculto");
}

function ocultarCargando() {
    contenedorCargando.classList.add("oculto");
}

// Mensajes de retroalimentacion

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

// Realizar busqueda

function realizarBusqueda() {
    var valor = campoBusqueda.value.trim();

    if (valor === "") {
        mostrarMensaje("Por favor ingrese un nombre.", "error");
        return;
    }

    // Resetear paginacion y contadores
    busquedaActual = valor;
    paginaActual = 1;
    totalVivos = 0;
    totalMuertos = 0;
    totalDesconocidos = 0;
    contenedorResultados.innerHTML = "";
    limpiarMensaje();
    mostrarCargando();

    buscarPersonajes(valor, 1)
        .then(function(data) {
            ocultarCargando();

            console.log("Resultados de búsqueda:", data);

            if (data.error || !data.results || data.results.length === 0) {
                mostrarMensaje("No se encontraron resultados.", "error");
                mostrarPersonajes([]);
                contenedorVerMas.classList.add("oculto");
                return;
            }

            mostrarPersonajes(data.results);
            mostrarEstadisticas(data.results, data.info.count);

            // Acumular contadores de la primera pagina
            for (var i = 0; i < data.results.length; i++) {
                if (data.results[i].status === "Alive") {
                    totalVivos++;
                } else if (data.results[i].status === "Dead") {
                    totalMuertos++;
                } else {
                    totalDesconocidos++;
                }
            }

            // Mostrar u ocultar boton ver mas
            hayMasPaginas = data.info.next !== null;
            if (hayMasPaginas) {
                contenedorVerMas.classList.remove("oculto");
            } else {
                contenedorVerMas.classList.add("oculto");
            }
        });
}

// Cargar mas resultados (paginacion)

function cargarMasResultados() {
    if (!busquedaActual || !hayMasPaginas) return;

    paginaActual++;
    mostrarCargando();
    contenedorVerMas.classList.add("oculto");

    buscarPersonajes(busquedaActual, paginaActual)
        .then(function(data) {
            ocultarCargando();

            if (data.error || !data.results || data.results.length === 0) {
                mostrarMensaje("No se encontraron más resultados.", "error");
                return;
            }

            // Agregar nuevas tarjetas al final
            var html = "";
            for (var i = 0; i < data.results.length; i++) {
                var personaje = data.results[i];

                var claseBadge = "badge-unknown";
                if (personaje.status === "Alive") {
                    claseBadge = "badge-alive";
                    totalVivos++;
                } else if (personaje.status === "Dead") {
                    claseBadge = "badge-dead";
                    totalMuertos++;
                } else {
                    totalDesconocidos++;
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
            contenedorResultados.innerHTML += html;

            // Actualizar estadisticas con el total real
            var totalMostrados = contenedorResultados.querySelectorAll(".card").length;
            document.getElementById("stat-total").textContent = data.info.count;
            document.getElementById("stat-vivos").textContent = totalVivos;
            document.getElementById("stat-muertos").textContent = totalMuertos;
            document.getElementById("stat-desconocido").textContent = totalDesconocidos;
            contenedorContador.textContent = "Se encontraron " + data.info.count + " personajes. Se muestran " + totalMostrados + ".";

            // Verificar si hay mas paginas
            hayMasPaginas = data.info.next !== null;
            if (hayMasPaginas) {
                contenedorVerMas.classList.remove("oculto");
            } else {
                contenedorVerMas.classList.add("oculto");
            }
        });
}

// Carga inicial de personajes

function cargarPersonajesIniciales() {
    mostrarCargando();
    contenedorVerMas.classList.add("oculto");

    fetch(API_URL)
        .then(function(respuesta) {
            return respuesta.json();
        })
        .then(function(data) {
            ocultarCargando();
            mostrarPersonajes(data.results);
            mostrarEstadisticas(data.results, data.info.count);

            // Para la carga inicial no mostramos "Ver mas" ya que no hay filtro
            contenedorVerMas.classList.add("oculto");
        })
        .catch(function(error) {
            ocultarCargando();
            mostrarMensaje("Error al conectar con la API.", "error");
        });
}

// Limpiar busqueda

function limpiarBusqueda() {
    campoBusqueda.value = "";
    limpiarMensaje();
    contenedorResultados.innerHTML = "";
    contenedorVerMas.classList.add("oculto");
    busquedaActual = "";
    paginaActual = 1;
    cargarPersonajesIniciales();
}

// Modo claro / oscuro

function cambiarTema() {
    document.body.classList.toggle("modo-oscuro");

    if (document.body.classList.contains("modo-oscuro")) {
        localStorage.setItem("tema", "oscuro");
        btnTema.textContent = "\u2600\uFE0F";
    } else {
        localStorage.setItem("tema", "claro");
        btnTema.textContent = "\uD83C\uDF19";
    }
}

function cargarTemaGuardado() {
    var temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "oscuro") {
        document.body.classList.add("modo-oscuro");
        btnTema.textContent = "\u2600\uFE0F";
    }
}

// Eventos de la interfaz

btnBuscar.addEventListener("click", realizarBusqueda);

campoBusqueda.addEventListener("keydown", function(evento) {
    if (evento.key === "Enter") {
        realizarBusqueda();
    }
});

btnLimpiar.addEventListener("click", limpiarBusqueda);

btnVerMas.addEventListener("click", cargarMasResultados);

btnTema.addEventListener("click", cambiarTema);

// Carga inicial
cargarTemaGuardado();
cargarPersonajesIniciales();
