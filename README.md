# Agents.js 学习示例项目

这个项目包含了 5 个循序渐进的示例，帮助你快速掌握 Agents.js（基于 LangChain.js）的使用。

## 📚 项目结构

```
agents.js-demo/
├── examples/              # 示例代码
│   ├── basic-agent.js           # 示例1: 基础 Agent
│   ├── agent-with-tools.js      # 示例2: 带工具的 Agent
│   ├── agent-with-memory.js     # 示例3: 带记忆的 Agent
│   ├── multi-agent.js           # 示例4: 多 Agent 协作
│   └── workflow-agent.js        # 示例5: 工作流 Agent
├── package.json
├── .env.example
└── README.md
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置 API Key：

```bash
cp .env.example .env
```

#### 方式一：使用 OpenRouter（推荐）

OpenRouter 可以访问多种 LLM 模型，包括 GPT、Claude、Gemini 等。

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

**获取 OpenRouter API Key**: https://openrouter.ai/keys

#### 方式二：使用 OpenAI

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
```

**获取 OpenAI API Key**: https://platform.openai.com/api-keys

> 💡 **推荐使用 OpenRouter**：一个 API Key 即可访问多种模型，还有免费额度！详见 [OpenRouter 使用指南](./docs/OPENROUTER_GUIDE.md)

### 3. 运行示例

```bash
# 示例1: 基础 Agent
npm run demo:basic

# 示例2: 带工具的 Agent
npm run demo:tools

# 示例3: 带记忆的 Agent
npm run demo:memory

# 示例4: 多 Agent 协作
npm run demo:multi

# 示例5: 工作流 Agent
npm run demo:workflow
```

## 📖 示例说明

### 示例 1: 基础 Agent (`basic-agent.js`)

**学习目标:**
- 如何初始化语言模型
- 如何创建最简单的 Agent
- 如何与 Agent 交互

**核心概念:**
- `ChatOpenAI`: OpenAI 模型封装
- `initializeAgentExecutorWithOptions`: 创建 Agent 执行器
- `agent.invoke()`: 调用 Agent

### 示例 2: 带工具的 Agent (`agent-with-tools.js`)

**学习目标:**
- 如何定义自定义工具
- 如何将工具赋予 Agent
- Agent 如何自主选择和使用工具

**核心概念:**
- `DynamicStructuredTool`: 动态结构化工具
- `zod`: 参数模式验证
- 工具的 `name`, `description`, `schema`, `func`

**示例工具:**
- 计算器工具
- 天气查询工具
- 时间工具

### 示例 3: 带记忆的 Agent (`agent-with-memory.js`)

**学习目标:**
- 如何让 Agent 记住对话历史
- 如何实现多轮对话
- 记忆在 Agent 中的应用

**核心概念:**
- `BufferMemory`: 缓冲记忆
- `memoryKey`: 记忆键
- 对话上下文保持

### 示例 4: 多 Agent 协作 (`multi-agent.js`)

**学习目标:**
- 如何创建多个专门化的 Agent
- Agent 之间如何传递信息
- 如何设计 Agent 协作流程

**场景:**
研究员 → 作家 → 编辑 的协作流程

### 示例 5: 工作流 Agent (`workflow-agent.js`)

**学习目标:**
- 如何使用 Agent 执行复杂业务流程
- 多个工具的组合使用
- 状态管理

**场景:**
完整的电商订单处理流程（库存查询 → 创建订单 → 查询订单 → 发货）

## 🎯 核心概念

### 什么是 Agent？

Agent 是一个能够：
1. **理解任务**: 理解用户的自然语言指令
2. **制定计划**: 决定如何完成任务
3. **使用工具**: 调用各种工具来执行具体操作
4. **返回结果**: 将执行结果返回给用户

### Agent 的核心组件

1. **LLM (大语言模型)**: Agent 的"大脑"，负责理解和决策
2. **Tools (工具)**: Agent 可以调用的功能，如搜索、计算、API 调用等
3. **Memory (记忆)**: 保存对话历史和上下文
4. **Agent Executor (执行器)**: 协调 LLM、工具和记忆的运行逻辑

### 工作原理

```
用户输入 → Agent 分析 → 选择工具 → 执行工具 → 处理结果 → 返回输出
            ↑                                           ↓
            └─────────── 记忆 (可选) ──────────────────┘
```

## 🛠️ 自定义工具开发

创建自定义工具的模板：

```javascript
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const myTool = new DynamicStructuredTool({
  name: "tool_name",
  description: "工具功能描述，Agent 会根据这个描述决定何时使用",
  schema: z.object({
    param1: z.string().describe("参数1的描述"),
    param2: z.number().describe("参数2的描述"),
  }),
  func: async ({ param1, param2 }) => {
    // 工具的实际逻辑
    const result = await doSomething(param1, param2);
    return result;
  },
});
```

## 💡 最佳实践

1. **工具描述要清晰**: Agent 根据描述选择工具，描述越清晰，选择越准确
2. **参数验证**: 使用 `zod` 定义严格的参数模式
3. **错误处理**: 在工具的 `func` 中做好错误处理
4. **记忆管理**: 长对话时注意记忆的大小和成本
5. **温度设置**: 
   - 需要精确执行时使用低温度 (0-0.3)
   - 需要创造性时使用高温度 (0.7-1.0)

## 🔍 调试技巧

1. 启用 `verbose: true` 查看 Agent 的思考过程
2. 打印中间结果来追踪工具调用
3. 使用简单的工具先测试 Agent 逻辑
4. 逐步增加复杂度

## 📚 进阶学习

- [LangChain.js 官方文档](https://js.langchain.com/)
- [Agent 类型详解](https://js.langchain.com/docs/modules/agents/)
- [工具开发指南](https://js.langchain.com/docs/modules/tools/)
- [记忆系统](https://js.langchain.com/docs/modules/memory/)

## ❓ 常见问题

**Q: 为什么 Agent 没有调用我的工具？**
A: 检查工具的 `description` 是否清晰，Agent 需要通过描述理解工具的用途。

**Q: 如何控制 Agent 的成本？**
A: 使用 `maxIterations` 限制迭代次数，选择合适的模型（如 gpt-3.5-turbo）。

**Q: Agent 可以并行调用多个工具吗？**
A: 默认是顺序调用，需要并行需要自己实现协调逻辑。

**Q: 如何处理敏感信息？**
A: 不要在工具描述或示例中包含敏感信息，使用环境变量管理密钥。

## 📝 License

MIT

---

Happy Learning! 🎉
