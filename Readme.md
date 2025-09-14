# 🤖 AI Chatbot Website "Cancer"

This project is a simple, modern AI chatbot website built with **HTML**, **CSS**, and plain **JavaScript**. It leverages the power of **Google's Gemini 2.5 Flash API** to provide quick and engaging conversational responses. The design is sleek and user-friendly, offering an interactive chat experience directly in the browser.

-----

### ✨ Features

  * **Real-time Conversations**: Experience instant responses from the Gemini AI model.
  * **Intuitive UI**: A clean and easy-to-navigate chat interface.
  * **File Attachment Support**: Send images as part of your prompts for a more dynamic interaction.
  * **Dynamic Typing Effect**: A subtle typing animation simulates a more natural conversation flow.
  * **Toggle Theme**: Easily switch between light and dark modes to suit your preference.
  * **Responsive Design**: The website is fully responsive and works seamlessly on both desktop and mobile devices.

-----

### 💻 Technologies Used

  * **Frontend**: HTML, CSS, and Vanilla JavaScript
  * **Backend**: Google Gemini 2.5 Flash API

-----

### 🚀 Getting Started

To run this project, follow these simple steps:

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/Salsykeys/Cancer-AI.git
    ```

2.  **Get an API Key**:

      * Sign up for a Google AI Studio account to get your Gemini API key.
      * Create a `config.js` file in the project's root directory.

3.  **Configure your API key**:

      * Add your API key to the `config.js` file like this:
        ```javascript
        const Config = {
          API_KEY: "YOUR_API_KEY"
        };

        export default Config;
        ```
      * **Note**: For security, avoid committing your API key to your repository. You can add `config.js` to your `.gitignore` file.

4.  **Open the project**:

      * Open the `index.html` file in your preferred web browser to start using the chatbot.
