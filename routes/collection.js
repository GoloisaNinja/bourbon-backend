import express from 'express';
const router = express.Router();

import Bourbon from '../models/Bourbon.js';
import User from '../models/User.js';
import Collection from '../models/Collection.js';
import auth from '../middleware/auth.js';
import apikey from '../middleware/apikey.js';

// Create a new Collection

router.post('/api/collection', apikey, auth, async (req, res) => {
	const user = await req.user;
	if (!user) {
		return res.status(404).send({ message: 'User not found...' });
	}
	try {
		const name = req.body.name;
		const collectionObject = {
			user: { id: user._id, username: user.username },
			name,
		};
		const collection = await new Collection(collectionObject);
		await collection.save();
		res.status(201).send(collection);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Add a bourbon to an existing collection

router.post('/api/collection/add/:id', apikey, auth, async (req, res) => {
	const user = await req.user;
	if (!user) {
		return res.status(404).send({ message: 'User not found...' });
	}
	const _id = req.params.id;
	const { bourbonId, bourbonTitle } = req.body;
	const bourbonObject = { title: bourbonTitle, bourbon_id: bourbonId };
	try {
		const collection = await Collection.findOne({ _id });
		if (!collection) {
			return res.status(404).send({ message: 'Collection not found...' });
		}
		collection.bourbons.unshift(bourbonObject);
		await collection.save();
		res.status(200).send(collection);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

export default router;
