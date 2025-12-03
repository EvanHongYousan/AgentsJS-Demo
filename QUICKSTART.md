# 🚀 快速入门指南

## 5分钟上手 Agents.js

### 步骤 1: 安装依赖

```bash
npm install
```

### 步骤 2: 配置 API Key

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env`，填入你的 OpenAI API Key：

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
```

### 步骤 3: 运行第一个示例

```bash
npm run demo:basic
```

你会看到 Agent 回答问题的过程！

### 步骤 4: 探索更多示例

```bash
# 看 Agent 如何使用工具
npm run demo:tools

# 看 Agent 如何记住对话
npm run demo:memory

# 看多个 Agent 如何协作
npm run demo:multi

# 看 Agent 处理复杂工作流
npm run demo:workflow

# 运行综合示例
npm run demo:advanced
```

## 🎯 学习路径

### 初学者（第1天）
1. ✅ 运行 `demo:basic` - 理解 Agent 基本概念
2. ✅ 运行 `demo:tools` - 学习工具定义和使用
3. ✅ 阅读代码注释，理解每部分的作用

### 进阶（第2-3天）
4. ✅ 运行 `demo:memory` - 理解记忆机制
5. ✅ 运行 `demo:multi` - 学习多 Agent 协作
6. ✅ 修改示例代码，添加自己的工具

### 实践（第4-5天）
7. ✅ 运行 `demo:workflow` - 理解复杂业务流程
8. ✅ 运行 `demo:advanced` - 看完整应用示例
9. ✅ 创建自己的 Agent 应用

## 💡 核心概念速查

### Agent 是什么？
一个能理解自然语言、自主决策、调用工具完成任务的 AI 程序。

### 三大核心组件
1. **LLM (大语言模型)** - Agent 的大脑
2. **Tools (工具)** - Agent 可以调用的功能
3. **Memory (记忆)** - 保存对话历史

### 创建 Agent 的基本步骤

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

// 1. 创建模型
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
});

// 2. 定义工具（可选）
const tools = [/* 你的工具 */];

// 3. 创建 Agent
const agent = await initializeAgentExecutorWithOptions(
  tools,
  model,
  { agentType: "chat-conversational-react-description" }
);

// 4. 使用 Agent
const result = await agent.invoke({ 
  input: "你的问题" 
});
console.log(result.output);
```

## 🛠️ 自己创建工具

```javascript
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const myTool = new DynamicStructuredTool({
  name: "my_tool",
  description: "工具的功能描述",
  schema: z.object({
    param: z.string().describe("参数说明"),
  }),
  func: async ({ param }) => {
    // 你的逻辑
    return "结果";
  },
});
```

## 🔍 调试技巧

开启详细日志：
```javascript
const agent = await initializeAgentExecutorWithOptions(
  tools,
  model,
  { 
    agentType: "chat-conversational-react-description",
    verbose: true  // 👈 查看 Agent 思考过程
  }
);
```

## ❓ 遇到问题？

1. **API Key 错误**: 检查 `.env` 文件中的 `OPENAI_API_KEY`
2. **网络问题**: 检查 `OPENAI_BASE_URL` 配置
3. **依赖问题**: 删除 `node_modules` 重新 `npm install`

## 📚 下一步

- 阅读完整的 [README.md](./README.md)
- 查看 [LangChain.js 官方文档](https://js.langchain.com/)
- 尝试修改示例代码
- 创建自己的 Agent 应用

---

开始你的 Agent 之旅吧！🎉
