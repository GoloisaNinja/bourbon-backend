import express from 'express';
const router = express.Router();

import { Bourbon } from '../models/Bourbon.js';
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
		const { name, isPrivate } = req.body;
		const collectionObject = {
			user: { id: user._id, username: user.username },
			name,
		};
		const collection = await new Collection(collectionObject);
		if (isPrivate === false) {
			collection.private = false;
		}
		await collection.save();
		user.collections.unshift({
			collection_id: collection._id,
			collection_name: name,
		});
		await user.save();
		res.status(201).send({ collection, user_collections: user.collections });
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Update/edit an existing Collection private flag and title

router.patch('/api/collection/update/:id', apikey, auth, async (req, res) => {
	const user = await req.user;
	const _id = req.params.id;
	const { name, isPrivate } = req.body;
	if (!user) {
		return res.status(404).send({ message: 'User not found...' });
	}
	try {
		const collection = await Collection.findOne({ _id });
		if (!collection) {
			return res.status(404).send({ message: 'Collection not found...' });
		}
		if (collection.user.id.toString() !== user._id.toString()) {
			return res.status(401).send({ message: 'Unauthorized...' });
		}
		collection.name = name;
		collection.private = isPrivate;
		await collection.save();
		const collections = await Collection.find({ 'user.id': user._id }).sort({
			updatedAt: -1,
		});
		const userCollectionIndex = user.collections.findIndex(
			(usercollection) =>
				usercollection.collection_id.toString() === collection._id.toString()
		);
		user.collections[userCollectionIndex].collection_name = name;
		await user.save();
		res
			.status(200)
			.send({ collection, collections, user_collections: user.collections });
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
	const { bourbonId } = req.body;
	try {
		const bourbon = await Bourbon.findById(bourbonId);
		if (!bourbon) {
			return res.status(404).send({ message: 'Bourbon not found...' });
		}
		const collection = await Collection.findOne({ _id });
		if (!collection) {
			return res.status(404).send({ message: 'Collection not found...' });
		}
		if (collection.user.id.toString() !== user._id.toString()) {
			return res.status(401).send({ message: 'Unauthorized...' });
		}
		const userCollectionIndex = user.collections.findIndex(
			(usercollection) =>
				usercollection.collection_id.toString() === collection._id.toString()
		);
		user.collections[userCollectionIndex].bourbons.unshift({
			bourbon_id: bourbon._id,
		});
		await user.save();
		collection.bourbons.unshift(bourbon);
		await collection.save();
		res.status(200).send({ collection, user_collections: user.collections });
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Delete a bourbon from an existing collection

router.delete(
	'/api/collection/delete/:collectionId/:bourbonId',
	apikey,
	auth,
	async (req, res) => {
		const user = await req.user;
		if (!user) {
			return res.status(404).send({ message: 'User not found...' });
		}
		const { collectionId, bourbonId } = req.params;
		try {
			const collection = await Collection.findOne({ _id: collectionId });
			if (!collection) {
				return res.status(404).send({ message: 'Collection not found...' });
			}
			if (collection.user.id.toString() !== user._id.toString()) {
				return res.status(401).send({ message: 'Unauthorized...' });
			}
			const bourbonIndex = collection.bourbons.findIndex(
				(bourbon) => bourbon._id.toString() === bourbonId
			);
			if (bourbonIndex === -1) {
				return res
					.status(404)
					.send({ message: 'Bourbon not in collection...' });
			}
			collection.bourbons.splice(bourbonIndex, 1);
			await collection.save();
			const userCollectionIndex = user.collections.findIndex(
				(usercollection) =>
					usercollection.collection_id.toString() === collection._id.toString()
			);
			const ucBourbonIndex = user.collections[
				userCollectionIndex
			].bourbons.findIndex(
				(ucbourbon) => ucbourbon.bourbon_id.toString() === bourbonId
			);
			user.collections[userCollectionIndex].bourbons.splice(ucBourbonIndex, 1);
			await user.save();
			res.status(200).send({ collection, user_collections: user.collections });
		} catch (error) {
			res.status(400).send({ message: error.message });
		}
	}
);

// Get a user Collection by ID

router.get('/api/collection/:id', apikey, auth, async (req, res) => {
	const user = await req.user;
	const _id = req.params.id;
	try {
		const collection = await Collection.findOne({ _id });
		if (!collection) {
			return res.status(404).send({ message: 'Collection not found...' });
		}
		if (collection.private) {
			if (collection.user.id.toString() !== user._id.toString()) {
				return res.status(401).send({ message: 'Unauthorized...' });
			}
			res.status(200).send(collection);
		} else {
			res.status(200).send(collection);
		}
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Get all (public & private) user Collections by UserId

router.get('/api/collections', apikey, auth, async (req, res) => {
	const user = await req.user;
	try {
		const collections = await Collection.find({ 'user.id': user._id }).sort({
			updatedAt: -1,
		});
		if (!collections) {
			return res.status(404).send({ message: 'No Collections...' });
		}
		res.status(200).send(collections);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Delete an entire user Collection by ID

router.delete('/api/collection/:id', apikey, auth, async (req, res) => {
	const user = await req.user;
	const _id = req.params.id;
	try {
		const collection = await Collection.findOne({ _id });
		if (!collection) {
			return res.status(404).send({ message: 'Collection not found...' });
		}
		if (collection.user.id.toString() !== user._id.toString()) {
			return res.status(401).send({ message: 'Unauthorized...' });
		}
		collection.delete();
		const userCollectionIndex = user.collections.findIndex(
			(collection) => collection.collection_id.toString() === _id
		);
		if (userCollectionIndex !== -1) {
			user.collections.splice(userCollectionIndex, 1);
			await user.save();
		}
		res.status(200).send(user.collections);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

export default router;
