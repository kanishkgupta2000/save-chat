/* TODO: break this file into smaller segments */
const firebase = require("firebase/app");
const admin = require('firebase-admin');
require("firebase/firestore");
const firebaseConfig = {
  apiKey: "AIzaSyCU3XcDrZKAvF7CgkGc4gpul_Crzen5BqE",
  authDomain: "memsave-c0d28.firebaseapp.com",
  projectId: "memsave-c0d28",
  storageBucket: "memsave-c0d28.appspot.com",
  messagingSenderId: "830067013642",
  appId: "1:830067013642:web:d2c5a0e6a4d32bfcf987f3",
  measurementId: "G-ZD4M3DR1PR",
};
// Initialize Firebasez
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
//we try to obtain all the details of the user beforehand for once , so that reads are saved
const retrieveDiaryNames = async (userName) => {
  console.log("retrieveDiaryNames function")
  const list = [];
 const dataSnapshot=await db.collection("users").doc(userName).collection("diaries").get()
 dataSnapshot.forEach(doc=>{
   list.push(doc.id)
   console.log(doc.id+"=>"+doc.data())
 })
  return list;
};
const isDiaryNameUnique = async (diaryName, userName) => {
  console.log("isDiaryNameUnique function")
  const list=await retrieveDiaryNames(userName);
  if(!list.includes(diaryName)) return true
  else return false;
};
const makeDiary = async (diaryName, userName) => {
  console.log("makeDiary function")
  await db.collection("users").doc(userName).collection("diaries").doc(diaryName).set({data:[]})
};
const addMessageToDiary = async (userName,diaryName,userInput) => {
  const docRef=db.doc(`users/${userName}/diaries/${diaryName}`)
  const doc=await docRef.get()
  const data=doc.data().data
  console.log(data)
  data.push({time:Date.now(),data:userInput})
  await docRef.set({data},{merge:true});

  //add message to the diary's array
};
const reviewDiary = async (userName,diaryName) => {
  // will give the content arrays
  const docRef=db.doc(`users/${userName}/diaries/${diaryName}`)
  const doc=await docRef.get()
  const data=doc.data().data
  return data


};

const reviewAttachments = async () => {
  // find blob storage for this work
};
const reviewChatDump = async () => {
  // just get array of chats
};
module.exports.isDiaryNameUnique=isDiaryNameUnique
module.exports.makeDiary=makeDiary
module.exports.addMessageToDiary=addMessageToDiary
module.exports.retrieveDiaryNames=retrieveDiaryNames
module.exports.reviewDiary=reviewDiary



// export default firebase;
