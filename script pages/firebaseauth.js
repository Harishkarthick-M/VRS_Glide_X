// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA0uFhTDnbrGHPpK3Hl3deKHL7nc_rKFsE",
    authDomain: "login-page-55b15.firebaseapp.com",
    projectId: "login-page-55b15",
    storageBucket: "login-page-55b15.appspot.com",
    messagingSenderId: "989075898921",
    appId: "1:989075898921:web:39f1d0eff14d6476c1d238",
    measurementId: "G-44CL6EQPZ4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Sign-up event handler
const signUpForm = document.getElementById('sign-up-form');
if (signUpForm) {
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const username = document.getElementById('username').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Store user data in Firestore
                return db.collection('users').doc(user.uid).set({
                    uid: user.uid,
                    email: email,
                    username: username,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
            .then(() => {
                alert('Account created successfully and data stored!');
                window.location.href = '../pages/sign_in.html'; // Redirect after sign-up
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

// Sign-in event handler
const signInForm = document.getElementById('sign-in-form');
if (signInForm) {
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                alert('Signed in successfully!');
                window.location.href = '../pages/home.html'; // Redirect to home page after sign-in
            })
            .catch((error) => {
                alert('USER NOT FOUND check your email or password.');
            });
    });
}

// Google Sign-In event handler
const googleLogin = document.getElementById('google-login');
if (googleLogin) {
    googleLogin.addEventListener('click', (e) => {
        e.preventDefault();
        const googleProvider = new firebase.auth.GoogleAuthProvider();

        auth.signInWithPopup(googleProvider)
            .then((result) => {
                const user = result.user;

                // Store user data in Firestore if it doesn't exist
                const userRef = db.collection('users').doc(user.uid);
                userRef.get().then((doc) => {
                    if (!doc.exists) {
                        return userRef.set({
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                });
            })
            .then(() => {
                alert('Signed in with Google and data stored successfully!');
                window.location.href = '../pages/home.html'; // Redirect after Google sign-in
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

// Forgot password handler
const forgotPassword = document.querySelector('.forgot-password');
if (forgotPassword) {
    forgotPassword.addEventListener('click', () => {
        const email = prompt("Please enter your email for password reset:");
        if (email) {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    alert('Password reset email sent!');
                })
                .catch((error) => {
                    alert(error.message);
                });
        }
    });
}
