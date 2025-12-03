/**
 * 示例 3: 带记忆的 Agent
 * 展示如何让 Agent 记住对话历史
 */

import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getModel, showModelConfig } from "../config/model-config.js";

async function runAgentWithMemory() {
  console.log("🧠 示例 3: 带记忆的 Agent\n");
  console.log("=".repeat(50));

  // 1. 创建一个简单的笔记工具
  const notes = []; // 模拟笔记存储

  const saveNoteTool = new DynamicStructuredTool({
    name: "save_note",
    description: "保存一条笔记到笔记本",
    schema: z.object({
      content: z.string().describe("要保存的笔记内容"),
    }),
    func: async ({ content }) => {
      notes.push({ id: notes.length + 1, content, time: new Date() });
      return `✅ 笔记已保存: "${content}"`;
    },
  });

  const listNotesTool = new DynamicStructuredTool({
    name: "list_notes",
    description: "列出所有已保存的笔记",
    schema: z.object({}),
    func: async () => {
      if (notes.length === 0) {
        return "📝 暂无笔记";
      }
      return notes.map(n => `${n.id}. ${n.content}`).join("\n");
    },
  });

  // 显示当前模型配置
  showModelConfig();

  // 2. 初始化模型
  const model = getModel({ temperature: 0.7 });

  // 3. 创建记忆组件
  const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
    inputKey: "input",
    outputKey: "output",
  });

  // 4. 创建带记忆的 Agent
  const agent = await initializeAgentExecutorWithOptions(
    [saveNoteTool, listNotesTool],
    model,
    {
      agentType: "chat-conversational-react-description",
      memory: memory,
      verbose: true,
    }
  );

  // 5. 模拟多轮对话
  const conversation = [
    "我叫张三",
    "帮我记一条笔记：明天下午3点开会",
    "再记一条：记得买牛奶",
    "我叫什么名字？", // 测试记忆
    "我有哪些笔记？",
    "总结一下我们刚才的对话",
  ];

  for (const message of conversation) {
    console.log(`\n👤 用户: ${message}\n`);
    const response = await agent.invoke({ input: message });
    console.log(`🤖 Agent: ${response.output}`);
    console.log("-".repeat(50));
  }

  console.log("\n" + "=".repeat(50));
}

// 运行示例
runAgentWithMemory().catch(console.error);
