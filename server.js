import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './db/db.js';
import bourbonRoute from './routes/bourbons.js';
import userRoute from './routes/user.js';
import collectionRoute from './routes/collection.js';
import wishlistRoute from './routes/wishlist.js';
import reviewRoute from './routes/review.js';

// prep work for deployment

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// create the server

const app = express();

// connect to our database

connectDB();

// init middleware

app.use(express.json({ extended: false }));
app.use(cors());

// define routes
app.use(bourbonRoute);
app.use(userRoute);
app.use(collectionRoute);
app.use(wishlistRoute);
app.use(reviewRoute);

// create our fallback for production if deployed as combined project
// architecture

// if (process.env.NODE_ENV === 'production') {
// 	app.use(express.static('client/build'));
// 	app.get('*', (req, res) => {
// 		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// 	});
// }

const PORT = process.env.PORT || 5000;

// listen for the server

app.listen(PORT, () => console.log(`Server is up on ${PORT}`));
