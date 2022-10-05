const socket = io()
let username
let textArea = document.querySelector('#textarea')
let messagearea = document.querySelector(".message__area")
// let clientName = document.querySelector(".client_name")
do{
    username = prompt("Enter your name")
}while(!username)
socket.emit('client_nme', username)
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
    if(e.key === 'Enter'){
        sendMessage(e.target.value)
    }
})


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
    socket.emit('message', msg)
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

function scrollTobottom(){
    messagearea.scrollTop = messagearea.scrollHeight
}