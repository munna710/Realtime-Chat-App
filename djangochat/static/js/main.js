/**
 * Elements
 */

const chatElement = document.querySelector('#chat')
const chatOpenElement = document.querySelector('#chat_open')
const chatJoinElement = document.querySelector('#chat_join')
const chatIconElement = document.querySelector('#chat_icon')
const chatWelcomeElement = document.querySelector('#chat_welcome')


/**
 * Event listeners
 */

chatOpenElement.onclick = function(e) {
    e.preventDefault()

    chatIconElement.classList.add('d-none')
    chatWelcomeElement.classList.remove('d-none')

    return false
}

document.addEventListener('click', function(e) {
    if (!chatWelcomeElement.contains(e.target) && !chatOpenElement.contains(e.target)) {
        chatIconElement.classList.remove('d-none');
        chatWelcomeElement.classList.add('d-none');
    }
});