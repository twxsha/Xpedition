'use client';

import { useEffect, useState } from 'react';
import { auth } from '../../firebase-config'; // Adjust the path as necessary
import { db } from '../../firebase-config';
import { collection, setDoc, doc } from "firebase/firestore"; 


export default function Page({ params }) {
    const [user, setUser] = useState(auth.currentUser.email);


    const test = async () => {
        try {
            console.log(user);
            const specificDocRef = doc(db, "xpeditions", user);
            await setDoc(specificDocRef, {
                first: "Ada",
                last: "Lovelace",
                born: 1815
            });
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    };



    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            //console.log(user);
            setUser(auth.currentUser.email);
            console.log(user.email)
            await test();
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <p> I'm the current user: {user ? user.email : 'None'} </p>
    );
}
