import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

import * as dotenv from "dotenv";
dotenv.config();

const config = {
	apiKey: process.env.apiKey,
	authDomain: process.env.authDomain,
	databaseURL: process.env.databaseURL,
	storageBucket: process.env.storageBucket,
	messagingSenderId: process.env.messagingSenderId,
};

const app = initializeApp(config);

export const database = getDatabase(app);
