import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/db.js';
import Keys from './models/Keys.js';
import { nanoid } from 'nanoid';

connectDB();

const keySeederArray = [
	{
		user: 'Jack Collins',
		key: nanoid(),
		active: true,
	},
	{
		user: 'Amanda McMullin',
		key: nanoid(),
		active: true,
	},
];

const createKeys = async () => {
	try {
		await Keys.insertMany(keySeederArray);
		console.log('keys created successfully...');
		process.exit();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

if (process.argv[2] === '-d') {
	console.log('no destroy keys function as yet');
} else {
	createKeys();
}
