# Agent 类型修复说明

## 📋 问题描述

在运行示例时遇到以下错误：
```
Received tool input did not match expected schema
```

**错误示例输出：**
```
ToolInputParsingException [Error]: Received tool input did not match expected schema
  output: '"明天下午3点开会"'
```

## 🔍 根本原因

`chat-conversational-react-description` 这个 Agent 类型在处理 DynamicStructuredTool 时存在兼容性问题：

1. **参数传递格式不一致** - Agent 有时传递字符串而不是对象
2. **Schema 验证过于严格** - 对参数格式要求与实际传递不匹配
3. **模型响应格式问题** - 某些模型的响应格式不完全匹配此 Agent 类型的期望

## ✅ 解决方案

将所有示例文件中的 Agent 类型更新为更稳定的类型。

### 修改对比

#### ❌ 修改前（问题代码）
```javascript
const agent = await initializeAgentExecutorWithOptions(
  [tools],
  model,
  {
    agentType: "chat-conversational-react-description",  // 容易出错
    verbose: true,
  }
);
```

#### ✅ 修改后（修复代码）

**1. 无工具场景（basic-agent.js）**
```javascript
const agent = await initializeAgentExecutorWithOptions(
  [],
  model,
  {
    agentType: "zero-shot-react-description",  // 简单稳定
    verbose: true,
  }
);
```

**2. 带工具场景（其他所有示例）**
```javascript
const agent = await initializeAgentExecutorWithOptions(
  [tools],
  model,
  {
    agentType: "structured-chat-zero-shot-react-description",  // 稳定兼容
    verbose: true,
  }
);
```

## 📝 受影响的文件

已修复的 7 个示例文件：

| 文件 | 原类型 | 新类型 | 说明 |
|------|--------|--------|------|
| `basic-agent.js` | chat-conversational | `zero-shot-react-description` | 无工具场景 |
| `agent-with-tools.js` | chat-conversational | `structured-chat-zero-shot-react-description` | 3个工具 |
| `agent-with-memory.js` | chat-conversational | `structured-chat-zero-shot-react-description` | 带记忆 |
| `multi-agent.js` | chat-conversational | `structured-chat-zero-shot-react-description` | 3个 Agent |
| `workflow-agent.js` | chat-conversational | `structured-chat-zero-shot-react-description` | 工作流 |
| `advanced-example.js` | chat-conversational | `structured-chat-zero-shot-react-description` | 综合示例 |
| `custom-agent-template.js` | chat-conversational | `structured-chat-zero-shot-react-description` | 模板 |

## 🎯 Agent 类型选择指南

| Agent 类型 | 适用场景 | 优点 | 缺点 | 推荐度 |
|-----------|---------|------|------|--------|
| `zero-shot-react-description` | 无工具或简单场景 | 简单直接、性能好 | 功能有限 | ⭐⭐⭐⭐⭐ |
| `structured-chat-zero-shot-react-description` | 带工具的复杂场景 | 稳定性好、兼容性强 | 稍慢 | ⭐⭐⭐⭐⭐ |
| `openai-functions` | OpenAI 模型专用 | 速度快、功能强大 | 仅限 OpenAI | ⭐⭐⭐⭐ |
| `chat-conversational-react-description` | ~~不推荐~~ | 支持对话历史 | **工具兼容性差** ⚠️ | ❌ |

## 💡 最佳实践

### 1️⃣ 选择合适的 Agent 类型

```javascript
// ✅ 推荐：无工具场景
const agent = await initializeAgentExecutorWithOptions(
  [],
  model,
  { agentType: "zero-shot-react-description" }
);

// ✅ 推荐：带工具场景（通用，兼容所有模型）
const agent = await initializeAgentExecutorWithOptions(
  [tool1, tool2],
  model,
  { agentType: "structured-chat-zero-shot-react-description" }
);

// ✅ 推荐：OpenAI 模型 + 工具（最佳性能）
const agent = await initializeAgentExecutorWithOptions(
  [tool1, tool2],
  openAIModel,
  { agentType: "openai-functions" }
);

// ❌ 不推荐：工具兼容性差
const agent = await initializeAgentExecutorWithOptions(
  [tool1, tool2],
  model,
  { agentType: "chat-conversational-react-description" }  // 容易报错
);
```

### 2️⃣ Schema 定义要精确

```javascript
// ✅ 正确：Schema 和 func 参数完全一致
const tool = new DynamicStructuredTool({
  name: "my_tool",
  description: "工具描述",
  schema: z.object({
    param1: z.string().describe("参数1"),
  }),
  func: async ({ param1 }) => {
    return `处理: ${param1}`;
  },
});

// ❌ 错误：Schema 有参数但 func 不接收
const tool = new DynamicStructuredTool({
  name: "my_tool",
  description: "工具描述",
  schema: z.object({
    param1: z.string().describe("参数1"),
  }),
  func: async () => {  // 缺少参数接收
    return "结果";
  },
});
```

### 3️⃣ 无参数工具使用空 Schema

```javascript
// ✅ 正确：无参数工具
const timeTool = new DynamicStructuredTool({
  name: "get_time",
  description: "获取当前时间，无需参数",
  schema: z.object({}),  // 空对象
  func: async () => {
    return new Date().toLocaleString();
  },
});

// ❌ 错误：定义了可选参数但不使用
const timeTool = new DynamicStructuredTool({
  name: "get_time",
  description: "获取当前时间",
  schema: z.object({
    timezone: z.string().optional(),  // 定义了但不用
  }),
  func: async () => {  // 没有接收 timezone
    return new Date().toLocaleString();
  },
});
```

## 🧪 测试验证

运行以下命令测试修复是否成功：

```bash
# 测试各个示例
npm run demo:basic       # 基础 Agent
npm run demo:tools       # 带工具的 Agent
npm run demo:memory      # 带记忆的 Agent
npm run demo:multi       # 多 Agent 协作
npm run demo:workflow    # 工作流 Agent
npm run demo:advanced    # 综合示例

# 验证工具定义
npm run validate

# 测试 API 连接
npm test
```

## 🔗 相关文档

- [COMMON_ERRORS.md](./COMMON_ERRORS.md) - 常见错误解决方案（包含详细的 Schema 错误说明）
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 完整故障排查指南
- [LangChain Agent Types 官方文档](https://js.langchain.com/docs/modules/agents/agent_types/)

## 📊 修复统计

- **修复文件数**: 7 个
- **受影响 Agent**: 9 个（multi-agent.js 有 3 个）
- **修复日期**: 2025-12-03
- **修复原因**: Schema 验证错误
- **解决方案**: 更换 Agent 类型

---

**重要提示**: 如果你在创建新的 Agent 时遇到类似错误，请优先使用 `structured-chat-zero-shot-react-description` 类型，而不是 `chat-conversational-react-description`。
