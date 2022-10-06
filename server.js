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
    var roomid

    socket.on('room_id',(room)=>{
        console.log(`Join ${room}`)
        socket.join(room)
        roomid = room
    })

    socket.on('message',(data)=>{
        socket.broadcast.to(data.room).emit('message',data.msg) //send the mssg to all 
    })
    socket.on('client_nme',(nme)=>{
        user[socket.id]=nme.username
        socket.broadcast.to(nme.room).emit('client_nme',nme.username)
    })

    // now typing
    socket.on('typing',(data)=>{
        socket.broadcast.to(data).emit("typing","typing.....")
    })

    socket.on('typing_stop',(data)=>{
        socket.broadcast.to(data).emit("typing_stop"," ")
    })

    // now code for disconnection
    socket.on('disconnect',()=>{
        socket.broadcast.to(roomid).emit("user_disconnect",users=user[socket.id]) // get the user id 
        delete user[socket.id]
    })
})
