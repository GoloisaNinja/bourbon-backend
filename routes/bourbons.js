import express from 'express';
const router = express.Router();
import Bourbon from '../models/Bourbon.js';

// Get paginated bourbons

router.get('/api/bourbons', async (req, res) => {
	let page = await parseInt(req.query.page);
	if (!page) {
		page = 1;
	}
	const limit = 20;
	const skip = (page - 1) * limit;
	try {
		const bourbons = await Bourbon.find().skip(skip).limit(limit);
		if (!bourbons) {
			return res.status(404).send({ message: 'No bourbons found...' });
		}
		res.status(200).send(bourbons);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export default router;
