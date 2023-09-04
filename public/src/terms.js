import axios from 'axios';

const URL = 'http://localhost:1000/api/v1/terms/';
async function termGet(term) {
	try {
		const response = await axios
			.get(`${URL}${term}`)
			.then(console.log('Success'))
			.catch(console.log('error'));
		console.log(response.data.findSingleTerms[0]);
	} catch (error) {
		console.error(error);
	}
}
export { termGet };
