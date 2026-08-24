

/* MADE BY DENN AUTHOR?GAUSA NANYA LAGI DONG WKWK
                   THANKS TO
       - FRIBASE ( Penyedia DB )
       - Denn    ( Author)
       - Zyy     ( Partner )
       - ChatGPT ( Fix Issue ) */ 


// CONFIG FIREBASE GAUSA NGELUH
const firebaseConfig = {
  apiKey: "AIzaSyBIDeA8XcSXSwtBAsC8FlROOhTc9csTqnM",
  authDomain: "my-login-7b49d.firebaseapp.com",
  projectId: "my-login-7b49d",
  storageBucket: "my-login-7b49d.firebasestorage.app",
  messagingSenderId: "479614940061",
  appId: "1:479614940061:web:7ba2d5f549bac0393d3574"
};

firebase.initializeApp(firebaseConfig);

// REGISTER
function register(){
  const email = document.getElementById("regUser").value;
  const password = document.getElementById("regPass").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Register berhasil!");
      window.location.href = "login.html";
    })
    .catch(err => alert(err.message));
}

// LOGIN
function login(){
  const email = document.getElementById("loginUser").value;
  const password = document.getElementById("loginPass").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(err => alert(err.message));
}

// FORGOT PASSWORD
function forgotPassword(){
  const email = document.getElementById("loginUser").value;

  if(!email){
    alert("Masukkan email dulu!");
    return;
  }

  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      alert("Link reset password sudah dikirim ke email!");
    })
    .catch(err => alert(err.message));
}
// LOGOUT
function logout(){
  firebase.auth().signOut()
    .then(() => {
      window.location.href = "login.html";
    });
}