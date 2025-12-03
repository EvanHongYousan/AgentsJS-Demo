# 📚 示例代码详解

本项目包含 7 个完整的示例，从基础到高级，帮助你全面掌握 Agents.js。

---

## 📖 示例列表

| 示例 | 文件 | 命令 | 难度 | 学习时间 |
|------|------|------|------|----------|
| 1. 基础 Agent | `basic-agent.js` | `npm run demo:basic` | ⭐ | 5分钟 |
| 2. 带工具的 Agent | `agent-with-tools.js` | `npm run demo:tools` | ⭐⭐ | 10分钟 |
| 3. 带记忆的 Agent | `agent-with-memory.js` | `npm run demo:memory` | ⭐⭐ | 10分钟 |
| 4. 多 Agent 协作 | `multi-agent.js` | `npm run demo:multi` | ⭐⭐⭐ | 15分钟 |
| 5. 工作流 Agent | `workflow-agent.js` | `npm run demo:workflow` | ⭐⭐⭐ | 15分钟 |
| 6. 综合示例 | `advanced-example.js` | `npm run demo:advanced` | ⭐⭐⭐⭐ | 20分钟 |
| 7. 自定义模板 | `custom-agent-template.js` | `npm run demo:custom` | ⭐⭐ | 10分钟 |

---

## 示例 1: 基础 Agent

**文件**: `examples/basic-agent.js`

### 你将学到：
- ✅ 如何初始化 ChatOpenAI 模型
- ✅ 如何创建最简单的 Agent
- ✅ 如何调用 Agent 并获取响应

### 核心代码：
```javascript
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
});

const agent = await initializeAgentExecutorWithOptions(
  [], // 无工具
  model,
  { agentType: "chat-conversational-react-description" }
);

const response = await agent.invoke({ input: "你的问题" });
```

### 运行：
```bash
npm run demo:basic
```

### 预期输出：
Agent 会用自然语言回答你的问题。

---

## 示例 2: 带工具的 Agent

**文件**: `examples/agent-with-tools.js`

### 你将学到：
- ✅ 如何定义自定义工具
- ✅ 如何使用 zod 定义参数 schema
- ✅ Agent 如何自主选择和使用工具

### 包含的工具：
1. **计算器**: 执行数学运算
2. **天气查询**: 查询城市天气（模拟）
3. **时间工具**: 获取当前时间

### 核心代码：
```javascript
const calculatorTool = new DynamicStructuredTool({
  name: "calculator",
  description: "用于执行基本的数学计算",
  schema: z.object({
    expression: z.string().describe("数学表达式"),
  }),
  func: async ({ expression }) => {
    return eval(expression).toString();
  },
});

const agent = await initializeAgentExecutorWithOptions(
  [calculatorTool, weatherTool, timeTool], // 添加工具
  model,
  { agentType: "chat-conversational-react-description" }
);
```

### 运行：
```bash
npm run demo:tools
```

### 预期输出：
Agent 会根据问题自动选择合适的工具，例如遇到数学问题会使用计算器。

---

## 示例 3: 带记忆的 Agent

**文件**: `examples/agent-with-memory.js`

### 你将学到：
- ✅ 如何添加记忆功能
- ✅ 如何实现多轮对话
- ✅ Agent 如何记住上下文

### 核心代码：
```javascript
import { BufferMemory } from "langchain/memory";

const memory = new BufferMemory({
  memoryKey: "chat_history",
  returnMessages: true,
  inputKey: "input",
  outputKey: "output",
});

const agent = await initializeAgentExecutorWithOptions(
  tools,
  model,
  {
    agentType: "chat-conversational-react-description",
    memory: memory, // 添加记忆
  }
);
```

### 运行：
```bash
npm run demo:memory
```

### 预期输出：
Agent 会记住之前的对话，例如你告诉它你的名字后，它能在后续对话中记得。

---

## 示例 4: 多 Agent 协作

**文件**: `examples/multi-agent.js`

### 你将学到：
- ✅ 如何创建多个专门化的 Agent
- ✅ 如何设计 Agent 协作流程
- ✅ 如何在 Agent 之间传递信息

### Agent 角色：
1. **研究员**: 收集信息
2. **作家**: 撰写内容
3. **编辑**: 审核优化

### 工作流：
```
研究员收集信息 → 作家撰写文章 → 编辑审核修改
```

### 运行：
```bash
npm run demo:multi
```

### 预期输出：
三个 Agent 依次协作完成一篇文章的创作。

---

## 示例 5: 工作流 Agent

**文件**: `examples/workflow-agent.js`

### 你将学到：
- ✅ 如何处理复杂的业务流程
- ✅ 如何管理状态（库存、订单等）
- ✅ 多个工具的组合使用

### 场景：
完整的电商订单处理系统

### 工具列表：
1. `check_inventory`: 检查库存
2. `create_order`: 创建订单
3. `query_order`: 查询订单
4. `ship_order`: 发货

### 运行：
```bash
npm run demo:workflow
```

### 预期输出：
Agent 自动执行完整的订单流程：查库存 → 下订单 → 查订单 → 发货。

---

## 示例 6: 综合示例

**文件**: `examples/advanced-example.js`

### 你将学到：
- ✅ 如何构建一个完整的应用
- ✅ 工具、记忆、状态管理的综合运用
- ✅ 实际项目的代码组织方式

### 功能：
智能个人助手，包含：
- 📝 待办事项管理
- ⏰ 提醒功能
- 🔢 计算器
- 👤 用户档案
- 📊 状态总结

### 运行：
```bash
npm run demo:advanced
```

### 预期输出：
一个功能完整的智能助手，能处理多种任务并记住上下文。

---

## 示例 7: 自定义模板

**文件**: `examples/custom-agent-template.js`

### 你将学到：
- ✅ 创建自己的 Agent 的标准模板
- ✅ 各种常见工具的实现方式
- ✅ 最佳实践和代码组织

### 包含的工具类型：
1. **简单工具**（无参数）
2. **参数化工具**（带参数）
3. **异步工具**（模拟 API 调用）
4. **状态管理工具**（管理内部状态）

### 运行：
```bash
npm run demo:custom
```

### 如何使用：
1. 复制这个文件
2. 修改工具定义
3. 添加你自己的业务逻辑
4. 运行并测试

---

## 🎯 学习路径建议

### 第一天：基础入门
1. 运行 `demo:basic` - 理解基本概念
2. 运行 `demo:tools` - 学习工具系统
3. 阅读代码注释，理解每个部分

### 第二天：深入理解
4. 运行 `demo:memory` - 掌握记忆机制
5. 运行 `demo:multi` - 理解多 Agent 协作
6. 尝试修改工具定义

### 第三天：实践应用
7. 运行 `demo:workflow` - 学习复杂流程
8. 运行 `demo:advanced` - 看完整应用
9. 使用 `custom-agent-template.js` 创建自己的 Agent

---

## 💡 代码复用

### 复用工具
所有示例中的工具都可以直接复制到你的项目：

```javascript
// 从示例中复制工具定义
import { calculatorTool } from './examples/agent-with-tools.js';

// 在你的 Agent 中使用
const myAgent = await initializeAgentExecutorWithOptions(
  [calculatorTool, /* 你的其他工具 */],
  model,
  { /* 配置 */ }
);
```

### 复用 Agent 配置
参考 `custom-agent-template.js` 中的标准化配置。

---

## 🔍 调试技巧

所有示例都支持详细日志：

```javascript
const agent = await initializeAgentExecutorWithOptions(
  tools,
  model,
  {
    verbose: true, // 👈 查看 Agent 思考过程
  }
);
```

输出示例：
```
> Entering new AgentExecutor chain...
I need to use the calculator tool
Action: calculator
Action Input: {"expression": "2 + 2"}
Observation: 4
Thought: I now know the final answer
Final Answer: 2 + 2 = 4
```

---

## 📖 扩展阅读

- [README.md](./README.md) - 项目概述
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 问题排查
- [LangChain.js 官方文档](https://js.langchain.com/)

---

开始探索示例代码吧！每个示例都有详细的注释，边看边学效果最好。🚀
