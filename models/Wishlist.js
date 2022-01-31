import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const WishlistSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	bourbons: [
		{
			title: {
				type: String,
				required: true,
			},
			bourbon_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Bourbon',
			},
			addedToWishlist: {
				type: Date,
				required: true,
				default: Date.now(),
			},
		},
	],
});

const Wishlist = model('Wishlist', WishlistSchema);
export default Wishlist;
