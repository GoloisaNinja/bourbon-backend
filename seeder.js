import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/db.js';
import Bourbon from './models/Bourbon.js';
import bourbonSeeder from './bourbonSeeder.js';

connectDB();

const importData = async () => {
	try {
		await Bourbon.deleteMany();
		await Bourbon.insertMany(bourbonSeeder);
		console.log('bourbon data was imported successfully...');
		process.exit();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

const destroyData = async () => {
	try {
		await Bourbon.deleteMany();
		console.log('bourbon data was destroyed...');
		process.exit();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

if (process.argv[2] === '-d') {
	destroyData();
} else {
	importData();
}
