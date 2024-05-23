const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { Message } = require('./db'); 

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.get('/', (req, res) => {
  res.send('Chat App Backend');
});

io.on('connection', async (socket) => {
  console.log('New client connected:', socket.id);

  const messages = await Message.findAll();
  socket.emit('loadMessages', messages);

  socket.on('message', async (data) => {
    const message = await Message.create({
      content: data.content,
      clientId: socket.id,
      sent: true 
    });

    io.emit('message', { content: message.content, id: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, () => console.log('Server running on port 4000'));
