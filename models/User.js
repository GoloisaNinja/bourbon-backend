import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const UserSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('please use a valid email');
				}
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (validator.contains(value, 'password')) {
					throw new Error('password cannot contain "password"');
				}
				if (
					!validator.isStrongPassword(value, [
						{ minLength: 7, minLowercase: 1, minUppercase: 1, minSymbols: 1 },
					])
				) {
					throw new Error(
						'password must be at least 7 characters, contain one uppercase, one lowercase and one symbol...'
					);
				}
			},
		},
		collections: [
			{
				collection_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Collection',
					required: true,
				},
				collection_name: {
					type: String,
					required: true,
				},
			},
		],
		wishlists: [
			{
				watchlist_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Watchlist',
					required: true,
				},
			},
		],
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

// Removes the user password and user tokens from being sent in user responses

UserSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;
	return userObject;
};

// Generate, sign, and save auth token to user token array

UserSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

// Return user by finding user with email and password

UserSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error('Unable to login...');
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error('Unable to login...');
	}
	return user;
};

// Lets hash the user plain txt password before adding users password to the user model in the db

UserSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

const User = mongoose.model('User', UserSchema);
export default User;
