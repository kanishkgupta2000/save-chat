/* TODO: break this file into smaller segments */
import firebase from "firebase/app";
import "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCU3XcDrZKAvF7CgkGc4gpul_Crzen5BqE",
    authDomain: "memsave-c0d28.firebaseapp.com",
    projectId: "memsave-c0d28",
    storageBucket: "memsave-c0d28.appspot.com",
    messagingSenderId: "830067013642",
    appId: "1:830067013642:web:d2c5a0e6a4d32bfcf987f3",
    measurementId: "G-ZD4M3DR1PR"
  };
  // Initialize Firebasez
  firebase.initializeApp(firebaseConfig);
 export  const db = firebase.firestore(); 
//we try to obtain all the details of the user beforehand for once , so that reads are saved 

 export const makeDiary=async(diaryName)=>{
     // in collection 'diaries' -> build a document with docid 'diaryName'
 }
export const reviewDiaries=async()=>{
// will give the names of the diaries as well as the content arrays 
}
export const addMessageToDiary=async (diaryName)=>{
//add message to the diary's array 
}
export const reviewAttachments=async()=>{
// find blob storage for this work 
}
export const reviewChatDump=async()=>{
// just get array of chats
}

 export default firebase;
