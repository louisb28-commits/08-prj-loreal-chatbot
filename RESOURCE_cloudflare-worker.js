// Copy this code into your Cloudflare Worker script.

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    // Let browsers check the cross-origin request before sending it.
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "Use a POST request." }, {
        status: 405,
        headers: corsHeaders,
      });
    }

    if (!env.OPENAI_API_KEY) {
      return Response.json({ error: "The OpenAI API key is not configured." }, {
        status: 500,
        headers: corsHeaders,
      });
    }

    let userInput;
    try {
      userInput = await request.json();
    } catch {
      return Response.json({ error: "The request body must be valid JSON." }, {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (
      !Array.isArray(userInput.messages) ||
      userInput.messages.some(
        (message) =>
          !message ||
          !["user", "assistant"].includes(message.role) ||
          typeof message.content !== "string",
      )
    ) {
      return Response.json({ error: "The request must include valid messages." }, {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Keep the assistant focused on beauty and L’Oréal topics.
    const systemPrompt = `You are a friendly L’Oréal beauty advisor. Only answer questions about L’Oréal products, skincare, makeup, haircare, fragrance, beauty routines, recommendations, and closely related beauty topics. Politely decline unrelated questions and invite the user to ask about beauty instead. Never claim to diagnose or treat medical conditions; suggest a qualified professional for medical concerns. Be concise, helpful, and honest when you do not know a product detail.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [{ role: "system", content: systemPrompt }, ...userInput.messages],
        max_completion_tokens: 300,
      }),
    });

    const data = await response.json();

    return Response.json(data, {
      status: response.status,
      headers: corsHeaders,
    });
  }
};
