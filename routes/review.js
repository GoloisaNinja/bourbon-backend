import express from 'express';
const router = express.Router();

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
		user: user._id,
		username: user.username,
		bourbonName,
		bourbon_id,
		reviewTitle,
		reviewScore,
		reviewText,
	};
	try {
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

export default router;
