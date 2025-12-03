/**
 * 示例 1: 基础 Agent
 * 展示如何创建一个最简单的 AI Agent
 */

import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import dotenv from "dotenv";

dotenv.config();

async function runBasicAgent() {
  console.log("🤖 示例 1: 基础 Agent\n");
  console.log("=" .repeat(50));

  // 1. 初始化语言模型
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
    configuration: {
      baseURL: process.env.OPENAI_BASE_URL,
    },
  });

  // 2. 创建 Agent (无工具版本)
  const agent = await initializeAgentExecutorWithOptions(
    [], // 空工具列表
    model,
    {
      agentType: "chat-conversational-react-description",
      verbose: true, // 显示详细日志
    }
  );

  // 3. 运行 Agent
  console.log("\n📝 提问: 什么是 AI Agent？\n");
  const response = await agent.invoke({
    input: "用简单的话解释什么是 AI Agent，不超过100字",
  });

  console.log("\n✅ 回答:");
  console.log(response.output);
  console.log("\n" + "=".repeat(50));
}

// 运行示例
runBasicAgent().catch(console.error);
