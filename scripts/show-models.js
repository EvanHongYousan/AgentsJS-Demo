#!/usr/bin/env node

/**
 * 显示模型配置信息和可用模型列表
 */

import { showModelConfig, listOpenRouterModels } from "../config/model-config.js";

console.log("\n" + "=".repeat(70));
console.log("                    🤖 Agents.js 模型配置工具");
console.log("=".repeat(70));

// 显示当前配置
showModelConfig();

// 如果使用 OpenRouter，显示可用模型列表
const provider = process.env.AI_PROVIDER || "openrouter";
if (provider === "openrouter") {
  listOpenRouterModels();
  
  console.log("💡 使用提示:");
  console.log("   1. 在 .env 文件中修改 OPENROUTER_MODEL 来切换模型");
  console.log("   2. 或者在代码中使用: getModel({ modelName: 'model-name' })");
  console.log("   3. 查看完整模型列表: https://openrouter.ai/models\n");
}

console.log("📖 查看详细指南: OPENROUTER_GUIDE.md");
console.log("=".repeat(70) + "\n");
