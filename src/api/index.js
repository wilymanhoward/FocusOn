// Import the functions you need from the SDKs you need
import firebase from "firebase";
import sha256 from 'crypto-js/sha256';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADVOQtH11KiITUNNar91Cvkow6vLEAjvA",
  authDomain: "focuson-88869.firebaseapp.com",
  projectId: "focuson-88869",
  storageBucket: "focuson-88869.appspot.com",
  messagingSenderId: "553201675821",
  appId: "1:553201675821:web:7d7741d898489a53f212a4",
  measurementId: "G-7Q6DWZV5RZ"
};

// Initialize Firebase
if (firebase.apps.length === 0)
    firebase.initializeApp(firebaseConfig)

const db = firebase.firestore();
const UserDB = db.collection("users")
const TaskDB = db.collection('tasks');
const auth = firebase.auth();
const storage = firebase.storage();
const PrivateKey = 'hscoding@123'

export function encrypt(text){
  const hashDigest = sha256(text);
  const hmacDigest = hmacSHA256(hashDigest, PrivateKey);
  return Base64.stringify(hmacDigest)
}

export function getUsers(username) {

  return new Promise((resolve, reject) => {
      UserDB.get()
      .then((snapshot) => {
          // snapshot.docs : all the documents existed in this collection
          // snapshot.docs.length ( len(snapshot.docs)  in python )
          // in python: for x in range(0, len(snapshot.docs), 1): ...
          let userList = []
          for (let x=0; x < snapshot.docs.length; x++)
          {
              const userData = snapshot.docs[x];
              
              userList.push({
                  id:userData.id,
                  fullname: userData.data().fullname,
                  username: userData.data().username,
                  role: userData.data().role,
                  address: userData.data().address
              })
          }
          console.log('userList create in getUsers =', userList);
          resolve(userList);
      })
      .catch((err) => reject(err))
  })
}

export function createdUser(username, password, name)
{
  return new Promise((resolve, reject) => {
    if (username && password && name)
    {
      UserDB.add({
        name: name,
        username: username.toLowerCase(),
        password: encrypt(password)
      })
      .then((doc) => resolve(doc.id))
      .catch((err) => reject(err.message))
    }
    else
    {
      reject("Missing parameter username/password/name")
    }
  })
}



export function login(username, password) {
  return new Promise ((resolve, reject) => {
    UserDB.where("username", "==", username)
    .where("password", "==", encrypt(password)).get().then((response) =>{
      //documentnya disimpan di respose.docs
      const document = response.docs[0];

      let userData = {
        id:document.id,
        fullname: document.data().name,
        username: document.data().username,
      }
      resolve(userData)
      
    })
    .catch((err) => reject(err))
  })
}

export function addTask(Task, username)
{
  
  return new Promise((resolve, reject) => {
    TaskDB.add({
      Name: Task,
      username: username,
    }).then((response) => resolve(response))
    .catch((err) => reject(err))
  })
}

export function getTask(username)
{
    return new Promise((resolve, reject) => {
      TaskDB.where("username", "==", username).get().then((response) =>{
        let TaskArray = [];
        // For all the documents we got from database
        // we insert into an array
        // all documents : response.docs (array of documents)
        for (let i=0; i < response.docs.length; ++i)
        {
          const document = response.docs[i];
          // document.data() => get the object document of firebase firestore
          // document.data().<field key> => field key must exactly the same with firestore docs
          TaskArray.push({
            id: document.id,
            Task: document.data().Name,
          })
        }
      // after we make the photoArray, resolve back with this array
      resolve(TaskArray)

      })
        // .where(<column name>, <operator, e.g. == , <value>)
        // for example we want to find photo that has username == 'abc@gmail.com'
        // .where('username', '==', 'abc@gmail.com)
      .catch((err) => reject(err))
    })
}

export function deleteTask(id)
{
  return new Promise((resolve, reject) => {
    // Get task details from this id
    //Delete from Database
    TaskDB.doc(id).delete().then(() => resolve())
    .catch((err) => reject(err))
  })
}

export function saveCookie(key,value)
{
    window.localStorage.setItem(key, JSON.stringify(value))
}

export function getCookie(key)
{
    const value = window.localStorage.getItem(key);
    if (value)
        return JSON.parse(value)
    else
        return null;
}

export function clearCookie()
{
    window.localStorage.clear()
}