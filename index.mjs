import axios from 'axios';
import { config } from 'dotenv';
config();

const jsonArray = [
    'https://api.promptengineers.ai',
    'https://dev-api.promptengineers.ai',
];

export const handler = async (event) => {
    const webhookURL = process.env.WEBHOOK_URL;
    
    const errorMessages = []; // Array to hold any error messages
    
    for (const url of jsonArray) {
        try {
            // Make a GET request to the URL
            await axios.get(url);
        } catch (error) {
            // If the request fails, form the error message with the URL and the status code
            const errorMessage = `Error with URL: ${url} - Status Code: ${error.response ? error.response.status : 'Unknown'}`;
            errorMessages.push(errorMessage); // Add the error message to the array
        }
    }
    
    // If there are any errors, send them all together to the webhook
    if (errorMessages.length > 0) {
        const data = { 'text': errorMessages.join('\n') }; // Join all error messages with a newline character
        try {
            const response = await axios.post(webhookURL, data, {
                headers: { 'Content-Type': 'application/json; charset=UTF-8', },
            });
            console.log(response.data);
            return response.data;
        } catch (webhookError) {
            console.error('Error posting to webhook', webhookError.message);
            throw webhookError;
        }
    }
    // Do nothing if all URLs are accessible.
    return {
        statusCode: 200,
        message: "Completed"
    }
};

// If you want to call handler function directly for testing,
// you can uncomment the following line.
handler().then(console.log).catch(console.error);
