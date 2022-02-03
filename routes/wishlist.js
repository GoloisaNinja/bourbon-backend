import express from 'express';
const router = express.Router();

import Bourbon from '../models/Bourbon.js';
import User from '../models/User.js';
import Wishlist from '../models/Wishlist.js';
import auth from '../middleware/auth.js';
import apikey from '../middleware/apikey.js';

// Create a new Wishlist

router.post('/api/wishlist', apikey, auth, async (req, res) => {
	const user = await req.user;
	if (!user) {
		return res.status(404).send({ message: 'User not found...' });
	}
	try {
		const name = req.body.name;
		const wishlistObject = {
			user: { id: user._id, username: user.username },
			name,
		};
		const wishlist = await new Wishlist(wishlistObject);
		if (req.body.private === false) {
			wishlist.private = false;
		}
		await wishlist.save();
		user.wishlists.unshift({
			wishlist_id: wishlist._id,
			wishlist_name: name,
		});
		await user.save();
		res.status(201).send(wishlist);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Update an existing Wishlist's private flag

router.patch('/api/wishlist/update/:id', apikey, auth, async (req, res) => {
	const user = await req.user;
	const _id = req.params.id;
	const isPrivate = req.body.private;
	if (!user) {
		return res.status(404).send({ message: 'User not found...' });
	}
	try {
		const wishlist = await Wishlist.findOne({ _id });
		if (!wishlist) {
			return res.status(404).send({ message: 'Wishlist not found...' });
		}
		if (wishlist.user.id.toString() !== user._id.toString()) {
			return res.status(401).send({ message: 'Unauthorized...' });
		}
		if (wishlist.private === isPrivate) {
			return res
				.status(200)
				.send({ message: 'Wishlist private state already matches request' });
		}
		wishlist.private = isPrivate;
		await wishlist.save();
		res.status(200).send(wishlist);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Add a bourbon to an existing Wishlist

router.post('/api/wishlist/add/:id', apikey, auth, async (req, res) => {
	const user = await req.user;
	if (!user) {
		return res.status(404).send({ message: 'User not found...' });
	}
	const _id = req.params.id;
	const { bourbonId, bourbonTitle } = req.body;
	const bourbonObject = { title: bourbonTitle, bourbon_id: bourbonId };
	try {
		const wishlist = await Wishlist.findOne({ _id });
		if (!wishlist) {
			return res.status(404).send({ message: 'Wishlist not found...' });
		}
		if (wishlist.user.id.toString() !== user._id.toString()) {
			return res.status(401).send({ message: 'Unauthorized...' });
		}
		wishlist.bourbons.unshift(bourbonObject);
		await wishlist.save();
		res.status(200).send(wishlist);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Delete a bourbon from an existing Wishlist

router.delete('/api/wishlist/delete/:id', apikey, auth, async (req, res) => {
	const user = await req.user;
	if (!user) {
		return res.status(404).send({ message: 'User not found...' });
	}
	const _id = req.params.id;
	const { bourbonId } = req.body;
	try {
		const wishlist = await Wishlist.findOne({ _id });
		if (!wishlist) {
			return res.status(404).send({ message: 'Wishlist not found...' });
		}
		if (wishlist.user.id.toString() !== user._id.toString()) {
			return res.status(401).send({ message: 'Unauthorized...' });
		}
		const bourbonIndex = wishlist.bourbons.findIndex(
			(bourbon) => bourbon.bourbon_id.toString() === bourbonId
		);
		if (bourbonIndex === -1) {
			return res.status(404).send({ message: 'Bourbon not in wishlist...' });
		}
		wishlist.bourbons.splice(bourbonIndex, 1);
		await wishlist.save();
		res.status(200).send(wishlist);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Get a user Wishlist by ID

router.get('/api/wishlist/:id', apikey, auth, async (req, res) => {
	const user = await req.user;
	const _id = req.params.id;
	try {
		const wishlist = await Wishlist.findOne({ _id });
		if (!wishlist) {
			return res.status(404).send({ message: 'Wishlist not found...' });
		}
		if (wishlist.private) {
			if (wishlist.user.id.toString() !== user._id.toString()) {
				return res.status(401).send({ message: 'Unauthorized...' });
			}
			res.status(200).send(wishlist);
		} else {
			res.status(200).send(wishlist);
		}
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Delete an entire user Wishlist by ID

router.delete('/api/wishlist/:id', apikey, auth, async (req, res) => {
	const user = await req.user;
	const _id = req.params.id;
	try {
		const wishlist = await Wishlist.findOne({ _id });
		if (!wishlist) {
			return res.status(404).send({ message: 'Wishlist not found...' });
		}
		if (wishlist.user.id.toString() !== user._id.toString()) {
			return res.status(401).send({ message: 'Unauthorized...' });
		}
		const userWishlistIndex = user.wishlists.findIndex(
			(wishlist) => wishlist.wishlist_id.toString() === _id
		);
		wishlist.delete();
		user.wishlists.splice(userWishlistIndex, 1);
		await user.save();
		res.status(200).send(user.wishlists);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

export default router;
