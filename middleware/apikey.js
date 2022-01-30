import Keys from '../models/Keys.js';

const apikey = async (req, res, next) => {
	const reqKey = req.query.apiKey;
	try {
		const key = await Keys.findOne({
			key: reqKey,
		});

		if (!key) {
			throw new Error();
		}
		key.usage.unshift({ url: req.url });
		await key.save();
		req.key = key;
		next();
	} catch (error) {
		res.status(401).send({
			error: 'You need to request a valid API Key to use this service...',
		});
	}
};
export default apikey;
