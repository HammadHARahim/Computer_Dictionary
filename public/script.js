const form = document.getElementById('form');
const modal = document.querySelector('.modal');
const btn = document.querySelector('.submit_btn');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const search = document.querySelector('.form-container-input-txt');
const paraTerm = document.querySelector('.modal_term');
const paraDef = document.querySelector('.modal_Def');
const paraNot = document.querySelector('.modal_Not');
const paraLang = document.querySelector('.modal_Lang');

let dataTerm = [];

const btnClicked = async function (e) {
	e.preventDefault();
	const term = search.value.toLowerCase();
	console.log(term);
	paraTerm.textContent = term;
	openModal();
	await termGet(term);
	paraDef.textContent = dataTerm[0].findSingleTerms[0].defination;
	paraNot.textContent = dataTerm[0].findSingleTerms[0].termNote;
	paraLang.textContent = dataTerm[0].findSingleTerms[0].lang;
	console.log(dataTerm);
};

// error handler
function errorHandler(error) {
	paraDef.textContent = error;
}
// show ovelay and modal
const openModal = function () {
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

// closing overlay and model
const closeModal = function () {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
	setTimeout(() => window.location.reload(true));
};

//getting data with axios
const URL = 'http://localhost:1000/api/v1/terms/';
async function termGet(term) {
	try {
		const response = await axios
			.get(`${URL}${term}`)
			.then((result) => {
				dataTerm.push(result.data);
				console.log(result.data.findSingleTerms[0].defination);
			})
			.catch((error) => {
				const errorInfo = error.response.data.msg;
				errorHandler(errorInfo);
				console.log(error.response.data.msg);
			});
	} catch (error) {
		console.error(error.toJSON());
	}
}

// eventhandlers
form.addEventListener('submit', btnClicked);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	}
});
// close overlay
