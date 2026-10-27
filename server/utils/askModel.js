const sharp = require("sharp");

const timeoutMs = 20000;

function getUrl() {
  const base = (process.env.MODEL_API_URL || "").replace(/\/+$/, "");
  if (base.endsWith("/chat/completions")) {
    return base;
  }
  return base + "/chat/completions";
}

async function callModel(messages, options) {
  const key = process.env.MODEL_API_KEY;
  if (!key || !process.env.MODEL_API_URL) {
    return null;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const body = {
      model: options.vision ? process.env.VISION_MODEL_NAME : process.env.MODEL_NAME,
      messages,
      temperature: options.temperature === undefined ? 0.6 : options.temperature,
      max_tokens: options.maxTokens || 900
    };
    const response = await fetch(getUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    if (!response.ok) {
      console.log("The model answered with status " + response.status);
      return null;
    }
    const data = await response.json();
    const choice = data.choices && data.choices[0];
    const text = choice && choice.message && choice.message.content;
    if (typeof text !== "string" || !text.trim()) {
      console.log("The model sent an empty answer");
      return null;
    }
    return text.trim();
  } catch (error) {
    console.log("The model call failed: " + error.message);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function parseJson(text) {
  if (!text) {
    return null;
  }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch (error) {
    return null;
  }
}

function textMessages(system, prompt) {
  const messages = [];
  if (system) {
    messages.push({ role: "system", content: system });
  }
  messages.push({ role: "user", content: prompt });
  return messages;
}

async function askText(prompt, system, options) {
  return callModel(textMessages(system, prompt), options || {});
}

async function askJson(prompt, system, check, options) {
  const fullSystem = (system || "") + " Answer with one JSON object only, no words before or after it.";
  const text = await callModel(textMessages(fullSystem, prompt), options || {});
  const data = parseJson(text);
  if (!data || (check && !check(data))) {
    return null;
  }
  return data;
}

async function shrinkImage(buffer) {
  return sharp(buffer).rotate().resize(1024, 1024, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
}

async function askImage(buffer, prompt, system, check, options) {
  if (!process.env.MODEL_API_KEY) {
    return null;
  }
  try {
    const small = await shrinkImage(buffer);
    const dataUrl = "data:image/jpeg;base64," + small.toString("base64");
    const fullSystem = (system || "") + " Answer with one JSON object only, no words before or after it.";
    const messages = [
      { role: "system", content: fullSystem },
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: dataUrl } }
        ]
      }
    ];
    const text = await callModel(messages, { ...(options || {}), vision: true });
    const data = parseJson(text);
    if (!data || (check && !check(data))) {
      return null;
    }
    return data;
  } catch (error) {
    console.log("The image could not be sent to the model: " + error.message);
    return null;
  }
}

module.exports = { askText, askJson, askImage };
