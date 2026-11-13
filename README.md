# Project 8: L'Oréal Chatbot

L’Oréal is exploring the power of AI, and your job is to showcase what's possible. Your task is to build a chatbot that helps users discover and understand L’Oréal’s extensive range of products—makeup, skincare, haircare, and fragrances—as well as provide personalized routines and recommendations.

## 🚀 Launch via GitHub Codespaces

1. In the GitHub repo, click the **Code** button and select **Open with Codespaces → New codespace**.
2. Once your codespace is ready, open the `index.html` file via the live preview.

## ☁️ Cloudflare Note

The browser sends chat messages to your Cloudflare Worker. The Worker adds the
beauty-advisor system prompt and sends the request to OpenAI using the secret
stored in Cloudflare.

1. Create a Cloudflare Worker and paste in the code from
   `RESOURCE_cloudflare-worker.js`.
2. In the Worker settings, add an encrypted secret named `OPENAI_API_KEY`.
   Enter your key directly in Cloudflare. **Do not put the key in this
   repository or in `secrets.js`.**
3. Deploy the Worker and copy its URL.
4. In `script.js`, replace `PASTE_YOUR_CLOUDFLARE_WORKER_URL_HERE` with that
   URL.

The browser expects the Worker to return the OpenAI Chat Completions response,
including `data.choices[0].message.content`. A Monotype case-study directory
is available at [Monotype Resources](https://www.monotype.com/resources/case-studies);
the page uses L’Oréal’s supplied wordmark with a restrained black-and-warm-neutral
palette and legible sans-serif text.

Enjoy building your L’Oréal beauty assistant! 💄
