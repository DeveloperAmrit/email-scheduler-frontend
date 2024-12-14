import React, { useState, useEffect} from 'react';
import * as XLSX from "xlsx";
import EmailTemplateEditor from './template';
import { sendDataToServer } from './sendDataToServer';

const isValidInput = (excelData, variables) => {
    if (!excelData) {
        alert("No excel data found");
        return false;
    }

    const headerRow = excelData[0];

    if (headerRow[0].trim() !== 'to_email') {
        alert("The first column must be 'to_email'");
        return false;
    }
    if (headerRow[1].trim() !== 'cc_emails') {
        alert("The second column must be 'cc_emails'");
        return false;
    }
    if (headerRow[2].trim() !== 'bcc_emails') {
        alert("The third column must be 'bcc_emails'");
        return false;
    }

    const missingVariables = [];
    const repeatedVariables = [];

    for (const element of variables) {
        let matched = 0;
        for (let i = 2; i < headerRow.length; i++) {
            if (element === headerRow[i]) {
                matched++;
            }
        }
        if (matched === 0) {
            missingVariables.push(element);
        }
        else if (matched > 1) {
            repeatedVariables.push(element);
        }
    }
    let isValid = true;

    if (missingVariables.length !== 0 && repeatedVariables.length !== 0) {
        alert(`Missing variables ${missingVariables.join(', ')}\nRepeated variables ${repeatedVariables.join(', ')}`);
        isValid = false;
    }
    else if (missingVariables.length !== 0) {
        alert(`Missing variables ${missingVariables.join(', ')}`);
        isValid = false;
    }
    else if (repeatedVariables.length !== 0) {
        alert(`Repeated variables ${repeatedVariables.join(', ')}`);
        isValid = false;
    }
    return isValid;
}


const UploadDoc = () => {
    const [template, setTemplate] = useState("");
    const [variables, setVariables] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [send_datetime, setSend_datetime] = useState("");
    const [datetimeMin, setDatetimeMin] = useState("");
    const [subject, setSubject] = useState("");
    const [isSubmitting,setIsSubmitting] = useState(false);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0]; // Assuming first sheet
                const sheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Parse sheet into JSON
                setExcelData(parsedData); // Store parsed data
            };
            reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log("Excel Data Submitted:", excelData);
        
        if (isValidInput(excelData, variables)) {
          try {
            // Wait for the result of sending data to the server
            const response = await sendDataToServer(excelData,template,variables,subject,send_datetime);
            alert(response); 
          } catch (err) {
            alert("Failed to send to server: " + err.message);
          }
        }
        setIsSubmitting(false);
      };
      

    useEffect(() => {
        const now = new Date();
        // Format the date and time to match the input type's required format (YYYY-MM-DDTHH:mm)
        const formattedNow = now.toISOString().slice(0, 16);
        setDatetimeMin(formattedNow);
    }, []);

    return (
        <div className='w-full pb-5 pt-24 bg-gray-100 min-h-screen flex flex-col justify-center'>
            <div className='flex justify-center items-center gap-6'>
                <h2 className="text-3xl font-semibold text-center text-gray-700 mb-2">Schedule By Sheet</h2>
                <a className='text-red-600' href="https://docs.google.com/document/d/1oFVl_6cBwNBQXG6_qgkfGKG7KZ9NaR39cEVi7kUh5DU/edit?usp=sharing" target='__blank'>How to use</a>
            </div>
            <div className='flex flex-col justify-between items-center gap-4 p-5'>
                <div className="w-full">
                    <EmailTemplateEditor template={template} setTemplate={setTemplate} variables={variables} setVariables={setVariables} />
                </div>
                <div className='w-full flex flex-col lg:flex-row justify-between gap-6 items-center text-center'>
                    <div className='w-full text-lg min-h-7 flex gap-4'>
                        <label>Subject</label>
                        <input className='w-full min-h-7 border-2 border-slate-400' type="text" name='subject' required value={subject} onChange={(e) => setSubject(e.target.value)} />
                    </div>
                    <input className='min-h-7 text-lg border-2 border-slate-400 hover:border-black active:border-black' type="datetime-local" name="send_datetime" required id="send_datetime" min={datetimeMin} value={send_datetime} onChange={(e) => setSend_datetime(e.target.value)} />
                    <div className='flex items-center gap-x-4 border-2 border-slate-400'>
                        <input
                            type='file'
                            accept=".xlsx, .xls"
                            required
                            onChange={handleFileUpload}
                            className='max-w-fit py-2 text-lg ' />
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || send_datetime.length===0 || template.length===0 || excelData.length===0 || subject.length ===0}
                        className='max-w-fit px-6 py-2 text-2xl bg-rose-600 text-white cursor-pointer border-2 rounded-sm hover:bg-rose-500 hover:border-rose-800 active:bg-rose-700 disabled:bg-rose-300 disabled:cursor-not-allowed'>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default UploadDoc