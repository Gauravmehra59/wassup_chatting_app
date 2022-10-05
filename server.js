const express = require("express")
const app = express()
const path = require("path")
const http = require("http")
const PORT = process.env.PORT || 3000

// console.log(__dirname)

const tempPath = __dirname
app.use(express.static(tempPath))

const server = http.createServer(app)
server.listen(PORT,()=>{
    console.log(`LIsten........${PORT}`)
})

app.get("/",(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

// socket

const io = require("socket.io")(server)
var user = {}

io.on('connection',(socket)=>{
    console.log("connected")
    socket.on('message',(msg)=>{
        socket.broadcast.emit('message',msg) //send the mssg to all 
    })
    socket.on('client_nme',(nme)=>{
        user[socket.id]=nme
        socket.broadcast.emit('client_nme',nme)
    })
    // now code for disconnection
    socket.on('disconnect',()=>{
        socket.broadcast.emit("user_disconnect",users=user[socket.id]) // get the user id 
        delete user[socket.id]
    })
})
