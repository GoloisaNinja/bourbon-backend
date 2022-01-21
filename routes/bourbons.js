import express from 'express';
const router = express.Router();
import Bourbon from '../models/Bourbon.js';

// Get paginated bourbons

router.get('/api/bourbons', async (req, res) => {
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
		res.status(200).send(bourbons);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export default router;
