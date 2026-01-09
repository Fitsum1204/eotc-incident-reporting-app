import Link from 'next/link';
import Image from 'next/image';
import { auth, signIn, signOut } from '@/auth';

import { NavContent } from './NavContent'; 


export const Navbar = async() => {

    const session = await auth();
  
    const serverSignOut = async () => {
        'use server';
        await signOut({redirectTo:'/'});
    };

    const serverSignIn = async () => {
        'use server';
        await signIn('google'); 
    };

    return (
        <div className='px-6 py-3 bg-white shadow-md text-white font-work-sans'>
            <nav className='flex justify-between items-center max-w-7xl mx-auto relative'> 
                <Link href='/'>
                    <Image src='/logo.png' width={50} height={10} alt='logo' />
                </Link>
                
               
                <NavContent 
                    session={session} 
                    onSignOut={serverSignOut} 
                    onSignIn={serverSignIn} 
                />
            </nav>
        </div>
    )
}

export default Navbar