import React from 'react';
import UploadDoc from '../components/uploadDoc';
import EmailScheduler from '../components/emailScheduler';


const Home = () => {
  return (
    <>
        <div className='text-3xl text-black'>Hello</div>
        <UploadDoc />
        <hr />
        <EmailScheduler />
    </>
  )
}

export default Home