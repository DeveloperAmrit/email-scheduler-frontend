import axios from 'axios';

function makeBodiesFromTemplate({ exceldata, template, variables }) {
  // Ensure valid input
  if (!exceldata || !Array.isArray(exceldata) || exceldata.length === 0) {
    throw new Error("Invalid exceldata input.");
  }
  if (!template || typeof template !== "string") {
    throw new Error("Invalid template input.");
  }
  if (!variables || !Array.isArray(variables) || variables.length === 0) {
    throw new Error("Invalid variables input.");
  }

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


export async function sendDataToServer({ exceldata, template, varibales, subject, send_datetime_ }) {
  try {
    // Create bodies for each template
    let bodies = makeBodiesFromTemplate(exceldata, template, varibales);

    // Create an array to hold the promises
    let promises = [];

    for (let i = 1; i < exceldata.length; i++) {
      // Make data object for each row
      let data = {
        to_email: exceldata[i][0],
        cc_emails: exceldata[i][1],
        bcc_emails: exceldata[i][2],
        subject: subject,
        body: bodies[i - 1],
        send_datetime: send_datetime_,
      };

      // Prepare the asynchronous call
      const sendData = async () => {
        try {
          const response = await axios.post('http://localhost:5000/schedule-email', data);
          console.log(`Scheduled for ${i}th row with response: ${response.data.message}`);
          return response.data.message; // Returning response message
        } catch (error) {
          console.error(`Failed to schedule for ${i}th row:`, error);
          throw new Error(`Failed to schedule for ${i}th row: ${error.message}`);
        }
      };

      // Push the promise to the array
      promises.push(sendData());
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
