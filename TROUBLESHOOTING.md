# 🔧 故障排查指南

## 常见问题和解决方案

### 0. OpenRouter 相关问题 🌟

#### 问题: `Error: Incorrect API key provided` (OpenRouter)

**原因**: OpenRouter API Key 配置错误或未设置

**解决方案**:
```bash
# 1. 确认 .env 文件配置
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here

# 2. 确认 API Key 格式
# OpenRouter 的 Key 应该以 sk-or-v1- 开头
# 获取 Key: https://openrouter.ai/keys
```

#### 问题: `Error: Model not found` (OpenRouter)

**原因**: 模型名称不正确

**解决方案**:
```bash
# 1. 运行命令查看可用模型
npm run models

# 2. 常用模型名称（注意区分大小写）
OPENROUTER_MODEL=openai/gpt-3.5-turbo      # ✅ 正确
OPENROUTER_MODEL=gpt-3.5-turbo             # ❌ 错误
OPENROUTER_MODEL=openai/GPT-3.5-turbo      # ❌ 错误

# 3. 查看完整模型列表
# https://openrouter.ai/models
```

#### 问题: `Error: Insufficient credits` (OpenRouter)

**原因**: OpenRouter 账户余额不足

**解决方案**:
1. 访问 https://openrouter.ai/credits 充值
2. 使用免费模型（如 `google/gemini-pro`）
3. 新用户通常有免费额度

#### 问题: OpenRouter 请求太慢

**解决方案**:
```env
# 切换到更快的模型
OPENROUTER_MODEL=anthropic/claude-3-haiku    # 很快
OPENROUTER_MODEL=openai/gpt-3.5-turbo        # 快速
OPENROUTER_MODEL=google/gemini-pro           # 中等
```

---

### 1. API Key 相关问题

#### 问题: `Error: Incorrect API key provided`

**原因**: API Key 配置错误或未设置

**解决方案**:
```bash
# 1. 检查 .env 文件是否存在
ls -la .env

# 2. 如果不存在，从示例创建
cp .env.example .env

# 3. 编辑 .env，填入正确的 API Key
# OPENAI_API_KEY=sk-your-actual-key-here
```

#### 问题: `Error: Could not find OpenAI credentials`

**原因**: 环境变量未正确加载

**解决方案**:
```javascript
// 确保在文件顶部导入 dotenv
import dotenv from "dotenv";
dotenv.config(); // 必须在使用环境变量之前调用
```

---

### 2. 网络和连接问题

#### 问题: `Error: connect ETIMEDOUT` 或 `Error: getaddrinfo ENOTFOUND`

**原因**: 网络连接问题或代理设置

**解决方案**:

1. **检查网络连接**:
```bash
# 测试是否能访问 OpenAI
curl -I https://api.openai.com/v1/models
```

2. **使用代理**（如果在国内）:
```env
# .env 文件
OPENAI_BASE_URL=https://your-proxy.com/v1
```

3. **设置超时时间**:
```javascript
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  timeout: 60000, // 60秒超时
  // ...
});
```

---

### 3. Agent 行为问题

#### 问题: Agent 不使用我的工具

**原因**: 工具描述不够清晰

**解决方案**:
```javascript
// ❌ 不好的描述
const tool = new DynamicStructuredTool({
  name: "tool1",
  description: "A tool",  // 太模糊
  // ...
});

// ✅ 好的描述
const tool = new DynamicStructuredTool({
  name: "calculator",
  description: "用于执行数学计算，支持加减乘除运算。输入数学表达式，返回计算结果。",
  // ...
});
```

#### 问题: Agent 返回 "I don't have a tool for that"

**原因**: 
1. 工具描述与任务不匹配
2. 任务超出工具能力范围

**解决方案**:
```javascript
// 1. 改进工具描述，明确说明能做什么
description: "专门用于查询天气信息。输入城市名称，返回该城市的当前天气状况。"

// 2. 添加更多相关工具
const tools = [
  weatherTool,
  timeTool,
  locationTool, // 相关工具
];
```

#### 问题: Agent 重复调用同一个工具

**原因**: 工具返回的信息不够明确

**解决方案**:
```javascript
// ❌ 不好的返回值
func: async () => {
  return "Done"; // 太简单
}

// ✅ 好的返回值
func: async ({ city }) => {
  return `成功获取 ${city} 的天气信息：晴天，温度 20-25°C。查询完成。`;
}
```

---

### 4. 依赖和安装问题

#### 问题: `Cannot find module '@langchain/openai'`

**解决方案**:
```bash
# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 如果还是不行，尝试清除 npm 缓存
npm cache clean --force
npm install
```

#### 问题: `Error: Cannot find module 'zod'`

**解决方案**:
```bash
# 手动安装缺失的依赖
npm install zod

# 或者安装所有依赖
npm install
```

---

### 5. 内存和记忆问题

#### 问题: Agent 不记得之前的对话

**原因**: 未配置记忆或记忆配置错误

**解决方案**:
```javascript
import { BufferMemory } from "langchain/memory";

// 创建记忆
const memory = new BufferMemory({
  memoryKey: "chat_history",
  returnMessages: true,
  inputKey: "input",    // 必须匹配
  outputKey: "output",  // 必须匹配
});

// 添加到 Agent
const agent = await initializeAgentExecutorWithOptions(
  tools,
  model,
  {
    agentType: "chat-conversational-react-description",
    memory: memory, // 👈 不要忘记
  }
);
```

#### 问题: 对话太长导致超时或费用过高

**解决方案**:
```javascript
// 使用窗口记忆，只保留最近 N 条消息
import { BufferWindowMemory } from "langchain/memory";

const memory = new BufferWindowMemory({
  k: 5, // 只保留最近 5 条消息
  memoryKey: "chat_history",
  returnMessages: true,
});
```

---

### 6. 性能和成本问题

#### 问题: Agent 响应太慢

**解决方案**:

1. **减少 maxIterations**:
```javascript
const agent = await initializeAgentExecutorWithOptions(
  tools,
  model,
  {
    maxIterations: 5, // 从 10 减少到 5
  }
);
```

2. **使用更快的模型**:
```javascript
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo", // 比 gpt-4 快且便宜
});
```

3. **优化工具响应速度**:
```javascript
func: async ({ query }) => {
  // 添加超时控制
  const timeout = 5000;
  const result = await Promise.race([
    yourSlowFunction(query),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
  return result;
}
```

#### 问题: API 费用过高

**解决方案**:

1. **降低 temperature**（减少随机性）:
```javascript
const model = new ChatOpenAI({
  temperature: 0, // 更确定性，可能需要更少 token
});
```

2. **限制 token 使用**:
```javascript
const model = new ChatOpenAI({
  maxTokens: 500, // 限制最大 token
});
```

3. **使用更便宜的模型**:
```javascript
modelName: "gpt-3.5-turbo" // 而不是 "gpt-4"
```

---

### 7. 调试技巧

#### 开启详细日志

```javascript
const agent = await initializeAgentExecutorWithOptions(
  tools,
  model,
  {
    verbose: true, // 👈 查看 Agent 的思考过程
  }
);
```

#### 打印中间结果

```javascript
func: async ({ input }) => {
  console.log("工具被调用，输入:", input);
  const result = await processInput(input);
  console.log("工具返回:", result);
  return result;
}
```

#### 捕获和记录错误

```javascript
try {
  const response = await agent.invoke({ input: userQuery });
  console.log("成功:", response.output);
} catch (error) {
  console.error("错误类型:", error.name);
  console.error("错误消息:", error.message);
  console.error("错误堆栈:", error.stack);
}
```

---

### 8. 类型错误

#### 问题: `TypeError: Cannot read property 'xxx' of undefined`

**原因**: 参数解构错误或数据结构不匹配

**解决方案**:
```javascript
// ❌ 可能出错
func: async ({ param }) => {
  return param.value; // 如果 param 为 undefined 会出错
}

// ✅ 安全的方式
func: async ({ param }) => {
  if (!param) {
    return "参数缺失";
  }
  return param.value || "默认值";
}
```

---

### 9. 获取帮助

如果以上方法都不能解决你的问题：

1. **检查官方文档**: https://js.langchain.com/
2. **查看 GitHub Issues**: https://github.com/langchain-ai/langchainjs/issues
3. **检查代码示例**: 项目的 `examples/` 目录
4. **简化问题**: 创建最小可复现示例

---

### 10. 调试检查清单

遇到问题时，按顺序检查：

- [ ] `.env` 文件是否存在且配置正确
- [ ] `npm install` 是否成功完成
- [ ] 网络是否正常（能否访问 OpenAI API）
- [ ] 工具描述是否清晰明确
- [ ] 参数 schema 是否正确定义
- [ ] verbose: true 查看详细日志
- [ ] 控制台是否有报错信息
- [ ] 使用简单示例测试（如 `demo:basic`）

---

需要更多帮助？查看项目的 [README.md](./README.md) 和示例代码！
