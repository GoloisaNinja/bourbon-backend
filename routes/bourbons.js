import express from 'express';
const router = express.Router();
import Bourbon from '../models/Bourbon.js';
import apikey from '../middleware/apikey.js';

// Get all bourbons from DB
// This response returns nearly 1MB of data and should only be used
// if you truly need access to the entire bourbon db at once...

router.get('/api/bourbons/all', apikey, async (req, res) => {
	try {
		const bourbons = await Bourbon.find({});
		if (!bourbons) {
			return res.status(404).send({ message: 'No bourbons found...' });
		}
		res.status(200).send(bourbons);
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
});

// Get paginated bourbons

router.get('/api/bourbons', apikey, async (req, res) => {
	let page = parseInt(req.query.page);
	// pagination section
	if (!page) {
		page = 1;
	}
	const limit = 20;
	const skip = (page - 1) * limit;
	// search term section
	const searchTerm = req.query.search ? req.query.search.trim() : '';
	// sort section
	let sort;
	let sortDirection = 1;
	if (req.query.sort) {
		const sortSplit = req.query.sort.split('_');
		if (sortSplit[1]) {
			if (sortSplit[1].toLowerCase() === 'desc') {
				sortDirection = -1;
			}
		}
		switch (sortSplit[0].toLowerCase()) {
			case 'abv':
				sort = { abv_value: sortDirection };
				break;
			case 'age':
				sort = { age_value: sortDirection };
				break;
			case 'bottler':
				sort = { bottler: sortDirection };
				break;
			case 'distiller':
				sort = { distiller: sortDirection };
				break;
			case 'price':
				sort = { price_value: sortDirection };
				break;
			case 'score':
				sort = { 'review.score': sortDirection };
				break;
			default:
				sort = { title: 1 };
				break;
		}
	}
	try {
		const totalRecords = await Bourbon.find({
			$or: [
				{ title: new RegExp(searchTerm, 'i') },
				{ distiller: new RegExp(searchTerm, 'i') },
				{ bottler: new RegExp(searchTerm, 'i') },
			],
		}).countDocuments();
		const bourbons = await Bourbon.find({
			$or: [
				{ title: new RegExp(searchTerm, 'i') },
				{ distiller: new RegExp(searchTerm, 'i') },
				{ bottler: new RegExp(searchTerm, 'i') },
			],
		})
			.skip(skip)
			.limit(limit)
			.sort(sort);

		if (!bourbons.length) {
			return res.status(404).send({ message: 'No bourbons found...' });
		}
		res.status(200).send({ bourbons: bourbons, total_records: totalRecords });
	} catch (error) {
		res.status(500).send(error.message);
	}
});

// Get random bourbon
router.get('/api/bourbons/random', apikey, async (req, res) => {
	// search term section
	const searchTerm = req.query.search ? req.query.search.trim() : '';
	try {
		const bourbons = await Bourbon.find({
			$or: [
				{ title: new RegExp(searchTerm, 'i') },
				{ distiller: new RegExp(searchTerm, 'i') },
				{ bottler: new RegExp(searchTerm, 'i') },
			],
		});
		if (!bourbons) {
			return res.status(404).send({ message: 'No bourbons found...' });
		}
		const randomBourbon = bourbons[Math.floor(Math.random() * bourbons.length)];
		if (!randomBourbon) {
			return res.status(404).send({
				message: 'Could not get a random bourbon...that is random...',
			});
		}
		res.status(200).send(randomBourbon);
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
});

// Get a bourbon by bourbon database ID

router.get('/api/bourbons/:id', apikey, async (req, res) => {
	const _id = req.params.id;
	try {
		const bourbon = await Bourbon.findOne({ _id });
		if (!bourbon) {
			res.status(404).send({ message: 'Bourbon not found...' });
		}
		res.status(200).send(bourbon);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

export default router;
