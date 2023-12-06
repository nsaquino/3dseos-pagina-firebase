async function cargar() {
    try {
        let response1 = await fetch('/partials/nav.html');
        let response2 = await fetch('/partials/footer.html');
        if (response1.ok && response2.ok) {
            let data1 = await response1.text();
            let data2 = await response2.text();
            document.querySelector('.header').innerHTML = data1;
            document.querySelector('.pie-pagina').innerHTML = data2;
        } else {
            console.error('Error al cargar el archivo', response.statusText);
        }
    } catch (error) {
        console.error('Error al cargar el archivo:', error);
    }
}
//funcion esconder nav
function openNav(){
    document.getElementById("mobile-menu").style.width = "100%";
}

function closeNav(){
    document.getElementById("mobile-menu").style.width = "0%";
}

cargar();