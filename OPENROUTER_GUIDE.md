# 🌐 OpenRouter 使用指南

## 什么是 OpenRouter？

OpenRouter 是一个统一的 LLM API 网关，让你可以通过一个接口访问多种大语言模型，包括：
- OpenAI (GPT-3.5, GPT-4)
- Anthropic (Claude)
- Google (Gemini)
- Meta (Llama)
- 以及更多开源和商业模型

**优势：**
- ✅ 一个 API Key 访问所有模型
- ✅ 自动选择最便宜的可用模型
- ✅ 免费试用额度
- ✅ 灵活的定价
- ✅ 无需多个账号

---

## 🚀 快速开始

### 1. 获取 OpenRouter API Key

1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册账号（可以用 Google/GitHub 登录）
3. 前往 [API Keys 页面](https://openrouter.ai/keys) 创建 API Key
4. 复制你的 API Key（格式类似 `sk-or-v1-...`）

### 2. 配置环境变量

编辑项目中的 `.env` 文件：

```env
# 设置使用 OpenRouter
AI_PROVIDER=openrouter

# OpenRouter API Key
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here

# 选择模型（可选，默认 openai/gpt-3.5-turbo）
OPENROUTER_MODEL=openai/gpt-3.5-turbo

# 可选配置
OPENROUTER_APP_NAME=AgentsJS-Demo
OPENROUTER_SITE_URL=https://github.com/yourusername/agents-js-demo
```

### 3. 运行示例

```bash
# 所有示例会自动使用 OpenRouter
npm run demo:basic
npm run demo:tools
# ... 其他示例
```

---

## 📋 推荐模型列表

### 💰 按价格分类

#### 免费/低成本模型
```env
OPENROUTER_MODEL=google/gemini-pro              # Google Gemini - 有免费额度
OPENROUTER_MODEL=meta-llama/llama-3-8b-instruct # Llama 3 8B - 开源便宜
OPENROUTER_MODEL=openai/gpt-3.5-turbo           # GPT-3.5 - 便宜快速
```

#### 中等价格模型
```env
OPENROUTER_MODEL=anthropic/claude-3-haiku       # Claude Haiku - 快速响应
OPENROUTER_MODEL=anthropic/claude-3-sonnet      # Claude Sonnet - 平衡性能
OPENROUTER_MODEL=openai/gpt-4-turbo             # GPT-4 Turbo - 更快的 GPT-4
```

#### 高端模型
```env
OPENROUTER_MODEL=openai/gpt-4                   # GPT-4 - 顶级性能
OPENROUTER_MODEL=anthropic/claude-3-opus        # Claude Opus - 最强 Claude
OPENROUTER_MODEL=meta-llama/llama-3-70b-instruct # Llama 3 70B - 大型开源
```

### 🎯 按用途分类

#### 日常对话和简单任务
```env
OPENROUTER_MODEL=openai/gpt-3.5-turbo
OPENROUTER_MODEL=google/gemini-pro
OPENROUTER_MODEL=anthropic/claude-3-haiku
```

#### 代码生成和技术任务
```env
OPENROUTER_MODEL=openai/gpt-4-turbo
OPENROUTER_MODEL=anthropic/claude-3-sonnet
OPENROUTER_MODEL=meta-llama/llama-3-70b-instruct
```

#### 复杂推理和分析
```env
OPENROUTER_MODEL=openai/gpt-4
OPENROUTER_MODEL=anthropic/claude-3-opus
```

---

## 💡 使用技巧

### 在代码中切换模型

```javascript
import { getModel } from "../config/model-config.js";

// 使用默认模型（.env 中配置的）
const model1 = getModel({ temperature: 0.7 });

// 临时使用其他模型
const model2 = getModel({ 
  temperature: 0.7,
  modelName: "anthropic/claude-3-haiku" // 覆盖环境变量
});
```

### 查看可用模型

```javascript
import { listOpenRouterModels } from "../config/model-config.js";

listOpenRouterModels(); // 显示常用模型列表
```

### 查看当前配置

```javascript
import { showModelConfig } from "../config/model-config.js";

showModelConfig(); // 显示当前使用的模型和配置
```

---

## 🔄 在 OpenAI 和 OpenRouter 之间切换

### 使用 OpenRouter（推荐）

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-your-key
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

### 使用 OpenAI

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-3.5-turbo
```

**无需修改代码**，只需改变 `.env` 中的 `AI_PROVIDER` 即可！

---

## 📊 模型对比

| 模型 | 提供商 | 速度 | 成本 | 适合场景 |
|------|--------|------|------|----------|
| google/gemini-pro | Google | ⚡⚡⚡ | 💰 FREE | 测试、学习 |
| openai/gpt-3.5-turbo | OpenAI | ⚡⚡⚡ | 💰 | 日常对话 |
| anthropic/claude-3-haiku | Anthropic | ⚡⚡⚡ | 💰 | 快速响应 |
| meta-llama/llama-3-8b | Meta | ⚡⚡ | 💰 | 开源方案 |
| openai/gpt-4-turbo | OpenAI | ⚡⚡ | 💰💰 | 代码生成 |
| anthropic/claude-3-sonnet | Anthropic | ⚡⚡ | 💰💰 | 综合任务 |
| openai/gpt-4 | OpenAI | ⚡ | 💰💰💰 | 复杂推理 |
| anthropic/claude-3-opus | Anthropic | ⚡ | 💰💰💰 | 最强性能 |

---

## 🎁 免费额度

OpenRouter 为新用户提供免费试用额度：

1. **免费模型**: `google/gemini-pro` 等模型有免费额度
2. **新用户奖励**: 注册后会获得一些免费额度
3. **最低充值**: 只需 $5 即可开始使用所有模型

---

## 💸 成本控制

### 1. 选择合适的模型

```javascript
// 开发测试时使用便宜模型
const devModel = getModel({ 
  modelName: "google/gemini-pro" 
});

// 生产环境使用高质量模型
const prodModel = getModel({ 
  modelName: "openai/gpt-4-turbo" 
});
```

### 2. 限制 Token 使用

```javascript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  modelName: "openai/gpt-3.5-turbo",
  maxTokens: 500, // 限制响应长度
  // ... 其他配置
});
```

### 3. 监控使用情况

访问 [OpenRouter Dashboard](https://openrouter.ai/activity) 查看：
- 每个模型的使用量
- 总花费
- 请求历史

---

## 🔍 调试 OpenRouter

### 查看请求详情

OpenRouter 会在响应中返回有用的信息：

```javascript
const response = await agent.invoke({ input: "你好" });
console.log(response);
// 查看使用的模型、Token 消耗等
```

### 常见问题

#### 1. "Invalid API Key"
- 检查 API Key 是否正确复制（应该以 `sk-or-v1-` 开头）
- 确认 `.env` 文件中没有多余的空格

#### 2. "Model not found"
- 确认模型名称正确（区分大小写）
- 访问 [OpenRouter Models](https://openrouter.ai/models) 查看可用模型

#### 3. "Insufficient credits"
- 检查账户余额
- 使用免费模型如 `google/gemini-pro`

#### 4. 请求太慢
- 某些模型可能有延迟
- 尝试切换到更快的模型（如 haiku、gpt-3.5-turbo）

---

## 🌟 高级功能

### 1. 自动回退机制

```javascript
// 在 model-config.js 中可以扩展
// 当主模型不可用时自动使用备用模型
const primaryModel = "openai/gpt-4";
const fallbackModel = "openai/gpt-3.5-turbo";
```

### 2. 多模型对比

```javascript
const models = [
  "openai/gpt-3.5-turbo",
  "anthropic/claude-3-haiku",
  "google/gemini-pro"
];

for (const modelName of models) {
  const model = getModel({ modelName });
  const agent = await initializeAgentExecutorWithOptions(
    tools, model, { agentType: "chat-conversational-react-description" }
  );
  const result = await agent.invoke({ input: "测试问题" });
  console.log(`${modelName}: ${result.output}`);
}
```

### 3. 成本估算

访问 [OpenRouter Pricing](https://openrouter.ai/models) 查看每个模型的定价，提前估算成本。

---

## 📖 更多资源

- [OpenRouter 官网](https://openrouter.ai/)
- [模型列表](https://openrouter.ai/models)
- [定价信息](https://openrouter.ai/docs#models)
- [API 文档](https://openrouter.ai/docs)
- [使用统计](https://openrouter.ai/activity)

---

## ✅ 推荐配置

### 学习开发（最省钱）

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your-key
OPENROUTER_MODEL=google/gemini-pro  # 免费额度
```

### 日常使用（平衡）

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your-key
OPENROUTER_MODEL=openai/gpt-3.5-turbo  # 便宜快速
```

### 生产环境（高质量）

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your-key
OPENROUTER_MODEL=openai/gpt-4-turbo  # 性能好速度快
```

---

开始使用 OpenRouter，享受多模型的便利！🚀
