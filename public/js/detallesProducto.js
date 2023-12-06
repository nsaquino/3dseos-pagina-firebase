
document.addEventListener("DOMContentLoaded", async function () {
    let paginaActual = 1;
    const comentariosPorPagina = 3;
    let calificacion = 0;
    let producto;

    // Obtiene el identificador del producto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Realiza una solicitud HTTP para obtener los detalles del producto con el ID correspondiente desde el archivo JSON
    const response = await fetch("json/productos.json");
    const data = await response.json();

    // Encuentra el producto correspondiente en el JSON utilizando el ID
    producto = data.find(item => item.id === parseInt(productId, 10));

    //_____________formulario_____________________________________________

    const comentarioForm = document.getElementById("comentarioForm");
    const stars = document.querySelectorAll('.star');

    comentarioForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const nombre = document.getElementById("userName").value;
        const comentario = document.getElementById("userComment").value;
        const nuevoComentario = {
            usuario: nombre,
            calificacion: calificacion,
            fecha: obtenerFechaActual(),
            comentario: comentario
        };

        // Agrega el nuevo comentario al arreglo de comentarios del producto actual
        producto.comentarios.push(nuevoComentario);

        // Limpia el formulario y actualiza la visualización de los comentarios
        comentarioForm.reset();
        calificacion = 0;
        stars.forEach(star => star.classList.remove('checked'));
        cargarComentarios(producto);
    });

    function obtenerFechaActual() {
        const fecha = new Date();
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`;
    }

    //----------------CARRUSEL-------------------------------------
    cargarCarrusel(producto);
    //--------DETALLES DE PRODUCTO-------------------------
    cargarDetalles(producto);
    //comentarios
    cargarComentarios(producto);

    const anteriorBtn = document.getElementById("anteriorBtn");
    const siguienteBtn = document.getElementById("siguienteBtn");

    anteriorBtn.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            cargarComentarios(producto);
        }
    });

    siguienteBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(producto.comentarios.length / comentariosPorPagina);
        if (paginaActual < totalPages) {
            paginaActual++;
            cargarComentarios(producto);
        }
    });

    function cargarCarrusel(producto) {
        const carouselInner = document.querySelector("#productCarousel .carousel-inner");
        const carouselHTML = producto.imagenes.map((imagen, index) => `
             <div class="carousel-item${index === 0 ? ' active' : ''}">
                 <img class="d-block w-100" src="${imagen}" alt="Imagen ${index + 1}">
             </div>
         `).join('');

        const miniaturasInner = document.getElementById('img-miniaturas');
        const miniaturasHTML = producto.imagenes.map((imagen, index) => `
            <div class="col-3">
            <img src="${imagen}" class="d-block w-100 thumbnail" alt="Miniatura 1"
                data-slide-to="${index}">
            </div>`).join('');

        carouselInner.innerHTML = carouselHTML;
        miniaturasInner.innerHTML = miniaturasHTML;
    }

    function cargarDetalles(producto) {
        const productContainer = document.getElementById("leer");
        const productHTML =
            `<div class="product">
                <h2 class="mb-3 text-primary">${producto.nombre}</h2>
                <p class="lead text-muted mb-4">${producto.descripcion}</p>
                <h5 class="mb-2 text-info">Características:</h5>
                <ul class="text-muted">
                ${producto.caracteristicas.map(caracteristica => `<li class="list-prod">${caracteristica}</li>`).join('')}
                </ul>
                <button type="button" class="button">
                <span class="button__text">Download</span>
                <span class="button__icon"><svg class="svg" data-name="Layer 2" id="bdd05811-e15d-428c-bb53-8661459f9307" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg"><path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path><path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path><path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path></svg></span>
              </button>
                <i class='bx bxs-download icon'></i>
                </button>
            </div>`;

        productContainer.innerHTML = productHTML;
    }

    function cargarComentarios(producto) {
        const comentariosContainer = document.getElementById("comentariosContenedor");
        const comentarios = producto.comentarios;

        if (comentarios.length > 0) {
            comentariosContainer.innerHTML = "";
            const inicio = (paginaActual - 1) * comentariosPorPagina;
            const fin = paginaActual * comentariosPorPagina;

            for (let i = inicio; i < fin && i < comentarios.length; i++) {
                const comentario = comentarios[i];
                const estrellasHTML = generarEstrellasHTML(comentario.calificacion);
                const nuevoComentario = `
                    <div class="media my-2">
                        <img src="img/user.png" class="mr-2 img-comentario" alt="${comentario.usuario}">
                        <div class="media-body">
                            <h5 class="mt-0 d-flex justify-content-between align-items-center">
                                <div class="divElementosComentarios">
                                    ${comentario.usuario}
                                    <span class="text-warning mr-1">${estrellasHTML}</span>
                                </div>
                                <small class="text-muted">${comentario.fecha}</small>
                            </h5>
                            <p>${comentario.comentario}</p>
                        </div>
                    </div>
                `;
                comentariosContainer.innerHTML += nuevoComentario;
            }
        } else {
            comentariosContainer.innerHTML += 'No hay comentarios disponibles para este producto.';
        }
    }

    function generarEstrellasHTML(calificacion) {
        let estrellasHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= calificacion) {
                estrellasHTML += '<span class="star checked">&#9733;</span>';
            } else {
                estrellasHTML += '<span class="star">&#9733;</span>';
            }
        }
        return estrellasHTML;
    }

    function actualizarEstrellasSeleccionadas() {
        stars.forEach((star, index) => {
            if (index < calificacion) {
                star.classList.add('checked');
            } else {
                star.classList.remove('checked');
            }
        });
    }

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const starId = star.id.substr(4);
            calificacion = parseInt(starId);
            actualizarEstrellasSeleccionadas();
        });
    });
});