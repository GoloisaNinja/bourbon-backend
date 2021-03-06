import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, JWT_SECRET);
		const user = await User.findOne({
			_id: decoded._id,
			'tokens.token': token,
		}).select('-password');

		if (!user) {
			throw new Error();
		}
		req.token = token;
		req.user = user;
		next();
	} catch (error) {
		console.log('auth middleware failed');
		res.status(401).send({ message: 'Authorization failure...' });
	}
};
export default auth;
