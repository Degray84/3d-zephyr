import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, type Auth } from 'firebase/auth';

export const authSignIn = () => {
    const auth: Auth = getAuth();

    signInWithPopup(auth, new GoogleAuthProvider());
};

export const authSignOut = () => {
    const auth: Auth = getAuth();

    signOut(auth);
};