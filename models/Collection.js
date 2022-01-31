import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const CollectionSchema = new Schema({
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
			addedToCollection: {
				type: Date,
				required: true,
				default: Date.now(),
			},
		},
	],
});

const Collection = model('Collection', CollectionSchema);
export default Collection;
