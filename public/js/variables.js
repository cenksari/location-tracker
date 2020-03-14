let map;
let myLocation;
let markers = [];
let players = [];
let errorCount = 0;
let currentPlayer = {};
let firstOpening = true;

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
};

firebase.initializeApp(firebaseConfig);

firebase.analytics();

const database = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();