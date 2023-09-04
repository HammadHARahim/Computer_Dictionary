const fs = require('fs');
const { parse } = require('csv-parse');

//terms data-structures
const glossary = [];
const cloneData = [];

// specific retreival of terms
function getStream(data) {
	return data['type3'] === 'definition';
}
// retrieving data(terms)
const terms = fs.createReadStream('data/Book5.csv');
// getting data
terms
	.pipe(
		parse({
			columns: true,
		})
	)
	.on('data', (data) => {
		if (getStream(data)) {
			glossary.push(data);
		}
	})
	.on('end', () => {
		const mappedData = glossary.map((data) => {
			return {
				term: data['term'],
				defination: data['descrip'],
				termNote: data['termNote'],
				lang: data['ns1:lang2'],
			};
		});
		Object.assign(cloneData, mappedData);
		console.log(`The length of stream is ${cloneData.length}`);
	})
	.on('error', (err) => console.error(err));

// exporting
module.exports = cloneData;
