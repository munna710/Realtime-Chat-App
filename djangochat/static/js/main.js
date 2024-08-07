/**
 * Variables
 */


let chatName = ''
let chatSocket = null
let chatWindowUrl = window.location.href
let chatRoomUuid = Math.random().toString(36).slice(2, 12)

// console.log("chatRoomUuid",chatRoomUuid)

/**
 * Elements
 */

const chatElement = document.querySelector('#chat')
const chatOpenElement = document.querySelector('#chat_open')
const chatJoinElement = document.querySelector('#chat_join')
const chatIconElement = document.querySelector('#chat_icon')
const chatWelcomeElement = document.querySelector('#chat_welcome')
const chatRoomElement = document.querySelector('#chat_room')
const chatNameElement = document.querySelector('#chat_name')
const chatLogElement = document.querySelector('#chat_log')
const chatInputElement = document.querySelector('#chat_message_input')
const chatSubmitElement = document.querySelector('#chat_message_submit')


/**
 * Functions 
 */

function scrollToBottom() {
    chatLogElement.scrollTop = chatLogElement.scrollHeight
}


function getCookie(name) {
    var cookieValue = null

    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';')

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim()

            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1))

                break
            }
        }
    }

    return cookieValue
}

function sendMessage() {
    chatSocket.send(JSON.stringify({
        'type': 'message',
        'message': chatInputElement.value,
        'name': chatName
    }))

    chatInputElement.value = ''
}
function onChatMessage(data) {
    console.log('onChatMessage', data);

    if (data.type == 'chat_message') {
        let tmpInfo = document.querySelector('.tmp-info');

        if (tmpInfo) {
            tmpInfo.remove();
        }

        if (data.agent) {
            chatLogElement.innerHTML += `
                <div class="d-flex w-100 mt-2" style="max-width: 448px;">
                    <div class="border border-2 border-warning rounded-circle text-white text-center pt-2" style="flex-shrink: 0; height: 45px; width: 45px; margin-right: 10px;">${data.initials}</div>
                    <div class="ml-2">
                        <div class="border border-2 border-warning p-3"style="max-width: 100%; word-wrap: break-word; overflow-wrap: break-word; word-break: break-all; border-radius: 0px 10px 10px 10px;">
                            <p class="small mb-0">${data.message}</p>
                        </div>
                        <span class="text-muted small">${data.created_at} ago</span>
                    </div>
                </div>
            `;
        } else {
            chatLogElement.innerHTML += `
                <div class="d-flex w-100 mt-2 ml-auto justify-content-end" style="max-width:448px">
                    <div class="mr-2">
                        <div class="border border-2 border-info p-3" style="max-width: 100%; word-wrap: break-word; overflow-wrap: break-word; word-break: break-all; border-radius: 10px 0 10px 10px;">
                            <p class="small mb-0">${data.message}</p>
                        </div>
                        <span class="text-muted small">${data.created_at} ago</span>
                    </div>
                    <div class="border border-2 border-info rounded-circle text-center text-light p-2" style="flex-shrink: 0; height: 45px; width: 45px; margin-left: 10px;">${data.initials}</div>
                </div>
            `;
        }
    } else if (data.type == 'users_update') {
        chatLogElement.innerHTML += '<p class="mt-2">The admin/agent has joined the chat!</p>';
    } else if (data.type == 'writing_active') {
        if (data.agent) {
            let tmpInfo = document.querySelector('.tmp-info');

            if (tmpInfo) {
                tmpInfo.remove();
            }

            chatLogElement.innerHTML += `
                <div class="tmp-info d-flex w-100 mt-2" style="max-width:448px">
                    <div class="rounded-circle border border-warning border-2 text-center pt-2 text-white"style="flex-shrink: 0; height: 45px; width: 45px; margin-right: 10px;">${data.initials}</div>
                    <div class="ml-2">
                        <div class="p-3 border border-light" style="border-radius: 0px 10px 10px 10px;">
                            <p class="small mb-0 text-muted">The agent/admin is writing a message...</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    scrollToBottom();
}
async function joinChatRoom(){
    console.log('joinChatRoom')

    chatName = chatNameElement.value

    console.log('Join as:', chatName)
    console.log('Room uuid:', chatRoomUuid)

    const data = new FormData()
    data.append('name', chatName)
    data.append('url', chatWindowUrl)

    await fetch(`/api/create-room/${chatRoomUuid}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: data
    })
    .then(function(res) {
        return res.json()
    })
    .then(function(data) {
        console.log('data', data)
    })

    chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoomUuid}/`)


    chatSocket.onmessage = function(e) {
        console.log('onMessage')

        onChatMessage(JSON.parse(e.data))
    }


    chatSocket.onopen = function(e) {
        console.log('onOpen - chat socket was opened')

        scrollToBottom()
    }


    chatSocket.onclose = function(e) {

        console.log('onClose - chat socket was closed')
    }
    

}

/**
 * Event listeners
 */

chatOpenElement.onclick = function(e) {
    e.preventDefault()

    chatIconElement.classList.add('d-none')
    chatWelcomeElement.classList.remove('d-none')

    return false
}

chatJoinElement.onclick = function(e) {
    e.preventDefault()

    chatWelcomeElement.classList.add('d-none')
    chatRoomElement.classList.remove('d-none')

    joinChatRoom()

    return false
}

chatSubmitElement.onclick = function(e) {
    e.preventDefault()

    sendMessage()

    return false
}
// document.addEventListener('click', function(e) {
//     if (!chatWelcomeElement.contains(e.target) && !chatOpenElement.contains(e.target)) {
//         chatIconElement.classList.remove('d-none');
//         chatWelcomeElement.classList.add('d-none');
//     }
// });

chatInputElement.onkeyup = function(e) {
    if (e.keyCode == 13) {
        sendMessage()
    }
}


chatInputElement.onfocus = function(e) {
    chatSocket.send(JSON.stringify({
        'type': 'update',
        'message': 'writing_active',
        'name': chatName
    }))
}