// Aquí estamos seleccionando diferentes elementos del DOM utilizando su id. Estos elementos serán utilizados posteriormente en el código.
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

// Este objeto objBusqueda almacenará los valores de la moneda y criptomoneda seleccionados por el usuario.
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

// Esta función retorna una Promise que resuelve criptomonedas.
// Las Promises son utilizadas para manejar operaciones asincrónicas.
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

// El evento 'DOMContentLoaded' se dispara cuando el documento HTML ha sido completamente cargado.
// Aquí añadimos event listeners para varios eventos.
document.addEventListener('DOMContentLoaded', () => {
    // Llama a la función consultarCriptomonedas cuando el documento está completamente cargado.
    consultarCriptomonedas();
    // Añade un event listener al formulario para manejar el evento de envío (submit).
    formulario.addEventListener('submit', submitFormulario);
    // Añade event listeners a los select de criptomonedas y monedas para manejar el cambio de selección.
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

// Esta función consulta la API de cryptocompare para obtener un listado de las criptomonedas top por capitalización de mercado.
function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    // Fetch es utilizado para hacer una solicitud a la URL proporcionada.
    fetch(url)
        .then(respuesta => respuesta.json()) // Convierte la respuesta en un objeto JSON.
        .then(resultado => obtenerCriptomonedas(resultado.Data)) // Llama a la función obtenerCriptomonedas con el resultado.
        .then(criptomonedas => selectCriptomonedas(criptomonedas)) // Llama a la función selectCriptomonedas con las criptomonedas.
        .catch(error => console.log(error)); // Captura cualquier error que ocurra durante la solicitud fetch y lo imprime en consola.
}

// Esta función se utiliza para llenar el select de criptomonedas con opciones.
function selectCriptomonedas(criptomonedas) {
    // Itera sobre cada criptomoneda.
    criptomonedas.forEach(cripto => {
        // Desestructura el objeto cripto para obtener FullName y Name de CoinInfo.
        const { FullName, Name } = cripto.CoinInfo;
        // Crea un nuevo elemento option.
        const option = document.createElement('OPTION');
        // Establece el valor y el texto del option.
        option.value = Name;
        option.textContent = FullName;
        // Añade el option al select de criptomonedas.
        criptomonedasSelect.appendChild(option);
    });
}

// Esta función es llamada cada vez que cambia el valor de los select.
// Actualiza objBusqueda con el nombre y el valor del select cambiado.
function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

// Esta función maneja el envío del formulario.
function submitFormulario(e) {
    e.preventDefault(); // Esto previene que el formulario se envíe de la manera predeterminada (evita la recarga de la página).
    // Extraer los valores de objBusqueda.
    const { moneda, criptomoneda } = objBusqueda;
    // Comprueba si tanto la moneda como la criptomoneda están presentes. Si no, muestra una alerta.
    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return; // Sale de la función para no ejecutar el código posterior.
    }
    // Llama a la función consultarAPI que consultará la API para obtener la cotización de la criptomoneda.
    consultarAPI();
}

// Esta función muestra una alerta en el DOM.
function mostrarAlerta(mensaje) {
    // Busca un elemento con la clase 'error' en el DOM.
    // Esto es para asegurar que no se muestren múltiples mensajes de error al mismo tiempo.
    const existeError = document.querySelector('.error');
    // Si no existe un elemento con la clase 'error', procede a crear y mostrar el mensaje de error.
    if (!existeError) {
        // Crea un nuevo elemento div para mostrar el mensaje de error.
        const divMensaje = document.createElement('DIV');
        // Añade la clase 'error' al div creado.
        // Esto podría ser útil para aplicar estilos al mensaje de error mediante CSS.
        divMensaje.classList.add('error');
        // Asigna el mensaje recibido como argumento al contenido de texto del div.
        divMensaje.textContent = mensaje;
        // Inserta el div del mensaje de error dentro del formulario en el DOM.
        // Esto hará que el mensaje de error sea visible para el usuario.
        formulario.appendChild(divMensaje);
        // Establece un temporizador para eliminar el div del mensaje de error después de 3 segundos.
        // Esto es para asegurarse de que el mensaje de error no permanezca visible indefinidamente.
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

// Esta función realiza la consulta a la API para obtener la cotización de la criptomoneda.
function consultarAPI() {
    // Extrae los valores de moneda y criptomoneda de objBusqueda.
    const { moneda, criptomoneda } = objBusqueda;

    // Construye la URL para la consulta de la API con los valores de moneda y criptomoneda.
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    // Llama a la función mostrarSpinner.
    mostrarSpinner();

    // Realiza una solicitud fetch a la URL.
    fetch(url)
        .then(respuesta => respuesta.json()) // Convierte la respuesta en un objeto JSON.
        .then(cotizacion => {
            // Llama a la función mostrarCotizacionHTML (aunque no está definida en el fragmento proporcionado) con la cotización obtenida.
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        });
}
// Esta función muestra la cotización recibida en el HTML.
function mostrarCotizacionHTML(cotizacion) {
    // Llama a la función limpiarHTML para asegurarse de que el área de resultado esté limpia antes de agregar nueva información.
    limpiarHTML();

    // Desestructura los datos relevantes de la cotización.
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    // Crea un nuevo párrafo y lo asigna a la variable precio.
    const precio = document.createElement('p');
    // Añade la clase 'precio' al párrafo.
    precio.classList.add('precio');
    // Inserta el precio dentro del párrafo.
    precio.innerHTML = `El Precio es: <span> ${PRICE} </span>`;

    // Repite los pasos anteriores para los demás datos: precioAlto, precioBajo, ultimasHoras y ultimaActualizacion.
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span> </p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span> </p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última Actualización: <span>${LASTUPDATE}</span></p>`;

    // Añade todos los párrafos creados al elemento resultado en el DOM.
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);

    // También añade el resultado al formulario en el DOM.
    formulario.appendChild(resultado);
}

// Esta función muestra un spinner (animación de carga) en el área de resultado.
function mostrarSpinner() {
    // Limpia el área de resultado antes de mostrar el spinner.
    limpiarHTML();

    // Crea un nuevo div y lo asigna a la variable spinner.
    const spinner = document.createElement('DIV');
    // Añade la clase 'spinner' al div.
    spinner.classList.add('spinner');

    // Inserta el HTML para la animación del spinner dentro del div.
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>    
    `;

    // Añade el div spinner al elemento resultado en el DOM.
    resultado.appendChild(spinner);
}

// Esta función limpia el contenido del área de resultado.
function limpiarHTML() {
    // Mientras el elemento resultado tenga un primer hijo (elemento dentro de él), lo elimina.
    // Esto continuará hasta que no haya más hijos, dejando el área de resultado limpia.
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}
