const express = require('express');
const termModal = require('../modal/mongo.modal');
const { StatusCodes } = require('http-status-codes');
const cloneData = require('../modal/dictionay_data_modal');

const app = express();

// populating mongo datacollection
async function getAlldata(req, res) {
	const addTerms = await termModal.insertMany(cloneData);
	res.status(StatusCodes.OK).json({ cloneData });
}

//getting data from mongo collection
async function getDataOnly(req, res) {
	const { id: name } = req.params;
	const findSingleTerms = await termModal.find(
		{
			term: name,
		},
		{
			_id: 0,
			__v: 0,
		}
	);
	if (findSingleTerms.length < 1) {
		res.status(StatusCodes.BAD_REQUEST).json({
			msg: 'Term not available',
		});
	} else {
		res.status(StatusCodes.OK).json({ findSingleTerms });
	}
}

//exporting requirements
module.exports = {
	getAlldata,
	getDataOnly,
};
