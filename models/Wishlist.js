import mongoose from 'mongoose';
import { BourbonSchema } from './Bourbon.js';

const { Schema, model } = mongoose;

const WishlistSchema = new Schema(
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
		name: {
			type: String,
			required: true,
		},
		private: {
			type: Boolean,
			required: true,
			default: true,
		},
		bourbons: {
			type: [BourbonSchema],
		},
	},
	{ timestamps: true }
);

const Wishlist = model('Wishlist', WishlistSchema);
export default Wishlist;
