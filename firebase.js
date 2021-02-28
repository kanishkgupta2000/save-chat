/* TODO: break this file into smaller segments */
const firebase = require("firebase/app");
const admin = require("firebase-admin");
const path = require("path");
const axios = require("axios");
global.XMLHttpRequest = require("xhr2");

require("firebase/firestore");
require("firebase/storage");
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
var storage = firebase.storage();
var storageRef = storage.ref();

//we try to obtain all the details of the user beforehand for once , so that reads are saved
const retrieveDiaryNames = async (userName) => {
  console.log("retrieveDiaryNames function");
  const list = [];
  const dataSnapshot = await db
    .collection("users")
    .doc(userName)
    .collection("diaries")
    .get();
  dataSnapshot.forEach((doc) => {
    list.push(doc.id);
    console.log(doc.id + "=>" + doc.data());
  });
  return list;
};
const isDiaryNameUnique = async (diaryName, userName) => {
  console.log("isDiaryNameUnique function");
  const list = await retrieveDiaryNames(userName);
  if (!list.includes(diaryName)) return true;
  else return false;
};
const makeDiary = async (diaryName, userName) => {
  console.log("makeDiary function");
  await db
    .collection("users")
    .doc(userName)
    .collection("diaries")
    .doc(diaryName)
    .set({ data: [] });
};
const addMessageToDiary = async (userName, diaryName, userInput) => {
  const docRef = db.doc(`users/${userName}/diaries/${diaryName}`);
  const doc = await docRef.get();
  const data = doc.data().data;
  console.log(data);
  data.push({ time: Date.now(), data: userInput });
  await docRef.set({ data }, { merge: true });

  //add message to the diary's array
};
const reviewDiary = async (userName, diaryName) => {
  // will give the content arrays
  const docRef = db.doc(`users/${userName}/diaries/${diaryName}`);
  const doc = await docRef.get();
  const data = doc.data().data;
  return data;
};

const uploadAttachment = async (userName, result) => {
  console.log("uploadAttachment function");

  const name = result[0].name;
  const contentType = result[0].contentType;
  const contentUrl = result[0].contentUrl;

  const ref = storageRef.child(`users/${userName}/attachments/${name}`);

  const response = await axios.get(contentUrl, { responseType: "arraybuffer" });
  // If user uploads JSON file, this prevents it from being written as "{"type":"Buffer","data":[123,13,10,32,32,34,108..."
  if (response.headers["content-type"] === "application/json") {
    response.data = JSON.parse(response.data, (key, value) => {
      return value && value.type === "Buffer" ? Buffer.from(value.data) : value;
    });
  }

  console.log(response.data);
  let bytes = new Uint8Array(response.data);
  console.log("works");

  // here we needs to send a loading message
  ref.put(bytes).then((snapshot) => {
    console.log("Uploaded a file!");
  });
  // var metadata = {
  //   name,
  //   contentType
  // };
  // ref.put(basic,'base64').then((snapshot) => {
  //   console.log('Uploaded a base64 string!');
  // });
};

const retrieveAttachments = async (userName) => {
  console.log("retrieve Attachments function");
  const ref = storageRef.child(`users/${userName}/attachments`);
  var ans=[]
  await ref
    .listAll()
    .then(async (res) => {
      console.log("pushing paths into array");
      const result = [];
      await res.items.forEach((itemRef) => {
        // console.log(itemRef._delegate._location.path_)
        result.push(itemRef._delegate._location.path_);
      });
      return result;
    })
    .then(async (arr) => {
      console.log(arr)
      const result=[]
      console.log("pushing urls into array");

      const promises = arr.map(async (path) => {
        await storageRef.child(path).getDownloadURL()
          .then(async (url) => {
            await result.push(url)
          });

      })

      const contents = await Promise.all(promises)

   
      return result
    }).then((result)=>{
      console.log("checking final data sent")
      console.log(result)
      ans=result
      return result
    });
    console.log("ans is ")
    console.log(ans)
    return ans
};
const reviewChatDump = async () => {
  // just get array of chats
};
module.exports.isDiaryNameUnique = isDiaryNameUnique;
module.exports.makeDiary = makeDiary;
module.exports.addMessageToDiary = addMessageToDiary;
module.exports.retrieveDiaryNames = retrieveDiaryNames;
module.exports.reviewDiary = reviewDiary;
module.exports.uploadAttachment = uploadAttachment;
module.exports.retrieveAttachments = retrieveAttachments;

// export default firebase;
