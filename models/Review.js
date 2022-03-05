import mongoose from 'mongoose';
import validator from 'validator';

const { Schema, model } = mongoose;

const ReviewSchema = new Schema(
	{
		user: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
			username: {
				type: String,
				required: true,
			},
		},
		bourbonName: {
			type: String,
			required: true,
		},
		bourbon_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Bourbon',
			required: true,
		},
		reviewTitle: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isLength(value, { min: 1, max: 100 })) {
					throw new Error('Review title must be between 1 and 100 characters');
				}
			},
		},
		reviewScore: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isInt(value, { gt: -1, lt: 11 })) {
					throw new Error('Review score must be between 0 and 10');
				}
			},
		},
		reviewText: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isLength(value, { min: 1, max: 1000 })) {
					throw new Error('Review text must be between 1 and 1000 characters');
				}
			},
		},
	},
	{ timestamps: true }
);

const Review = model('Review', ReviewSchema);
export default Review;
