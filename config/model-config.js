/**
 * 统一的模型配置
 * 根据环境变量自动选择 OpenAI 或 OpenRouter
 */

import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

/**
 * 获取配置好的语言模型
 * @param {Object} options - 可选配置
 * @param {number} options.temperature - 温度参数 (0-1)
 * @param {string} options.modelName - 指定模型名称（可选，覆盖环境变量）
 * @returns {ChatOpenAI} 配置好的模型实例
 */
export function getModel(options = {}) {
  const { temperature = 0.7, modelName = null } = options;

  const provider = process.env.AI_PROVIDER || "openrouter";

  if (provider === "openrouter") {
    return getOpenRouterModel({ temperature, modelName });
  } else if (provider === "openai") {
    return getOpenAIModel({ temperature, modelName });
  } else {
    throw new Error(`未知的 AI_PROVIDER: ${provider}。请使用 'openai' 或 'openrouter'`);
  }
}

/**
 * 获取 OpenRouter 模型配置
 */
function getOpenRouterModel({ temperature, modelName }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseURL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
  const model = modelName || process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo";

  if (!apiKey) {
    throw new Error(
      "缺少 OPENROUTER_API_KEY 环境变量！请在 .env 文件中配置。\n" +
      "获取 API Key: https://openrouter.ai/keys"
    );
  }

  console.log(`🔧 使用 OpenRouter | 模型: ${model}`);

  return new ChatOpenAI({
    modelName: model,
    temperature: temperature,
    openAIApiKey: apiKey,
    configuration: {
      baseURL: baseURL,
      defaultHeaders: {
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "https://github.com/agents-js-demo",
        "X-Title": process.env.OPENROUTER_APP_NAME || "AgentsJS Demo",
      },
    },
  });
}

/**
 * 获取 OpenAI 模型配置
 */
function getOpenAIModel({ temperature, modelName }) {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = modelName || process.env.OPENAI_MODEL || "gpt-3.5-turbo";

  if (!apiKey) {
    throw new Error(
      "缺少 OPENAI_API_KEY 环境变量！请在 .env 文件中配置。\n" +
      "获取 API Key: https://platform.openai.com/api-keys"
    );
  }

  console.log(`🔧 使用 OpenAI | 模型: ${model}`);

  return new ChatOpenAI({
    modelName: model,
    temperature: temperature,
    openAIApiKey: apiKey,
    configuration: {
      baseURL: baseURL,
    },
  });
}

/**
 * 显示当前配置信息
 */
export function showModelConfig() {
  const provider = process.env.AI_PROVIDER || "openrouter";
  
  console.log("\n" + "=".repeat(60));
  console.log("🤖 AI 模型配置信息");
  console.log("=".repeat(60));
  console.log(`提供商: ${provider.toUpperCase()}`);
  
  if (provider === "openrouter") {
    console.log(`模型: ${process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo"}`);
    console.log(`Base URL: ${process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"}`);
    console.log(`API Key: ${process.env.OPENROUTER_API_KEY ? "已配置 ✓" : "未配置 ✗"}`);
  } else {
    console.log(`模型: ${process.env.OPENAI_MODEL || "gpt-3.5-turbo"}`);
    console.log(`Base URL: ${process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"}`);
    console.log(`API Key: ${process.env.OPENAI_API_KEY ? "已配置 ✓" : "未配置 ✗"}`);
  }
  
  console.log("=".repeat(60) + "\n");
}

/**
 * 列出 OpenRouter 常用模型
 */
export function listOpenRouterModels() {
  console.log("\n📋 OpenRouter 常用模型列表:\n");
  
  const models = [
    { name: "openai/gpt-3.5-turbo", desc: "OpenAI GPT-3.5 - 快速且便宜", price: "$" },
    { name: "openai/gpt-4", desc: "OpenAI GPT-4 - 高质量", price: "$$$" },
    { name: "openai/gpt-4-turbo", desc: "OpenAI GPT-4 Turbo - 更快的 GPT-4", price: "$$" },
    { name: "anthropic/claude-3-haiku", desc: "Claude 3 Haiku - 快速响应", price: "$" },
    { name: "anthropic/claude-3-sonnet", desc: "Claude 3 Sonnet - 性能平衡", price: "$$" },
    { name: "anthropic/claude-3-opus", desc: "Claude 3 Opus - 最强性能", price: "$$$" },
    { name: "google/gemini-pro", desc: "Google Gemini Pro - 免费额度", price: "FREE" },
    { name: "meta-llama/llama-3-8b-instruct", desc: "Llama 3 8B - 开源模型", price: "$" },
    { name: "meta-llama/llama-3-70b-instruct", desc: "Llama 3 70B - 大型开源", price: "$$" },
  ];

  models.forEach(m => {
    console.log(`  ${m.name.padEnd(35)} | ${m.desc.padEnd(35)} | ${m.price}`);
  });

  console.log("\n更多模型: https://openrouter.ai/models\n");
}
