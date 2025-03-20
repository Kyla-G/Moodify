// filepath: c:\Users\Intern\Documents\GitHub\Moodify\backend\app.js
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

//INITIALIZE EXPRESS APPLICATION AND STORE TO app
const app = express();

const fs = require('fs');

if (!fs.existsSync('./Moodify.db')) {
  console.error(' SQLite Database file does not exist!');
}

//IMPORT ALL ROUTERS NEEDED
const user_rtr = require('./API/routers/user_rtr');
const mood_entries_rtr = require('./API/routers/mood_entries_rtr');
const chat_session_rtr = require('./API/routers/chat_session_rtr');
const responses_rtr = require('./API/routers/responses_rtr');
const feedback_rtr = require('./API/routers/feedback_rtr');
const xp_progress_rtr = require('./API/routers/xp_progress_rtr');
const xp_rtr = require('./API/routers/xp_rtr');

// para lang makita kung anong request sa console
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

//TO LOG CLIENT REQUEST-RESPONSE DATA IN A DEV ENVIRONMENT
app.use(morgan('dev'));
app.use(express.json());

//PARSE DATA THAT ARE URLENCODED
//content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

//PARSE DATA THAT ARE IN JSON FORMAT
//content-type: application/json
app.use(bodyParser.json({ limit: "50mb" }));

app.use((req, res, next) => {
  // Allow the specific origin where your frontend is hosted
  res.header("Access-Control-Allow-Origin", "*");  // URL ng frontend oo alam nyo na yun

  // Allow all headers and credentials
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Allow specific HTTP methods
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");

  // Allow credentials (cookies, authorization headers, etc.)
  res.header("Access-Control-Allow-Credentials", "true");

  // If the request method is OPTIONS, respond with 200 and the allowed methods
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  next();
});

// Chat route to handle requests to the Hugging Face model
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  const apiKey = process.env.HF_API_KEY;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/Moonlighthxq/llama-3.1-8B-instruct-mental',
      { inputs: userMessage },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const botMessage = response.data[0].generated_text;
    res.json([{ generated_text: botMessage }]);
  } catch (error) {
    console.error('Error sending message to chatbot:', error);
    res.status(500).json({ error: 'Error fetching chatbot response.' });
  }
});

//MIDDLEWARE FOR THE ROUTERS
app.use('/users', user_rtr);
app.use('/entries', mood_entries_rtr);
app.use('/chats', chat_session_rtr);
app.use('/responses', responses_rtr);
app.use('/feedback', feedback_rtr);
app.use('/XPprogress', xp_progress_rtr);
app.use('/XP', xp_rtr);

//ERROR MIDDLEWARES
app.use((req, res, next) => {
  //THIS CODE CREATE A NEW ERROR OBJECT FOR UNKNOWN ENDPOINTS. MEANING, THE REQUEST DID NOT PROCEED WITH THE MIDDLEWARE ABOVE.
  const error = new Error('Not Found');
  error.status = 404;

  //THIS PASS THE NEXT CONTROL TO THE NEXT MIDDLEWARE ALONG WITH THE ERROR OBJECT THAT WAS CREATED.
  next(error);
});

app.use((error, req, res, next) => {
  //SENDS ERROR RESPONSE TO THE CLIENT. IF THE ERROR IS UNKNOWN ENDPOINT, THEN THIS WILL SEND ERROR RESPONSE WITH "NOT FOUND" MESSAGE AND 404 STATUS CODE. IF NOT, THEN IT WILL GET WHATEVER THE SYSTEM ENCOUNTERED.
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

//EXPORTS THE EXPRESS APPLICATION SO THAT IT CAN BE IMPORTED FROM OTHE FILES.
module.exports = app;