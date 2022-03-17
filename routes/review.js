import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import User from '../models/User.js';
import apikey from '../middleware/apikey.js';
import auth from '../middleware/auth.js';

// Create a new Review

router.post('/api/review', apikey, auth, async (req, res) => {
	const user = await req.user;
	const { bourbon_id, bourbonName, reviewTitle, reviewScore, reviewText } =
		req.body;
	const reviewObject = {
		user: { id: user._id, username: user.username },
		bourbonName,
		bourbon_id,
		reviewTitle,
		reviewScore,
		reviewText,
	};

	try {
		const existingReview = await Review.find({
			$and: [
				{ 'user.id': user._id },
				{ bourbon_id: mongoose.Types.ObjectId(bourbon_id) },
			],
		});
		if (existingReview.length) {
			throw new Error('User has already reviewed this bourbon');
		}
		const review = await new Review(reviewObject);
		await review.save();
		user.reviews.unshift({
			review_id: review._id,
			review_title: review.reviewTitle,
		});
		await user.save();
		res.status(201).send(review);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Edit an existing Review

router.patch('/api/review/update/:id', apikey, auth, async (req, res) => {
	const user = await req.user;
	const _id = req.params.id;
	const { reviewTitle, reviewScore, reviewText } = req.body;
	const reviewFields = { reviewTitle, reviewScore, reviewText };
	try {
		let review = await Review.findOne({ _id });
		if (!review) {
			return res.status(404).send({ message: 'Review not found...' });
		}
		if (review.user.id.toString() !== user._id.toString()) {
			return res.status(401).send({ message: 'Unauthorized...' });
		}
		review = await Review.findOneAndUpdate(
			{ _id },
			{ $set: reviewFields },
			{ new: true }
		);
		await review.save();
		const userReviewIndex = user.reviews.findIndex(
			(review) => review.review_id.toString() === _id
		);
		user.reviews[userReviewIndex].review_title = reviewTitle;
		await user.save();
		const reviews = await Review.find({ 'user.id': user._id }).sort({
			updatedAt: -1,
		});
		res.status(200).send({ review, reviews });
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Get an existing Review by ID - all reviews are treated as public and do not have a "private" field

router.get('/api/review/:id', apikey, async (req, res) => {
	const _id = req.params.id;
	try {
		const review = await Review.findOne({ _id });
		if (!review) {
			return res.status(404).send({ message: 'Review not found...' });
		}
		res.status(200).send(review);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Get all Reviews associated with the BourbonID they belong to

router.get('/api/reviews/:bourbonId', apikey, async (req, res) => {
	const bourbonId = req.params.bourbonId;
	try {
		const reviews = await Review.find({ bourbon_id: bourbonId }).sort({
			updatedAt: -1,
		});
		if (!reviews.length) {
			return res.status(404).send({ message: 'No reviews' });
		}
		res.status(200).send(reviews);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Get all Reviews associated with the UserID they belong to

router.get('/api/reviews/user/:userId', apikey, async (req, res) => {
	const userId = req.params.userId;
	try {
		const reviews = await Review.find({ 'user.id': userId }).sort({
			updatedAt: -1,
		});
		if (!reviews.length) {
			return res.status(404).send({ message: 'No reviews' });
		}
		res.status(200).send(reviews);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Delete an existing Review

router.delete('/api/review/:id', apikey, auth, async (req, res) => {
	const user = await req.user;
	const _id = req.params.id;
	try {
		const review = await Review.findOne({ _id });
		if (!review) {
			return res.status(404).send({ message: 'Review not found...' });
		}
		if (review.user.id.toString() !== user._id.toString()) {
			return res.status(401).send({ message: 'Unauthorized...' });
		}
		review.delete();
		const userReviewIndex = user.reviews.findIndex(
			(review) => review.review_id.toString() === _id
		);
		if (userReviewIndex !== -1) {
			user.reviews.splice(userReviewIndex, 1);
			await user.save();
		}
		res.status(200).send(user.reviews);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

export default router;
