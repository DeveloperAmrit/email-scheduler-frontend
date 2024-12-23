import React, { useState } from 'react';
import axios from 'axios';

function Field({label,type="text",name,value,onChange,isRequired=true}){
  return(
    <div className="mb-4">
    <label className="block text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={isRequired}
      className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
  );
}

function EmailScheduler() {
  const initialData = {
    to_email: '',
    cc_emails: '',
    bcc_emails: '',
    subject: '',
    body: '',
    send_datetime: '',
  }
  const [isSending,setIsSending] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    async function sendData(){
      if(formData.to_email.toLowerCase().includes('iitj')){
        alert("Email to domain with iitj has been temporarly banned. Otherwise i know what you can do :)");
        return "Please use gmail domain :]";
      }
      try {
        console.log("Trying to send...")
        const response = await axios.post('https://backend-ten-pi-92.vercel.app/schedule-email', {
          ...formData
        });
        setFormData({
          to_email: '',
          cc_emails: '',
          bcc_emails: '',
          subject: '',
          body: '',
          send_datetime: '',
        });
        alert(response.data.message);
      } catch (error) {
        alert('Failed to schedule email.');
        console.error(error);
      } finally {
        setIsSending(false);
      }
    }
    sendData();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100  pt-12 pb-24">
      <div className="w-80 sm:w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Schedule Email
        </h2>
        <form onSubmit={handleSubmit}>

          <Field label="Primary email" onChange={handleChange} type='email' name="to_email" value={formData.to_email}/>
          <Field label="CC Emails" onChange={handleChange}  name="cc_emails" value={formData.cc_emails} isRequired={false}/>
          <Field label="BCC Emails" onChange={handleChange} name="bcc_emails" value={formData.bcc_emails} isRequired={false}/>
          <Field label="Subject" onChange={handleChange} name="subject" value={formData.subject}/>
          <label className="block text-gray-700">Body</label>
          <textarea onChange={handleChange} name="body" value={formData.body} className='w-full min-h-72 h-72 p-3'/>
          <Field label="Send Date & Time" onChange={handleChange} type='datetime-local' name="send_datetime" value={formData.send_datetime}/>
          
          <div className="text-center">
            <button
              type="submit"
              disabled={formData.to_email.length === 0 || formData.subject.length === 0 || formData.body.length === 0 || formData.send_datetime.length === 0 || isSending}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              Schedule Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmailScheduler;
