import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
	apiKey: "AIzaSyB9MCEcucYH405NY8sha2tvkYA8OVN8dEQ",
	authDomain: "vuegram-39cb7.firebaseapp.com",
	databaseURL: "https://vuegram-39cb7.firebaseio.com",
	projectId: "vuegram-39cb7",
	storageBucket: "vuegram-39cb7.appspot.com",
	messagingSenderId: "530463440874"
}

firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
	timestampsInSnapshots: true
}

db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

export {
  db,
  auth,
  currentUser,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
}
