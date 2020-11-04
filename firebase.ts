import firebase from 'firebase/app';
import 'firebase/database'

const config = {
	apiKey: process.env.apiKey,
	authDomain: process.env.authDomain,
	databaseURL: process.env.databaseURL,
	storageBucket: process.env.storageBucket,
	messagingSenderId: process.env.messagingSenderId,
}

firebase.initializeApp(config);

export const database = firebase.database();
export default firebase

