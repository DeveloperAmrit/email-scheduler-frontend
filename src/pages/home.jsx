import React from 'react';
import UploadDoc from '../components/uploadDoc';
import EmailScheduler from '../components/emailScheduler';


const Home = () => {
  return (
    <>
        <UploadDoc />
        <hr />
        <EmailScheduler />
    </>
  )
}

export default Home