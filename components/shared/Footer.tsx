import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faFacebookF,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='bg-gray-800 text-white py-8'>
      <div className='container mx-auto px-4 lg:px-10'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <div>
            <h3>EOTC IR</h3>
            <p>Report incidents from anyware</p>
          </div>
        </div>

        <div className='border-t border-gray-700 my-6'></div>
        {/* Bottom Section */}
        <div className='flex flex-col md:flex-col justify-between items-center gap-4'>
          {/* Social Media Links */}
          <div className='flex gap-4'>
            <p className='text-sm text-gray-400'>Follow Us on</p>
            {/* Instagram */}
            <a
              href='#'
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full p-3 flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110'
              style={{
                background:
                  'linear-gradient(45deg, #f09433 0%, #e6683c 40%, #dc2743 60%, #cc2366 80%, #bc1888 100%)',
              }}
            >
              <FontAwesomeIcon
                icon={faInstagram}
                size='lg'
                style={{ color: '#ffffff' }}
              />
            </a>

            {/* Facebook */}
            <a
              href='#'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-[#4267B2] rounded-full p-3 flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110'
            >
              <FontAwesomeIcon
                icon={faFacebookF}
                size='lg'
                className='text-white'
              />
            </a>

            {/* WhatsApp */}
            <a
              href='https://wa.me/255555555'
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full p-3 flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110'
              style={{
                backgroundColor: '#25D366',
              }}
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                size='lg'
                style={{ color: '#ffffff' }}
              />
            </a>
          </div>

          {/* Phone Number */}
          <p className='text-sm text-gray-400 text-center md:text-center'>
            Call us at:{' '}
            <a href='tel:+251777777' className='hover:text-gray-200'>
            +251777777
            </a>
          </p>

          {/* Copyright */}
          <p className='text-sm text-gray-400 text-center md:text-center'>
            © {currentYear} EOTC IC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
