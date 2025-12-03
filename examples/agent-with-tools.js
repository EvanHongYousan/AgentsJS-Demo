/**
 * 示例 2: 带工具的 Agent
 * 展示如何给 Agent 添加自定义工具
 */

import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getModel, showModelConfig } from "../config/model-config.js";

async function runAgentWithTools() {
  console.log("🔧 示例 2: 带工具的 Agent\n");
  console.log("=".repeat(50));

  // 1. 定义自定义工具 - 计算器
  const calculatorTool = new DynamicStructuredTool({
    name: "calculator",
    description: "用于执行基本的数学计算，支持加减乘除。输入一个数学表达式，返回计算结果。",
    schema: z.object({
      expression: z.string().describe("要计算的数学表达式，例如: '2 + 2' 或 '10 * 5'"),
    }),
    func: async ({ expression }) => {
      try {
        // 清理表达式，只允许数字和基本运算符
        const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
        const result = eval(sanitized);
        return `计算结果: ${expression} = ${result}`;
      } catch (error) {
        return `计算错误: ${error.message}`;
      }
    },
  });

  // 2. 定义自定义工具 - 天气查询（模拟）
  const weatherTool = new DynamicStructuredTool({
    name: "get_weather",
    description: "获取指定城市的天气信息。输入城市名称，返回该城市的天气状况。",
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
    description: "获取当前时间。无需输入参数，直接返回当前时间。",
    schema: z.object({}), // 移除可选参数，简化为无参数
    func: async () => {
      const now = new Date();
      return `当前时间: ${now.toLocaleString("zh-CN")}`;
    },
  });

  // 显示当前模型配置
  showModelConfig();

  // 4. 初始化模型
  const model = getModel({ temperature: 0 });

  // 5. 创建 Agent，添加工具
  // 使用 structured-chat-zero-shot-react-description 以获得更好的工具兼容性
  const agent = await initializeAgentExecutorWithOptions(
    [calculatorTool, weatherTool, timeTool],
    model,
    {
      agentType: "structured-chat-zero-shot-react-description",
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
