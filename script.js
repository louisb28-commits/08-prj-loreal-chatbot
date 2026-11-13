/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const latestQuestion = document.getElementById("latestQuestion");
const sendBtn = document.getElementById("sendBtn");

// The URL of the class-hosted Cloudflare Worker (find it in the README / your instructor).
// No API key is needed here: the Worker keeps the key safe on the server.
const WORKER_URL = "https://holy-hill-e79c.louisb28.workers.dev/";

// The system prompt tells the AI who it is and what it may talk about
const systemPrompt = `You are the L'Oréal Smart Product Advisor, a friendly beauty assistant.
Only answer questions about L'Oréal products (makeup, skincare, haircare, fragrance),
beauty routines, and personalized product recommendations.
If a question is unrelated to L'Oréal or beauty, politely say you can only help
with L'Oréal products and beauty advice, and invite the user to ask about those.
Keep answers short, warm, and easy to read.`;

// Conversation history: starts with the system prompt.
// We add every user and assistant message so the AI remembers the chat
// (including the user's name and earlier questions).
const messages = [{ role: "system", content: systemPrompt }];

// Add a message bubble to the chat window and return it
function addMessage(text, sender) {
  const bubble = document.createElement("div");
  bubble.className = `msg ${sender}`; // "user" or "ai"
  bubble.textContent = text; // textContent is safe (no HTML injection)
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight; // scroll to newest message
  return bubble;
}

// Set initial message
addMessage("👋 Hello! How can I help you today?", "ai");

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 1. Get the user's message and clear the input box
  const question = userInput.value.trim();
  if (!question) return;
  userInput.value = "";

  // 2. Show the question above the chat (replaces the previous one)
  latestQuestion.textContent = `You asked: ${question}`;
  latestQuestion.hidden = false;

  // 3. Show the user's bubble and save it in the history
  addMessage(question, "user");
  messages.push({ role: "user", content: question });

  // 4. Show a temporary "thinking" bubble and disable the button
  const thinking = addMessage("Thinking…", "ai");
  thinking.classList.add("thinking");
  sendBtn.disabled = true;

  try {
    // 5. Send the whole conversation to the Cloudflare Worker
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages }),
    });
    const data = await response.json();

    // 6. Read the assistant's reply from the response
    const reply = data.choices[0].message.content;

    // 7. Replace the "thinking" bubble with the real reply and save it
    thinking.classList.remove("thinking");
    thinking.textContent = reply;
    messages.push({ role: "assistant", content: reply });
  } catch (error) {
    // If something goes wrong, tell the user what to do
    console.error(error);
    thinking.classList.remove("thinking");
    thinking.textContent =
      "Sorry, something went wrong. Please check the Worker URL and try again.";
    messages.pop(); // remove the unanswered question from the history
  }

  // 8. Re-enable the button and scroll to the bottom
  sendBtn.disabled = false;
  userInput.focus();
  chatWindow.scrollTop = chatWindow.scrollHeight;
});
