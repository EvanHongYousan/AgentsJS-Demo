/**
 * 综合示例: 智能助手 Agent
 * 结合前面所有概念，创建一个功能完整的智能助手
 */

import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

async function createSmartAssistant() {
  console.log("🤖 综合示例: 智能助手 Agent\n");
  console.log("=".repeat(50));

  // ===== 数据存储 =====
  const todoList = [];
  const reminders = [];
  const userProfile = {
    name: "",
    preferences: {},
  };

  // ===== 工具定义 =====

  // 1. 待办事项管理
  const addTodoTool = new DynamicStructuredTool({
    name: "add_todo",
    description: "添加一个待办事项",
    schema: z.object({
      task: z.string().describe("待办事项内容"),
      priority: z.enum(["high", "medium", "low"]).describe("优先级"),
    }),
    func: async ({ task, priority }) => {
      const todo = {
        id: todoList.length + 1,
        task,
        priority,
        completed: false,
        createdAt: new Date(),
      };
      todoList.push(todo);
      return `✅ 已添加待办事项: "${task}" (优先级: ${priority})`;
    },
  });

  const listTodosTool = new DynamicStructuredTool({
    name: "list_todos",
    description: "列出所有待办事项",
    schema: z.object({
      filter: z.enum(["all", "pending", "completed"]).optional().describe("筛选条件"),
    }),
    func: async ({ filter = "all" }) => {
      let filtered = todoList;
      if (filter === "pending") {
        filtered = todoList.filter(t => !t.completed);
      } else if (filter === "completed") {
        filtered = todoList.filter(t => t.completed);
      }

      if (filtered.length === 0) {
        return "📝 暂无待办事项";
      }

      return filtered
        .map(t => `${t.id}. [${t.priority}] ${t.task} ${t.completed ? "✓" : "○"}`)
        .join("\n");
    },
  });

  const completeTodoTool = new DynamicStructuredTool({
    name: "complete_todo",
    description: "标记待办事项为已完成",
    schema: z.object({
      id: z.number().describe("待办事项ID"),
    }),
    func: async ({ id }) => {
      const todo = todoList.find(t => t.id === id);
      if (!todo) {
        return `❌ 未找到ID为 ${id} 的待办事项`;
      }
      todo.completed = true;
      return `✅ 待办事项 "${todo.task}" 已标记为完成`;
    },
  });

  // 2. 提醒管理
  const setReminderTool = new DynamicStructuredTool({
    name: "set_reminder",
    description: "设置一个提醒",
    schema: z.object({
      content: z.string().describe("提醒内容"),
      time: z.string().describe("提醒时间（相对时间，如：30分钟后、明天早上）"),
    }),
    func: async ({ content, time }) => {
      const reminder = {
        id: reminders.length + 1,
        content,
        time,
        createdAt: new Date(),
      };
      reminders.push(reminder);
      return `⏰ 已设置提醒: "${content}" (时间: ${time})`;
    },
  });

  const listRemindersTool = new DynamicStructuredTool({
    name: "list_reminders",
    description: "列出所有提醒",
    schema: z.object({}),
    func: async () => {
      if (reminders.length === 0) {
        return "⏰ 暂无提醒";
      }
      return reminders
        .map(r => `${r.id}. ${r.content} (${r.time})`)
        .join("\n");
    },
  });

  // 3. 计算工具
  const calculatorTool = new DynamicStructuredTool({
    name: "calculator",
    description: "执行数学计算",
    schema: z.object({
      expression: z.string().describe("数学表达式"),
    }),
    func: async ({ expression }) => {
      try {
        const result = eval(expression);
        return `🔢 ${expression} = ${result}`;
      } catch (error) {
        return `❌ 计算错误: ${error.message}`;
      }
    },
  });

  // 4. 用户档案管理
  const updateProfileTool = new DynamicStructuredTool({
    name: "update_profile",
    description: "更新用户档案信息",
    schema: z.object({
      name: z.string().optional().describe("用户名字"),
      preference: z.string().optional().describe("用户偏好（格式：key=value）"),
    }),
    func: async ({ name, preference }) => {
      if (name) {
        userProfile.name = name;
      }
      if (preference) {
        const [key, value] = preference.split("=");
        userProfile.preferences[key.trim()] = value.trim();
      }
      return `✅ 档案已更新`;
    },
  });

  const getProfileTool = new DynamicStructuredTool({
    name: "get_profile",
    description: "获取用户档案信息",
    schema: z.object({}),
    func: async () => {
      return `👤 用户档案:\n姓名: ${userProfile.name || "未设置"}\n偏好: ${JSON.stringify(userProfile.preferences, null, 2)}`;
    },
  });

  // 5. 总结工具
  const summarizeTool = new DynamicStructuredTool({
    name: "summarize_status",
    description: "总结当前状态（待办、提醒等）",
    schema: z.object({}),
    func: async () => {
      const pendingTodos = todoList.filter(t => !t.completed).length;
      const completedTodos = todoList.filter(t => t.completed).length;
      
      return `📊 状态总结:\n` +
             `- 待办事项: ${pendingTodos} 个待完成，${completedTodos} 个已完成\n` +
             `- 提醒: ${reminders.length} 个\n` +
             `- 用户: ${userProfile.name || "未设置"}`;
    },
  });

  // ===== 创建 Agent =====
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
    configuration: {
      baseURL: process.env.OPENAI_BASE_URL,
    },
  });

  const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
    inputKey: "input",
    outputKey: "output",
  });

  const agent = await initializeAgentExecutorWithOptions(
    [
      addTodoTool,
      listTodosTool,
      completeTodoTool,
      setReminderTool,
      listRemindersTool,
      calculatorTool,
      updateProfileTool,
      getProfileTool,
      summarizeTool,
    ],
    model,
    {
      agentType: "chat-conversational-react-description",
      memory: memory,
      verbose: true,
      maxIterations: 10,
    }
  );

  // ===== 交互演示 =====
  const interactions = [
    "我叫李明",
    "帮我添加一个高优先级的待办：完成项目报告",
    "再加一个中优先级的：买菜",
    "设置一个提醒，明天早上9点开会",
    "我有哪些待办事项？",
    "帮我计算 (100 + 50) * 2",
    "把'完成项目报告'标记为完成",
    "总结一下我的当前状态",
    "我叫什么名字？", // 测试记忆
  ];

  console.log("\n🎬 开始交互演示...\n");

  for (const input of interactions) {
    console.log(`\n👤 用户: ${input}\n`);
    try {
      const response = await agent.invoke({ input });
      console.log(`🤖 助手: ${response.output}`);
    } catch (error) {
      console.error(`❌ 错误: ${error.message}`);
    }
    console.log("-".repeat(50));
  }

  // ===== 显示最终状态 =====
  console.log("\n📊 最终数据状态:");
  console.log("\n待办事项:");
  todoList.forEach(todo => {
    console.log(`  ${todo.id}. [${todo.priority}] ${todo.task} ${todo.completed ? "✓" : "○"}`);
  });
  console.log("\n提醒:");
  reminders.forEach(reminder => {
    console.log(`  ${reminder.id}. ${reminder.content} (${reminder.time})`);
  });
  console.log("\n用户档案:");
  console.log(`  姓名: ${userProfile.name}`);
  console.log(`  偏好: ${JSON.stringify(userProfile.preferences)}`);

  console.log("\n" + "=".repeat(50));
  console.log("\n✅ 综合示例完成！");
}

// 运行示例
createSmartAssistant().catch(console.error);
