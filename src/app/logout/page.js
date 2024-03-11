'use client';
// Import the necessary Firebase functions
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// Inside your component, create a function for logout

const page = async () => {
    const navigate = useRouter();
    signOut(auth)
        .then(() => {
            // Redirect the user to the login page or any other page as required
            navigate.push('/login');
        })
        .catch((error) => {
            console.error("Error Logging Out:", error.message);
        });
};
export default page;