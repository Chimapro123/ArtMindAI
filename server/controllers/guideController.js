const Painting = require("../models/Painting");
const Conversation = require("../models/Conversation");
const { askJson } = require("../utils/askModel");
const { shapePainting } = require("../utils/shapePainting");
const { findMatches, factsFor, fallbackAnswer, makeTitle, tidyAnswer } = require("../utils/guideHelpers");

const system =
  "You are the guide at ArtMind, a small online gallery of public domain paintings. You only talk about the paintings in the facts you are given. " +
  "If the facts do not answer the question, say in a friendly way that you are not sure. Answer in two or three friendly sentences in plain words, with no lists and no dashes. " +
  "Give a JSON object with answer (your sentences) and slugs (up to three slugs from the facts that fit the answer, or an empty list).";

function checkAnswer(data) {
  return typeof data.answer === "string" && data.answer.trim().length > 0;
}

function historyText(conversation) {
  if (!conversation || !conversation.messages.length) {
    return "";
  }
  const recent = conversation.messages.slice(-6).map((message) => message.from + ": " + message.text).join("\n");
  return "Earlier in this conversation:\n" + recent + "\n\n";
}

async function askTheModel(question, matches, conversation) {
  const facts = matches.length ? matches.map(factsFor).join("\n") : "No paintings in the gallery match this question.";
  const prompt = historyText(conversation) + "Facts about the paintings:\n" + facts + "\n\nThe visitor asks: " + question;
  return askJson(prompt, system, checkAnswer, { maxTokens: 400 });
}

async function ask(request, response) {
  try {
    const question = String(request.body.question || "").trim().slice(0, 500);
    if (!question) {
      return response.status(400).json({ message: "Ask me something first" });
    }
    const user = request.user;
    let conversation = null;
    if (request.body.conversationId) {
      conversation = await Conversation.findOne({ _id: request.body.conversationId, user: user._id });
    }
    const paintings = await Painting.find({ status: "on-the-wall" });
    const matches = findMatches(question, paintings, request.body.paintingSlug);
    let answer = "";
    let shown = [];
    const fromModel = await askTheModel(question, matches, conversation);
    if (fromModel) {
      answer = tidyAnswer(fromModel.answer);
      const slugs = Array.isArray(fromModel.slugs) ? fromModel.slugs.slice(0, 3) : [];
      shown = slugs.map((slug) => paintings.find((painting) => painting.slug === slug)).filter(Boolean);
    } else {
      answer = fallbackAnswer(question, matches);
      shown = matches.slice(0, 3);
    }
    if (!conversation) {
      conversation = new Conversation({ user: user._id, title: makeTitle(question), messages: [] });
    }
    conversation.messages.push({ from: "visitor", text: question, paintings: [] });
    conversation.messages.push({ from: "guide", text: answer, paintings: shown.map((painting) => painting.slug) });
    await conversation.save();
    response.json({ answer, paintings: shown.map(shapePainting), conversationId: String(conversation._id), title: conversation.title });
  } catch (error) {
    response.status(500).json({ message: "The guide could not answer. Please try again" });
  }
}

async function listConversations(request, response) {
  try {
    const conversations = await Conversation.find({ user: request.user._id }).sort({ updatedAt: -1 }).select("title createdAt updatedAt messages");
    const items = conversations.map((conversation) => ({
      id: String(conversation._id),
      title: conversation.title,
      messageCount: conversation.messages.length,
      startedAt: conversation.createdAt,
      updatedAt: conversation.updatedAt
    }));
    response.json({ items, total: items.length, page: 1, pages: 1 });
  } catch (error) {
    response.status(500).json({ message: "Your conversations could not be loaded" });
  }
}

async function getConversation(request, response) {
  try {
    const conversation = await Conversation.findOne({ _id: request.params.id, user: request.user._id });
    if (!conversation) {
      return response.status(404).json({ message: "We could not find that conversation" });
    }
    const slugs = [...new Set(conversation.messages.flatMap((message) => message.paintings))];
    const paintings = await Painting.find({ slug: { $in: slugs } });
    const messages = conversation.messages.map((message) => ({
      from: message.from,
      text: message.text,
      paintings: message.paintings.map((slug) => shapePainting(paintings.find((painting) => painting.slug === slug))).filter(Boolean),
      sentAt: message.sentAt
    }));
    response.json({
      conversation: { id: String(conversation._id), title: conversation.title, messages, startedAt: conversation.createdAt, updatedAt: conversation.updatedAt }
    });
  } catch (error) {
    response.status(404).json({ message: "We could not find that conversation" });
  }
}

module.exports = { ask, listConversations, getConversation };
