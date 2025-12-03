/**
 * 示例 2: 带工具的 Agent
 * 展示如何给 Agent 添加自定义工具
 */

import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

async function runAgentWithTools() {
  console.log("🔧 示例 2: 带工具的 Agent\n");
  console.log("=".repeat(50));

  // 1. 定义自定义工具 - 计算器
  const calculatorTool = new DynamicStructuredTool({
    name: "calculator",
    description: "用于执行基本的数学计算，支持加减乘除",
    schema: z.object({
      expression: z.string().describe("要计算的数学表达式，例如: '2 + 2' 或 '10 * 5'"),
    }),
    func: async ({ expression }) => {
      try {
        // 安全地评估数学表达式
        const result = eval(expression);
        return `计算结果: ${expression} = ${result}`;
      } catch (error) {
        return `计算错误: ${error.message}`;
      }
    },
  });

  // 2. 定义自定义工具 - 天气查询（模拟）
  const weatherTool = new DynamicStructuredTool({
    name: "get_weather",
    description: "获取指定城市的天气信息",
    schema: z.object({
      city: z.string().describe("城市名称，例如: '北京' 或 '上海'"),
    }),
    func: async ({ city }) => {
      // 模拟天气数据
      const weatherData = {
        "北京": "晴天，温度 15-25°C",
        "上海": "多云，温度 18-26°C",
        "深圳": "雨天，温度 22-28°C",
      };
      return weatherData[city] || `抱歉，暂无 ${city} 的天气数据`;
    },
  });

  // 3. 定义自定义工具 - 时间工具
  const timeTool = new DynamicStructuredTool({
    name: "get_current_time",
    description: "获取当前时间",
    schema: z.object({
      timezone: z.string().optional().describe("时区，例如: 'Asia/Shanghai'"),
    }),
    func: async () => {
      const now = new Date();
      return `当前时间: ${now.toLocaleString("zh-CN")}`;
    },
  });

  // 4. 初始化模型
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
    configuration: {
      baseURL: process.env.OPENAI_BASE_URL,
    },
  });

  // 5. 创建 Agent，添加工具
  const agent = await initializeAgentExecutorWithOptions(
    [calculatorTool, weatherTool, timeTool],
    model,
    {
      agentType: "chat-conversational-react-description",
      verbose: true,
    }
  );

  // 6. 测试不同的任务
  const tasks = [
    "帮我计算 123 * 456 等于多少",
    "北京今天天气怎么样？",
    "现在几点了？",
    "如果上海的温度上限是26度，那么比它高10度是多少？先查天气再计算",
  ];

  for (const task of tasks) {
    console.log(`\n📝 任务: ${task}\n`);
    const response = await agent.invoke({ input: task });
    console.log(`✅ 结果: ${response.output}`);
    console.log("-".repeat(50));
  }

  console.log("\n" + "=".repeat(50));
}

// 运行示例
runAgentWithTools().catch(console.error);
