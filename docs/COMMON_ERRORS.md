# 🔍 常见错误解决方案

## 1. Schema 验证错误

### 错误信息
```
Received tool input did not match expected schema
```

### 原因分析

这个错误有 **两个常见原因**：

#### 原因 1：Schema 定义了参数，但 func 没有接收
```javascript
schema: z.object({
  param: z.string().optional(),  // 定义了参数
}),
func: async () => { ... }  // 但没有接收
```

#### 原因 2：Agent 类型与工具不兼容
某些 Agent 类型（如 `chat-conversational-react-description`）可能与某些工具的参数传递方式不兼容，导致即使 schema 和 func 匹配，也会出现此错误。

### 解决方案

#### ❌ 错误示例
```javascript
const tool = new DynamicStructuredTool({
  name: "my_tool",
  description: "示例工具",
  schema: z.object({
    param1: z.string().describe("参数1"),
    param2: z.number().optional().describe("可选参数"), // 定义了参数
  }),
  func: async ({ param1 }) => {  // 但没有接收 param2
    return `处理: ${param1}`;
  },
});
```

#### ✅ 正确示例 1：移除可选参数
```javascript
const tool = new DynamicStructuredTool({
  name: "my_tool",
  description: "示例工具",
  schema: z.object({
    param1: z.string().describe("参数1"),
    // 移除未使用的可选参数
  }),
  func: async ({ param1 }) => {
    return `处理: ${param1}`;
  },
});
```

#### ✅ 正确示例 2：接收所有参数
```javascript
const tool = new DynamicStructuredTool({
  name: "my_tool",
  description: "示例工具",
  schema: z.object({
    param1: z.string().describe("参数1"),
    param2: z.number().optional().describe("可选参数"),
  }),
  func: async ({ param1, param2 = 0 }) => {  // 接收并提供默认值
    return `处理: ${param1}, 参数2: ${param2}`;
  },
});
```

#### ✅ 正确示例 3：无参数工具
```javascript
const tool = new DynamicStructuredTool({
  name: "get_time",
  description: "获取当前时间，无需参数",
  schema: z.object({}),  // 空对象
  func: async () => {     // 无参数
    return new Date().toLocaleString();
  },
});
```

#### ✅ 正确示例 4：更换 Agent 类型
```javascript
// 如果使用 chat-conversational-react-description 出现问题
// 改用其他 Agent 类型
const agent = await initializeAgentExecutorWithOptions(
  tools,
  model,
  {
    agentType: "openai-functions",  // 或 "structured-chat-zero-shot-react-description"
    verbose: true,
  }
);
```

### 最佳实践

1. **Schema 和 func 参数保持一致**
   ```javascript
   // Schema 中定义的每个字段
   schema: z.object({
     field1: z.string(),
     field2: z.number(),
   }),
   // func 中都要接收
   func: async ({ field1, field2 }) => { ... }
   ```

2. **可选参数提供默认值**
   ```javascript
   schema: z.object({
     required: z.string(),
     optional: z.number().optional(),
   }),
   func: async ({ required, optional = 10 }) => { ... }
   ```

3. **无参数工具使用空 schema**
   ```javascript
   schema: z.object({}),
   func: async () => { ... }
   ```

4. **如果仍然出错，尝试更换 Agent 类型**
   - `openai-functions` - 推荐用于 OpenAI 模型
   - `structured-chat-zero-shot-react-description` - 通用性好
   - `zero-shot-react-description` - 简单场景

---

## 2. API Key 错误

### 错误信息
```
Error: Incorrect API key provided
Error: Could not find OpenAI credentials
```

### 解决方案

1. **检查 .env 文件**
   ```bash
   # 确认文件存在
   ls -la .env
   
   # 如果不存在，创建
   cp .env.example .env
   ```

2. **OpenRouter 配置**
   ```env
   AI_PROVIDER=openrouter
   OPENROUTER_API_KEY=sk-or-v1-your-actual-key
   # 注意：Key 应该以 sk-or-v1- 开头
   ```

3. **OpenAI 配置**
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-your-actual-key
   # 注意：Key 应该以 sk- 开头
   ```

4. **测试连接**
   ```bash
   npm test
   ```

---

## 3. 模型未找到错误

### 错误信息
```
Error: Model not found
```

### 解决方案

1. **查看可用模型**
   ```bash
   npm run models
   ```

2. **OpenRouter 模型名称格式**
   ```env
   # ✅ 正确
   OPENROUTER_MODEL=openai/gpt-3.5-turbo
   OPENROUTER_MODEL=anthropic/claude-3-haiku
   
   # ❌ 错误
   OPENROUTER_MODEL=gpt-3.5-turbo        # 缺少提供商前缀
   OPENROUTER_MODEL=openai/GPT-3.5-turbo # 大小写错误
   ```

3. **OpenAI 模型名称**
   ```env
   # ✅ 正确
   OPENAI_MODEL=gpt-3.5-turbo
   OPENAI_MODEL=gpt-4-turbo
   ```

---

## 4. Agent 不调用工具

### 原因
工具描述不够清晰，或与任务不匹配。

### 解决方案

1. **改进工具描述**
   ```javascript
   // ❌ 描述太简单
   description: "A calculator tool"
   
   // ✅ 描述清晰详细
   description: "用于执行数学计算。输入一个数学表达式（如 '2+2' 或 '10*5'），返回计算结果。支持加减乘除运算。"
   ```

2. **描述何时使用工具**
   ```javascript
   description: "当用户询问天气、温度或气象相关信息时使用此工具。输入城市名称，返回该城市的天气状况。"
   ```

3. **启用详细日志查看原因**
   ```javascript
   const agent = await initializeAgentExecutorWithOptions(
     tools,
     model,
     { verbose: true }  // 查看 Agent 的思考过程
   );
   ```

---

## 5. eval() 安全警告

### 问题
使用 `eval()` 可能有安全风险。

### 解决方案

使用更安全的计算方式：

```javascript
// ❌ 不安全
func: async ({ expression }) => {
  return eval(expression);
}

// ✅ 更安全
import { create, all } from 'mathjs';
const math = create(all);

func: async ({ expression }) => {
  try {
    const result = math.evaluate(expression);
    return `结果: ${result}`;
  } catch (error) {
    return `错误: ${error.message}`;
  }
}

// ✅ 或清理输入
func: async ({ expression }) => {
  // 只允许数字和基本运算符
  const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
  try {
    const result = eval(sanitized);
    return `结果: ${result}`;
  } catch (error) {
    return `错误: ${error.message}`;
  }
}
```

---

## 6. Memory 记忆不工作

### 原因
Memory 配置的 key 与 Agent 使用的 key 不匹配。

### 解决方案

```javascript
// 确保 inputKey 和 outputKey 匹配
const memory = new BufferMemory({
  memoryKey: "chat_history",
  returnMessages: true,
  inputKey: "input",   // 必须与 agent.invoke({ input: ... }) 匹配
  outputKey: "output", // 必须与 Agent 返回的字段匹配
});
```

---

## 7. 请求超时

### 错误信息
```
Error: timeout of 60000ms exceeded
```

### 解决方案

1. **增加超时时间**
   ```javascript
   const model = getModel({ 
     temperature: 0.7,
     timeout: 120000  // 120秒
   });
   ```

2. **使用更快的模型**
   ```env
   # OpenRouter
   OPENROUTER_MODEL=anthropic/claude-3-haiku  # 很快
   OPENROUTER_MODEL=openai/gpt-3.5-turbo      # 快速
   ```

3. **减少 maxIterations**
   ```javascript
   const agent = await initializeAgentExecutorWithOptions(
     tools,
     model,
     { maxIterations: 5 }  // 从 10 减少到 5
   );
   ```

---

## 8. 余额不足

### 错误信息
```
Error: Insufficient credits
Error: You exceeded your current quota
```

### 解决方案

#### OpenRouter
1. 访问 https://openrouter.ai/credits 充值
2. 使用免费模型：
   ```env
   OPENROUTER_MODEL=google/gemini-pro
   ```

#### OpenAI
1. 访问 https://platform.openai.com/account/billing 充值
2. 检查使用限额

---

## 9. 导入错误

### 错误信息
```
Error: Cannot find module '@langchain/openai'
SyntaxError: Cannot use import statement outside a module
```

### 解决方案

1. **重新安装依赖**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **确认 package.json 配置**
   ```json
   {
     "type": "module"  // 必须有这一行
   }
   ```

---

## 10. 网络连接错误

### 错误信息
```
Error: connect ETIMEDOUT
Error: getaddrinfo ENOTFOUND
```

### 解决方案

1. **检查网络**
   ```bash
   curl -I https://openrouter.ai
   curl -I https://api.openai.com
   ```

2. **使用代理（如果需要）**
   ```env
   # 在 .env 中设置代理
   HTTP_PROXY=http://your-proxy:port
   HTTPS_PROXY=http://your-proxy:port
   ```

3. **测试连接**
   ```bash
   npm test
   ```

---

## 🆘 快速诊断流程

遇到错误时，按顺序检查：

1. ✅ **运行测试**
   ```bash
   npm test
   ```

2. ✅ **检查配置**
   ```bash
   npm run models
   ```

3. ✅ **查看详细日志**
   ```javascript
   { verbose: true }  // 在 Agent 配置中启用
   ```

4. ✅ **查看文档**
   - Schema 错误：本文档第 1 节
   - API 错误：TROUBLESHOOTING.md
   - OpenRouter：OPENROUTER_GUIDE.md

---

## 📚 相关文档

- [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) - 完整故障排查指南
- [OPENROUTER_GUIDE.md](../OPENROUTER_GUIDE.md) - OpenRouter 使用指南
- [EXAMPLES.md](../EXAMPLES.md) - 示例代码详解

---

需要更多帮助？检查示例代码中的工具定义，它们都是经过验证的正确示例。
