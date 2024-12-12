import React from 'react';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center p-4 bg-gray-800 text-white" id='footer'>
      <div className="flex flex-col md:flex-row gap-y-4 space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
          onClick={() => window.open('https://github.com/DeveloperAmrit', '_blank')}
        >
          GitHub
        </button>
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
          onClick={() => window.open('https://www.linkedin.com/in/amrit-kumar-yadav/', '_blank')}
        >
          LinkedIn
        </button>
        <button
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
          onClick={() => (window.location.href = 'mailto:b24cm1008@iitj.ac.in')}
        >
          Email Me
        </button>
      </div>
      <p className="mt-4">© 2024 DeveloperAmrit</p>
    </footer>
  );
};

export default Footer;
