import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const BourbonSchema = new Schema({
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
	abv_value: {
		type: Number,
	},
	age: {
		type: String,
	},
	age_value: {
		type: Number,
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
export const Bourbon = model('Bourbon', BourbonSchema);
