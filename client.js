const socket = io()
let username
let textArea = document.querySelector('#textarea')
let messagearea = document.querySelector(".message__area")
let brandarea = document.querySelector(".brand")
// let clientName = document.querySelector(".client_name")


do{
    username = prompt("Enter your name")
}while(!username) // not value in username and room

// for room id 
do{
    room = prompt("Enter your room id ")
}while(!room)

socket.emit('room_id',room)
socket.emit('client_nme', data={username,room})
welcome()

function welcome(){
    let mainclient = document.createElement('div')
    let className = 'client_name'
    mainclient.classList.add(className,'clientname')

    let markup = `
    <center>
        <h1>You are connected</h1>
        </center>
    `

    mainclient.innerHTML = markup

    messagearea.appendChild(mainclient)
}
function appendclient(username,type,status){
    let mainclient = document.createElement('div')
    let className = type
    mainclient.classList.add(className,'clientname')
    if (username === null){
        username = "Refresh the page" // for refesh the page
    }
    let markup = `
    <center>
        <h1>${username} ${status}</h1>
        </center>
    `

    mainclient.innerHTML = markup

    messagearea.appendChild(mainclient) 
}

// now use enter key event 
textArea.addEventListener('keyup',(e)=>{
    socket.emit("typing",room) // typing socket
    if(e.key === 'Enter'){
        sendMessage(e.target.value)
        socket.emit("typing_stop",room)
    }
    else if(e.target.value == ""){
        socket.emit("typing_stop",room)
    }

})

// send mssg for sebd button
function sendmsg(){
    socket.emit("typing_stop",room)
    var mssg = textArea.value
    sendMessage(mssg)

}


function sendMessage(message){
    var d = new Date()
    var time = d.toLocaleTimeString()
    let msg = {
        user : username,
        message : message.trim(),
        date : time
    }

    // append the msg 
    appendMessage(msg,'outgoing')
    textArea.value = ""
    scrollTobottom()

    // send to server
    socket.emit('message', data={msg,room})
}

function appendMessage(msg,type){
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className,'message')

    let markup = `
        <h4>${msg.user}</h4>
        <h1>${msg.message}</h1>
        <p>${msg.date}</p>
    `

    mainDiv.innerHTML = markup

    messagearea.appendChild(mainDiv)
    if (type == "outgoing"){
        seen_status()
    }
    

}

function appendtyping(ty){
    var data = document.getElementById("typee")
    data.innerHTML = ty
    // seen_unseen("seen")
}

function seen_unseen(msg){
    document.getElementById("status").innerHTML = msg
}


// seen and unseen
function seen_status(){
window.addEventListener('focus',()=>{
    stat = "seen"
    socket.emit("delv",msg={stat,room})
})
window.addEventListener('blur',()=>{
    stat = ""
    socket.emit("delv",msg={stat,room})
})
}

// user disconnect inform
socket.on('user_disconnect',(users)=>{
    appendclient(users,'client_name','disconnected')
    console.log(users)
    scrollTobottom()
})

// recieve

socket.on('client_nme',(nme)=>{
    appendclient(nme,'client_name','connected')
    scrollTobottom()
})

socket.on('message',(msg)=>{
    appendMessage(msg,'incoming')
    scrollTobottom()
})

// recive the typing
socket.on('typing',(ty)=>{
    appendtyping(ty)
    scrollTobottom()
})

socket.on("typing_stop",(ty)=>{
    appendtyping(ty)
    scrollTobottom()
})

socket.on("delv",(stat)=>{
    // appendMessage(stat,"outgoing")
    seen_unseen(stat)
    // console.log(stat)
    scrollTobottom()
})
function scrollTobottom(){
    messagearea.scrollTop = messagearea.scrollHeight
}