import firebase from 'firebase/app';
import 'firebase/firestore'; 
import 'firebase/storage';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/messaging';
import { firebaseConfig } from './config';

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const analytics = firebase.analytics()

const auth = firebase.auth()
auth.languageCode = localStorage.getItem('i18nextLng') || 'en';
// auth.useEmulator('http://localhost:9099')
const firestore = firebase.firestore()
firestore.settings({
  // host: process.env.REACT_APP_HOST,
  cacheSizeBytes: 1000 * 1000 * 15,
  merge: true
})
firestore.enablePersistence().catch((err)=>console.error(err))
// firestore.useEmulator('localhost', 8081)

const storage = firebase.storage()
// storage.useEmulator('localhost', 9199)

const functions = firebase.functions()
// functions.useEmulator('localhost', 5001)
let messaging = null;
if(firebase.messaging.isSupported()){
  messaging = firebase.messaging()
}

export const getToken = (callback)=> messaging && messaging
.getToken({vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY})
.then((currentToken)=>{
    if(currentToken){
        callback(currentToken)
    }else{
        callback(null)
    }
})

export const onMessageListener = () => messaging && new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
});


export default firebase