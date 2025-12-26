const express = require('express');
const connectDB = require('./db');
const userRoutes = require('./routes/users');
const clubRoutes = require('./routes/clubs');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const joinRequestsRouter = require('./routes/joinRequests');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

connectDB();

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

const app = express();
const port = 5000;

const allowedOrigins = [
  'https://club-events.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8100'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    console.log('OAuth success:', payload.email, payload.name); // Log user info on success

    res.json({ user: payload });
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

//-----------------------------------------------
app.get('/', (req, res) => {
  res.send(req.user ? `Hello, ${req.user.displayName}` : 'Not logged in');
});
//-----------------------------------------------

app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/join-requests', joinRequestsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port,(e)=>{
    if(e) 
    {
        console.error("Error starting server:", e);
    }
    else
    {    
    console.log();
    console.log(`server url ☄️❤️‍🔥🧩http://localhost:${port}`);
    }
})