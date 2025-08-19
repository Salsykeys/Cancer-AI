import Config from "./config.js";

const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");

// API setup
const API_KEY = `${Config.API_KEY}`;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

let userMessage = "";
const chatHistory = []; // Initialize chat history

// Function to create a message element
const createMsgElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Scroll to the bottom of the container
const scrollToBottom = () => container.scrollTo({
    top: container.scrollHeight,
    behavior: "smooth"
}); 

// Simulate typing effect for bot's response
const typingEffect = (text, textElement, botMsgDiv) => {
    textElement.textContent = ""; // Clear previous text
    const words = text.split(" ");
    let wordIndex = 0;

    // Set loading class to show bot is typing
    const typingInterval = setInterval (() => {
        if (wordIndex < words.length) {
            textElement.textContent += (wordIndex === 0 ? "" : " ") + words[wordIndex++];
            scrollToBottom(); // Scroll to bottom after each word
        }else {
            clearInterval(typingInterval);
            botMsgDiv.classList.remove("loading"); // Remove loading class when done
        }
    },40); // Adjust typing speed here
}

// make API call and generate bot's response
const generateResponse = async (botMsgDiv) => {
    const textElement = botMsgDiv.querySelector(".message-text");
  // Add user message to chat history
  chatHistory.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  try {
    // Send the chat history to the API to get the response
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: chatHistory }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    const responseText = data.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
    typingEffect(responseText, textElement, botMsgDiv);
    chatHistory.push({
      role: "model",
      parts: [{ text: responseText }],
    });
  } catch (error) {
    console.log(error);
  }
};

// Handle form submission, This function will be called when the form is submitted
const handleFormSubmit = (e) => {
  e.preventDefault();
  userMessage = promptInput.value.trim();
  if (!userMessage) return;

  promptInput.value = ""; // Clear the input field

  // Generate user message HTML and add it to the chats container
  const userMsgHTML = `<p class="message-text"></p>`;
  const userMsgDiv = createMsgElement(userMsgHTML, "user-message");

  userMsgDiv.querySelector(".message-text").textContent = userMessage;
  chatsContainer.appendChild(userMsgDiv);
  scrollToBottom(); // Scroll to bottom after adding user message

  setTimeout(() => {
    // Generate bot message HTML and add it to the chats container after 600ms
    const botMsgHTML = `<img src="img/cancer-rbg.png" class="avatar"><p class="message-text">Just a sec...</p>`;
    const botMsgDiv = createMsgElement(botMsgHTML, "bot-message", "loading");
    chatsContainer.appendChild(botMsgDiv);
    generateResponse(botMsgDiv);
  }, 600);
};

promptForm.addEventListener("submit", handleFormSubmit);
