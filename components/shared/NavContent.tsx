'use client';
import { NotificationButton } from './NotificationButton';
import { useState } from 'react';
import Link from 'next/link';
import { LogOut, Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  id: string;
  name?: string | null;
  image?: string | null;
}

interface Session {
  user?: User | null;
  [key: string]: unknown;
}

interface NavContentProps {
  session?: Session | null;
  onSignOut?: (() => Promise<void>) | (() => void) | string;
  onSignIn?: (() => Promise<void>) | (() => void) | string;
}

export const NavContent = (props: NavContentProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const session = props.session;
  const onSignOut = props.onSignOut;
  const onSignIn = props.onSignIn;

  const handleSignOut = async (e?: React.FormEvent) => {
    if (e && 'preventDefault' in e) e.preventDefault();
    setIsOpen(false);
    if (typeof onSignOut === 'string') {
      window.location.href = onSignOut;
      return;
    }

    if (typeof onSignOut === 'function') {
      try {
        await (onSignOut as () => Promise<void>)();
      } catch (err) {
        console.error('sign out failed', err);
      }
    }
  };

  const navLinks: { href: string; label: string }[] = [
    { href: '/report', label: 'Report' },
    { href: '/incidents', label: 'Incidents' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <div className='flex items-center gap-5 text-black relative'>
      {/* Desktop Navigation  */}
      {session && session.user ? (
        <>
          <div className='hidden md:flex items-center gap-5'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='text-gray-700 hover:text-orange-500 transition duration-150'
              >
                <span>{link.label}</span>
              </Link>
            ))}
            <NotificationButton />
          </div>

          {/* Logout Button/Icon  */}
          <form onSubmit={handleSignOut}>
            <button type='submit' className='cursor-pointer hidden sm:block'>
              Logout
            </button>
            <button type='submit' className='sm:hidden p-0'>
              <LogOut className='size-6 text-red-500' />
            </button>
          </form>
          {/* User Avatar */}
          <Link href={`/user/${session.user.id}`}>
            <Avatar className='size-10'>
              <AvatarImage
                src={session.user.image || ''}
                alt={session.user.name || ''}
                className='rounded-full'
              />
              <AvatarFallback>AV</AvatarFallback>
            </Avatar>
          </Link>

          {/* Mobile Hamburger */}
          <button
            className='md:hidden p-2 text-gray-700'
            onClick={() => setIsOpen(!isOpen)}
            aria-label='Toggle menu'
          >
            {isOpen ? <X className='size-6' /> : <Menu className='size-6' />}
          </button>
        </>
      ) : (
        /* Login Button */
        <Link href="/login">
  <button className="cursor-pointer m-4 text-white bg-black rounded-full px-4 py-2 hover:bg-gray-800 transition">
    Login
  </button>
</Link>
      )}

      {/*  Mobile Menu Dropdown */}
      {isOpen && session && session.user && (
        <div className='fixed inset-0 bg-white z-50 md:hidden overflow-auto'>
          <div className='flex items-center justify-end p-4 border-b border-gray-200'>
            <button
              onClick={() => setIsOpen(false)}
              aria-label='Close menu'
              className='p-2 text-gray-700'
            >
              <X className='size-6' />
            </button>
          </div>

          <div className='flex flex-col p-6 space-y-4'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className='text-gray-700 hover:text-orange-500 hover:bg-gray-50 p-3 rounded w-full text-lg'
              >
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="flex items-center gap-3 p-3">
              <NotificationButton />
              <span className="text-gray-700">Push Notifications</span>
            </div>

            {/* Logout Link in Mobile Menu */}
            <form onSubmit={handleSignOut}>
              <button
                type='submit'
                className='w-full text-left text-gray-700 hover:text-orange-500 hover:bg-gray-50 p-3 rounded flex items-center gap-3'
              >
                {/* <LogOut className='size-5 text-red-500' />*/}
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
