import Config from "./config.js";

const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const fileInput = promptForm.querySelector("#file-input");
const fileUploadWrapper = promptForm.querySelector(".file-upload-wrapper");

// API setup
const API_KEY = `${Config.API_KEY}`;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

let typingInterval, controller;
const chatHistory = []; // Initialize chat history
const userData = { message: "", file: {} };

// Function to create a message element
const createMsgElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Scroll to the bottom of the container
const scrollToBottom = () =>
  container.scrollTo({
    top: container.scrollHeight,
    behavior: "smooth",
  });

// Simulate typing effect for bot's response
const typingEffect = (text, textElement, botMsgDiv) => {
  textElement.textContent = ""; // Clear previous text
  const words = text.split(" ");
  let wordIndex = 0;

  // Set loading class to show bot is typing
  typingInterval = setInterval(() => {
    if (wordIndex < words.length) {
      textElement.textContent +=
        (wordIndex === 0 ? "" : " ") + words[wordIndex++];
      scrollToBottom(); // Scroll to bottom after each word
    } else {
      clearInterval(typingInterval);
      botMsgDiv.classList.remove("loading"); // Remove loading class when done
      document.body.classList.remove("bot-responding"); // Add bot message class
    }
  }, 40); // Adjust typing speed here
};

// make API call and generate bot's response
const generateResponse = async (botMsgDiv) => {
  const textElement = botMsgDiv.querySelector(".message-text");
  controller = new AbortController(); // Create a new AbortController for each request

  // Add user message to chat history
  chatHistory.push({
    role: "user",
    parts: [
      { text: userData.message },
      ...(userData.file.data
        ? [
            {
              inline_data: (({ fileName, isImage, ...rest }) => rest)(
                userData.file
              ),
            },
          ]
        : []),
    ],
  });

  try {
    // Send the chat history to the API to get the response
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: chatHistory }),
      signal: controller.signal, // Pass the AbortController signal
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    const responseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .trim();
    typingEffect(responseText, textElement, botMsgDiv);

    chatHistory.push({
      role: "model",
      parts: [{ text: responseText }],
    });

    console.log(chatHistory);
  } catch (error) {
    textElement.style.color = "#d62939"
    textElement.textContent = error.name === "AbortError" ? "Response generation aborted" : error.message;
    botMsgDiv.classList.remove("loading");
    document.body.classList.remove("bot-responding"); 
  } finally {
    userData.file = {}; // Clear userData file after response
  }
};

// Handle form submission, This function will be called when the form is submitted
const handleFormSubmit = (e) => {
  e.preventDefault();
  const userMessage = promptInput.value.trim();
  if (!userMessage ||   document.body.classList.contains("bot-responding")) return;

  promptInput.value = ""; // Clear the input field
  userData.message = userMessage; // Store user message in userData
  document.body.classList.add("bot-responding");
  fileUploadWrapper.classList.remove("active", "img-attached", "file-attached");

  // Generate user message HTML and add it to the chats container
  const userMsgHTML = `
  <p class="message-text"></p>
  ${
    userData.file.data
      ? userData.file.isImage
        ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="img-attachment"/>`
        : `<p class="file-attachment"><span class="material-symbols-outlined">description</span>${userData.file.fileName}</p>`
      : ""
  }`;
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

// Handle file input change
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const isImage = file.type.startsWith("image/");
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = (e) => {
    fileInput.value = ""; // Clear the file input
    const base64String = e.target.result.split(",")[1]; // Get the base64 string
    fileUploadWrapper.querySelector(".file-preview").src = e.target.result; // Set the image source
    fileUploadWrapper.classList.add(
      "active",
      isImage ? "img-attached" : "file-attached"
    );

    userData.file = {
      fileName: file.name,
      data: base64String,
      mime_type: file.type,
      isImage,
    };
  };
});

// Handle cancel file button click
document.querySelector("#cancel-file-btn").addEventListener("click", () => {
  userData.file = {}; // Clear userData file
  fileUploadWrapper.classList.remove("active", "img-attached", "file-attached");
});

// Handle stop response button click
document.querySelector("#stop-response-btn").addEventListener("click", () => {
  userData.file = {}; // Clear userData file
  controller?.abort(); // Abort the request
  clearInterval(typingInterval); // Clear the typing effect interval
  chatsContainer.querySelector(".bot-message.loading").classList.remove("loading");
  document.body.classList.remove("bot-responding"); // Remove bot responding class 
});

// Delete all chats 
document.querySelector("#delete-chats-button").addEventListener("click", () => {
  chatHistory.length = 0; // Clear chat history
  chatsContainer.innerHTML = ""; // Clear the chats container
  document.body.classList.remove("bot-responding");
});

promptForm.addEventListener("submit", handleFormSubmit);
promptForm.querySelector("#add-file-btn").addEventListener("click", () => {
  fileInput.click(); // Trigger file input click
});
