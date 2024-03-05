'use client';

import React from 'react';
import './landing.css';
import { useRouter } from 'next/navigation';
import logo from '@/public/logo.png';
import Link from 'next/link';

const Page = () => {
    const navigate = useRouter();
    const handleSignupClick = () => {
        navigate.push('/signup');
    };
    const handleLogInClick = () => {
        navigate.push('/login');
    };
    return (
        <div className="landing">
            <header className="header">
                <img src={logo.src} className="flex items-center justify-center mb-40" alt="logo" />
                <div className='buttons'>
                <Link href='signup'><button className='signupbutton' onClick={handleSignupClick}> <p>Sign Up</p> </button></Link>
                <Link href='login'><button className='loginbutton' onClick={handleLogInClick}> <p>Log In</p> </button></Link>
                </div>
            </header>
        </div>
    );
};

export default Page;
