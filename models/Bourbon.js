import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const BourbonSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	distiller: {
		type: String,
	},
	bottler: {
		type: String,
	},
	abv: {
		type: String,
	},
	age: {
		type: String,
	},
	price_array: [String],
	price_value: {
		type: Number,
	},
	review: {
		intro: {
			type: String,
		},
		nose: {
			type: String,
		},
		taste: {
			type: String,
		},
		finish: {
			type: String,
		},
		overall: {
			type: String,
		},
		score: {
			type: String,
		},
		author: {
			type: String,
		},
	},
});
const Bourbon = model('Bourbon', BourbonSchema);

export default Bourbon;
