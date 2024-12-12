import axios from 'axios';

function makeBodiesFromTemplate(exceldata, template, variables) {

  // Get the first row (header row) which contains the column names
  const headerRow = exceldata[0];

  // Create an array to store the final content after replacing the placeholders
  const bodyContent = [];

  // Loop through each row in exceldata starting from the second row (data rows)
  exceldata.slice(1).forEach((row) => {
    // Create a copy of the template to avoid modifying the original template string
    let filledTemplate = template;

    // Loop through each variable and replace placeholders in the template
    variables.forEach((variable) => {
      // Find the column index based on the variable name (matching header)
      const columnIndex = headerRow.indexOf(variable);

      // If the variable exists in the header row, replace the placeholder in the template
      if (columnIndex !== -1) {
        const regex = new RegExp(`{{${variable}}}`, "g"); // Create a dynamic regex for the placeholder
        const variableValue = row[columnIndex]; // Get the value from the respective column
        filledTemplate = filledTemplate.replace(regex, variableValue || ""); // Replace with value or empty string
      }
    });

    // Add the filled template for this row to the final body content
    bodyContent.push(filledTemplate);
  });

  // Return the final content as an array of filled templates for each row
  return bodyContent;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export async function sendDataToServer(exceldata, template, varibales, subject, send_datetime_) {
  try {
    // Create bodies for each template
    let bodies = makeBodiesFromTemplate(exceldata, template, varibales);
    console.log("Bodies = ",bodies);
    console.log("Excel data ",exceldata);
    // Create an array to hold the promises
    let promises = [];

    for (let i = 1; i < exceldata.length; i++) {
      // Make data object for each row
      let data = {
        to_email: exceldata[i][0],
        cc_emails: (!exceldata[i][1])? "" : exceldata[i][1],
        bcc_emails: (!exceldata[i][2])? "" : exceldata[i][2],
        subject: subject,
        body: bodies[i - 1],
        send_datetime: send_datetime_,
      };

      if(data.to_email.toLowerCase().includes('iitj')){
        alert("Email to domain with iitj has been temporarly banned. Otherwise i know what you can do :)");
        return "Please use gmail domain :]";
      }

      // Prepare the asynchronous call
      const sendData = async (data_) => {
        try {
          console.log(data_);
          const response = await axios.post('https://email-scheduler-backend.vercel.app/schedule-email', data_);
          console.log(`Scheduled for ${i}th row with response: ${response.data.message}`);
          return response.data.message; // Returning response message
        } catch (error) {
          console.error(`Failed to schedule for ${i}th row:`, error);
          throw new Error(`Failed to schedule for ${i}th row: ${error.message}`);
        }
      };

      // Push the promise to the array
      promises.push(sendData(data));
      await delay(50);
    }

    // Wait for all the promises to resolve
    const responses = await Promise.all(promises);
    console.log('All emails scheduled successfully:', responses);
    return `Success! All emails scheduled.`;

  } catch (error) {
    console.error('Error during email scheduling:', error);
    throw new Error(`Failed to schedule emails: ${error.message}`);
  }
}
