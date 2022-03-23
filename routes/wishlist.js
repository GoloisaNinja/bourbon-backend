import express from 'express';
const router = express.Router();

import { Bourbon } from '../models/Bourbon.js';
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
		const { name, isPrivate } = req.body;
		const wishlistObject = {
			user: { id: user._id, username: user.username },
			name,
		};
		const wishlist = await new Wishlist(wishlistObject);
		if (isPrivate === false) {
			wishlist.private = false;
		}
		await wishlist.save();
		user.wishlists.unshift({
			wishlist_id: wishlist._id,
			wishlist_name: name,
		});
		await user.save();
		res.status(201).send({ wishlist, user_wishlists: user.wishlists });
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Update/edit an existing Wishlist private flag and title

router.patch('/api/wishlist/update/:id', apikey, auth, async (req, res) => {
	const user = await req.user;
	const _id = req.params.id;
	const { name, isPrivate } = req.body;
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
		wishlist.name = name;
		wishlist.private = isPrivate;
		await wishlist.save();
		const wishlists = await Wishlist.find({ 'user.id': user._id }).sort({
			updatedAt: -1,
		});
		const userWishlistIndex = user.wishlists.findIndex(
			(userwishlist) =>
				userwishlist.wishlist_id.toString() === wishlist._id.toString()
		);
		user.wishlists[userWishlistIndex].wishlist_name = name;
		await user.save();
		res
			.status(200)
			.send({ wishlist, wishlists, user_wishlists: user.wishlists });
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Add a bourbon to an existing wishlist

router.post('/api/wishlist/add/:id', apikey, auth, async (req, res) => {
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
		const wishlist = await Wishlist.findOne({ _id });
		if (!wishlist) {
			return res.status(404).send({ message: 'Wishlist not found...' });
		}
		if (wishlist.user.id.toString() !== user._id.toString()) {
			return res.status(401).send({ message: 'Unauthorized...' });
		}
		const userWishlistIndex = user.wishlists.findIndex(
			(userwishlist) =>
				userwishlist.wishlist_id.toString() === wishlist._id.toString()
		);
		user.wishlists[userWishlistIndex].bourbons.unshift({
			bourbon_id: bourbon._id,
		});
		await user.save();
		wishlist.bourbons.unshift(bourbon);
		await wishlist.save();
		res.status(200).send({ wishlist, user_wishlists: user.wishlists });
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Delete a bourbon from an existing wishlist

router.delete(
	'/api/wishlist/delete/:wishlistId/:bourbonId',
	apikey,
	auth,
	async (req, res) => {
		const user = await req.user;
		if (!user) {
			return res.status(404).send({ message: 'User not found...' });
		}
		const { wishlistId, bourbonId } = req.params;
		try {
			const wishlist = await Wishlist.findOne({ _id: wishlistId });
			if (!wishlist) {
				return res.status(404).send({ message: 'Wishlist not found...' });
			}
			if (wishlist.user.id.toString() !== user._id.toString()) {
				return res.status(401).send({ message: 'Unauthorized...' });
			}
			const bourbonIndex = wishlist.bourbons.findIndex(
				(bourbon) => bourbon._id.toString() === bourbonId
			);
			if (bourbonIndex === -1) {
				return res.status(404).send({ message: 'Bourbon not in wishlist...' });
			}
			wishlist.bourbons.splice(bourbonIndex, 1);
			await wishlist.save();
			const userWishlistIndex = user.wishlists.findIndex(
				(userwishlist) =>
					userwishlist.wishlist_id.toString() === wishlist._id.toString()
			);
			const uwBourbonIndex = user.wishlists[
				userWishlistIndex
			].bourbons.findIndex(
				(uwbourbon) => uwbourbon.bourbon_id.toString() === bourbonId
			);
			user.wishlists[userWishlistIndex].bourbons.splice(uwBourbonIndex, 1);
			await user.save();
			res.status(200).send({ wishlist, user_wishlists: user.wishlists });
		} catch (error) {
			res.status(400).send({ message: error.message });
		}
	}
);

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

// Get all (public & private) user Wishlists by UserId

router.get('/api/wishlists', apikey, auth, async (req, res) => {
	const user = await req.user;
	try {
		const wishlists = await Wishlist.find({ 'user.id': user._id }).sort({
			updatedAt: -1,
		});
		if (!wishlists) {
			return res.status(404).send({ message: 'No Wishlists...' });
		}
		res.status(200).send(wishlists);
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
		wishlist.delete();
		const userWishlistIndex = user.wishlists.findIndex(
			(wishlist) => wishlist.wishlist_id.toString() === _id
		);
		if (userWishlistIndex !== -1) {
			user.wishlists.splice(userWishlistIndex, 1);
			await user.save();
		}
		res.status(200).send(user.wishlists);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

export default router;
