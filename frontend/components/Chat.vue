<template>
    <div class="chat-container">
      <ul class="chat-messages">
        <li
          v-for="message in messages"
          :key="message.id"
          :class="{'chat-message': true, 'sent': message.sent, 'received': !message.sent}"
        >
          {{ message.content }}
        </li>
      </ul>
      <input
        class="chat-input"
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message"
      />
      <button class="send-button" @click="sendMessage">Send</button>
    </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  const socket = io('http://localhost:4000');
  
  export default {
    data() {
      return {
        messages: [],
        newMessage: '',
        clientId: socket.id
      };
    },
    created() {
      socket.on('connect', () => {
        this.clientId = socket.id;
      });
  
      socket.on('message', (data) => {
        console.log('Message received:', data);
        if (data.id !== this.clientId) { 
          this.messages.push({ content: data.content, sent: false });
        }
      });
    },
    methods: {
      sendMessage() {
        if (this.newMessage.trim()) {
          console.log('Message sent:', this.newMessage);
          const message = { content: this.newMessage, sent: true, id: this.clientId };
          this.messages.push(message);
          socket.emit('message', { content: this.newMessage });
          this.newMessage = '';
        }
      },
    },
  };
  </script>