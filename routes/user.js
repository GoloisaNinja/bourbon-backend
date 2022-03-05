import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import apikey from '../middleware/apikey.js';
import User from '../models/User.js';
import Bourbon from '../models/Bourbon.js';

// Create a new User

router.post('/api/user', apikey, async (req, res) => {
	const user = await new User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (error) {
		const errors = [];
		if (error) {
			for (const [key, { message }] of Object.entries(error.errors)) {
				errors.push(message);
			}
		}
		res.status(400).send(errors);
	}
});

// Login existing user

router.post('/api/user/login', apikey, async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		await user.save();
		res.status(200).send({ user, token });
	} catch (error) {
		res.status(401).send({ message: 'Login failed...' });
	}
});

// Logout user by updating user token array

router.post('/api/user/logout', apikey, auth, async (req, res) => {
	const user = await req.user;
	try {
		const token = req.token;
		if (!user) {
			return res.status(404).send({ message: 'Please authenticate...' });
		}
		user.tokens = user.tokens.filter(
			(storedToken) => storedToken.token !== token
		);
		await user.save();
		res.status(200).send({ message: 'Logout successful...' });
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

// Load an existing user

router.get('/api/user/auth', apikey, auth, async (req, res) => {
	const user = await req.user;
	try {
		if (user) {
			return res.status(200).send(user);
		} else {
			throw new Error('Please authenticate...');
		}
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

export default router;
