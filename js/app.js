const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const selectCripto = document.querySelector("#criptomoneda");

const datos = {};

const obtenerCripto = (criptomonedas) => {
	return new Promise((resolve) => {
		resolve(criptomonedas);
	});
};

document.addEventListener("DOMContentLoaded", () => {
	consultarCripto();
	formulario.addEventListener("submit", listenFormulario);
});

function listenFormulario(e) {
	e.preventDefault();
	datos[e.target.moneda.id] = e.target.moneda.value;
	datos[e.target.criptomoneda.id] = e.target.criptomoneda.value;
	if (Object.values(datos).some((x) => x.length === 0)) mostrarMsj();
	else consultarAPI();
}

function consultarAPI() {
	const { moneda, criptomoneda } = datos;
	url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
	mostrarSpinner();
	setTimeout(() => {
		fetch(url)
			.then((response) => response.json())
			.then((response) =>
				mostrarCotizacion(response.DISPLAY[criptomoneda][moneda])
			);
	}, 500);
}

function mostrarSpinner() {
	clearResultados();
	const spinner = document.createElement("div");
	spinner.className = "spinner";
	spinner.innerHTML = `
		<div class="bounce1"></div>
		<div class="bounce2"></div>
		<div class="bounce3"></div>
	`;
	formulario.appendChild(spinner);
	setTimeout(() => {
		spinner.remove();
	}, 1000);
}

function mostrarCotizacion(datosApi) {
	clearResultados();
	const { PRICE, CHANGEPCT24HOUR, LOWDAY, HIGHDAY, LASTUPDATE } = datosApi;
	const precio = document.createElement("p");
	precio.className = "precio";
	precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

	const precioAlto = document.createElement("p");
	precioAlto.innerHTML = `Precio más alto del día: <span>${HIGHDAY}</span>`;

	const precioBajo = document.createElement("p");
	precioBajo.innerHTML = `Precio más Bajo del día: <span>${LOWDAY}</span>`;

	const ultimasHoras = document.createElement("p");
	ultimasHoras.innerHTML = `Variación ultimas horas: <span>${CHANGEPCT24HOUR}%</span>`;

	const ultimaCotizacion = document.createElement("p");
	ultimaCotizacion.innerHTML = `Ultima cotizacion: <span>${LASTUPDATE}</span>`;

	resultado.append(
		precio,
		precioAlto,
		precioBajo,
		ultimasHoras,
		ultimaCotizacion
	);
}

function clearResultados() {
	while (resultado.firstChild) resultado.firstChild.remove();
}

function mostrarMsj(msj = "Campos Requeridos") {
	const yaExiste = document.querySelector(".error");

	if (!yaExiste) {
		const divMensaje = document.createElement("div");
		divMensaje.className = "error";
		divMensaje.textContent = msj;
		formulario.insertBefore(divMensaje, formulario.lastElementChild);

		setTimeout(() => {
			divMensaje.remove();
		}, 2000);
	}
}

function consultarCripto() {
	const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;
	fetch(url)
		.then((response) => response.json())
		.then((response) => obtenerCripto(response.Data))
		.then((modenas) => addCriptomonedas(modenas));
}

function addCriptomonedas(monedas) {
	monedas.forEach((moneda) => {
		const { FullName, Name } = moneda.CoinInfo;
		const option = document.createElement("option");
		option.textContent = FullName;
		option.value = Name;
		selectCripto.appendChild(option);
	});
}
