import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const KeysSchema = new Schema({
	user: {
		type: String,
		required: true,
	},
	key: {
		type: String,
		required: true,
	},
	active: {
		type: Boolean,
		required: true,
		default: true,
	},
	usage: [
		{
			url: {
				type: String,
			},
			accessedOn: {
				type: Date,
				default: Date.now(),
			},
		},
	],
});

const Keys = model('Keys', KeysSchema);
export default Keys;
