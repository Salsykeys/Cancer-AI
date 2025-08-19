const chatsContainer = document.querySelector('.chats-container');
const promptForm = document.querySelector('.prompt-form');
const promptInput = promptForm.querySelector(".prompt-input");

let userMessage = "";

// Function to create a message element
const createMsgElement = (content, ...classes) => {
    const div = document.createElement('div');
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

// Handle form submission, This function will be called when the form is submitted
const handleFormSubmit = (e) => {
    e.preventDefault();
    userMessage = promptInput.value.trim();
   if (!userMessage) return;

    promptInput.value = ""; // Clear the input field

   // Generate user message HTML and add it to the chats container
   const userMsgHTML = `<p class="message-text"></p>`
   const userMsgDiv = createMsgElement(userMsgHTML, "user-message");

   userMsgDiv.querySelector('.message-text').textContent = userMessage;
   chatsContainer.appendChild(userMsgDiv);

   setTimeout(() => {
     // Generate bot message HTML and add it to the chats container after 600ms
     const botMsgHTML = `<img src="gemini.svg" class="avatar"><p class="message-text">Just a sec...</p>`;
     const botMsgDiv = createMsgElement(botMsgHTML, "bot-message", "loading");
     chatsContainer.appendChild(botMsgDiv);
   }, 600);
}

promptForm.addEventListener('submit', handleFormSubmit);