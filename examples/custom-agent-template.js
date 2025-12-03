/**
 * 自定义 Agent 模板
 * 复制这个文件开始创建你自己的 Agent
 */

import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getModel, showModelConfig } from "../config/model-config.js";

async function createCustomAgent() {
  console.log("🎨 自定义 Agent 模板\n");
  console.log("=".repeat(50));

  // ===== 第一步: 定义你的工具 =====
  
  // 工具示例 1: 简单工具（无参数）
  const simpleTool = new DynamicStructuredTool({
    name: "simple_tool",
    description: "这是一个简单的示例工具",
    schema: z.object({}), // 无参数
    func: async () => {
      return "简单工具被调用了！";
    },
  });

  // 工具示例 2: 带参数的工具
  const parameterizedTool = new DynamicStructuredTool({
    name: "parameterized_tool",
    description: "这是一个带参数的工具，可以处理用户输入",
    schema: z.object({
      input_text: z.string().describe("用户输入的文本"),
      count: z.number().optional().describe("可选的数字参数"),
    }),
    func: async ({ input_text, count = 1 }) => {
      return `处理了文本: "${input_text}"，重复 ${count} 次`;
    },
  });

  // 工具示例 3: 异步工具（模拟 API 调用）
  const asyncTool = new DynamicStructuredTool({
    name: "async_api_tool",
    description: "模拟异步 API 调用",
    schema: z.object({
      endpoint: z.string().describe("API 端点"),
    }),
    func: async ({ endpoint }) => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `API 调用成功: ${endpoint}`;
    },
  });

  // 工具示例 4: 状态管理工具
  const state = { counter: 0 };
  
  const statefulTool = new DynamicStructuredTool({
    name: "counter_tool",
    description: "管理计数器状态",
    schema: z.object({
      action: z.enum(["increment", "decrement", "get"]).describe("操作类型"),
    }),
    func: async ({ action }) => {
      switch (action) {
        case "increment":
          state.counter++;
          return `计数器增加到 ${state.counter}`;
        case "decrement":
          state.counter--;
          return `计数器减少到 ${state.counter}`;
        case "get":
          return `当前计数器值: ${state.counter}`;
        default:
          return "未知操作";
      }
    },
  });

  // 显示当前模型配置
  showModelConfig();

  // ===== 第二步: 配置语言模型 =====
  
  const model = getModel({ 
    temperature: 0.7, // 0 = 确定性，1 = 创造性
    // modelName: "anthropic/claude-3-haiku" // 可选：覆盖环境变量中的模型
  });

  // ===== 第三步: 配置记忆（可选）=====
  
  const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
    inputKey: "input",
    outputKey: "output",
  });

  // ===== 第四步: 创建 Agent =====
  
  const agent = await initializeAgentExecutorWithOptions(
    [
      simpleTool,
      parameterizedTool,
      asyncTool,
      statefulTool,
    ],
    model,
    {
      agentType: "chat-conversational-react-description",
      memory: memory, // 如果不需要记忆，删除这行
      verbose: true, // 显示详细日志
      maxIterations: 10, // 最大迭代次数
    }
  );

  // ===== 第五步: 使用 Agent =====
  
  const testQueries = [
    "调用简单工具",
    "用参数工具处理'Hello World'，重复3次",
    "调用 API 端点 /users",
    "把计数器增加3次，然后告诉我当前值",
  ];

  console.log("\n🧪 测试 Agent...\n");

  for (const query of testQueries) {
    console.log(`\n📝 查询: ${query}\n`);
    try {
      const response = await agent.invoke({ input: query });
      console.log(`✅ 响应: ${response.output}`);
    } catch (error) {
      console.error(`❌ 错误: ${error.message}`);
    }
    console.log("-".repeat(50));
  }

  console.log("\n" + "=".repeat(50));
  console.log("\n💡 提示:");
  console.log("1. 修改工具定义来创建你自己的功能");
  console.log("2. 调整 temperature 来改变 Agent 的创造性");
  console.log("3. 添加更多工具来扩展 Agent 的能力");
  console.log("4. 使用 verbose: false 来隐藏详细日志");
}

// ===== 运行 Agent =====

createCustomAgent().catch(console.error);

// ===== 导出供其他文件使用 =====

export { createCustomAgent };
