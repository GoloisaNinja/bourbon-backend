import mongoose from 'mongoose';

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
	},
	{ timestamps: true }
);

const Wishlist = model('Wishlist', WishlistSchema);
export default Wishlist;
