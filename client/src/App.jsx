import React, { useEffect, useRef, useState } from 'react'
useEffect(() => {
// scroll to bottom when messages change
if (messagesRef.current) {
messagesRef.current.scrollTop = messagesRef.current.scrollHeight
}
}, [messages])


function handleJoin(e) {
e.preventDefault()
if (!username.trim()) return
socket.emit('join', username)
}


function handleSend(e) {
e.preventDefault()
if (!text.trim()) return
const now = new Date()
const payload = {
username: username || 'Anonymous',
text: text.trim(),
time: now.toISOString()
}


socket.emit('chat-message', payload)
setText('')
}


return (
<div className="container">
<h2>Real-Time Chat</h2>


<div className="chat-wrapper">
<div className="left">
<form onSubmit={handleJoin} className="name-form">
<input
value={username}
onChange={(e) => setUsername(e.target.value)}
placeholder="Enter your name"
/>
<button type="submit">Join</button>
</form>


<div className="status">Status: {connected ? 'Connected' : 'Disconnected'}</div>


<div ref={messagesRef} className="messages">
{messages.map((m) => (
<div key={m.id} className="message">
<strong>{m.username}</strong>
<span className="time">[{new Date(m.time).toLocaleTimeString()}]</span>
: <span className="text">{m.text}</span>
</div>
))}
</div>


<form onSubmit={handleSend} className="send-form">
<input
value={text}
onChange={(e) => setText(e.target.value)}
placeholder="Type your message..."
/>
<button type="submit">Send</button>
</form>
</div>
</div>
</div>
)
}
