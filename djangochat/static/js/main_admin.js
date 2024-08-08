/**
 * Variables
 */

const chatRoom = document.querySelector('#room_uuid').textContent.replaceAll('"', '')

let chatSocket = null


/**
 * Elements
 */

const chatLogElement = document.querySelector('#chat_log')
const chatInputElement = document.querySelector('#chat_message_input')
const chatSubmitElement = document.querySelector('#chat_message_submit')


/**
 * Functions
 */

function scrollToBottom() {
    chatLogElement.scrollTop = chatLogElement.scrollHeight
}

function sendMessage() {
    chatSocket.send(JSON.stringify({
        'type': 'message',
        'message': chatInputElement.value,
        'name': document.querySelector('#user_name').textContent.replaceAll('"', ''),
        'agent': document.querySelector('#user_id').textContent.replaceAll('"', ''),
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

        if (!data.agent) {
            chatLogElement.innerHTML += `
                <div class="d-flex w-100 mt-2" style="max-width: 448px;">
                    <div class="border border-2 border-info rounded-circle text-white text-center pt-2" style="flex-shrink: 0; height: 45px; width: 45px; margin-right: 10px;">${data.initials}</div>
                    <div class="ml-2">
                        <div class="border border-2 border-info p-3 text-light"style="max-width: 100%; word-wrap: break-word; overflow-wrap: break-word; word-break: break-all; border-radius: 0px 10px 10px 10px;">
                            <p class="small mb-0">${data.message}</p>
                        </div>
                        <span class="text-muted small">${data.created_at} ago</span>
                    </div>
                </div>
            `;
        } else {
            chatLogElement.innerHTML += `
                <div class="d-flex w-100 mt-2 ml-auto justify-content-end">
                    <div class="mr-2">
                        <div class="border border-2 border-warning p-3" style="max-width: 100%; word-wrap: break-word; overflow-wrap: break-word; word-break: break-all; border-radius: 10px 0 10px 10px;">
                            <p class="small mb-0 text-light">${data.message}</p>
                        </div>
                        <span class="text-muted small">${data.created_at} ago</span>
                    </div>
                    <div class="border border-2 border-warning rounded-circle text-center text-light p-2" style="flex-shrink: 0; height: 45px; width: 45px; margin-left: 10px;">${data.initials}</div>
                </div>
            `;
        }
    } else if (data.type == 'writing_active') {
        if (!data.agent) {
            let tmpInfo = document.querySelector('.tmp-info');

            if (tmpInfo) {
                tmpInfo.remove();
            }

            console.log('data.type:', data.type);
            console.log('data.agent:', data.agent);
            console.log('tmpInfo:', tmpInfo);
            console.log('chatLogElement:', chatLogElement);

            chatLogElement.innerHTML += `
                <div class="tmp-info d-flex w-100 mt-2" style="max-width:448px">
                    <div class="rounded-circle border border-info border-2 text-center pt-2 text-white"style="flex-shrink: 0; height: 45px; width: 45px; margin-right: 10px;">${data.initials}</div>
                    <div class="ml-2">
                        <div class="p-3 border border-light" style="border-radius: 0px 10px 10px 10px;">
                            <p class="small mb-0 text-muted">The Client is writing...</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    scrollToBottom();
}


/**
 * Web socket
 */

// chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoom}/`)
chatSocket = new WebSocket(`wss://${window.location.host}/ws/${chatRoomUuid}/`);

chatSocket.onmessage = function(e) {
    console.log('on message')

    onChatMessage(JSON.parse(e.data))
}

chatSocket.onopen = function(e) {
    console.log('on open')

    scrollToBottom()
}

chatSocket.onclose = function(e) {
    console.log('chat socket closed unexpectadly')
}

/**
 * Event listeners
 */

chatSubmitElement.onclick = function(e) {
    e.preventDefault()

    sendMessage()

    return false
}


chatInputElement.onkeyup = function(e) {
    if (e.keyCode == 13) {
        sendMessage()
    }
}


chatInputElement.onfocus = function(e) {
    chatSocket.send(JSON.stringify({
        'type': 'update',
        'message': 'writing_active',
        'name': document.querySelector('#user_name').textContent.replaceAll('"', ''),
        'agent': document.querySelector('#user_id').textContent.replaceAll('"', ''),
    }))
}