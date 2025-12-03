# 更新日志

## v2.0.0 - OpenRouter 支持 (当前版本)

### ✨ 新功能

#### 🌟 OpenRouter 集成
- 添加 OpenRouter 支持，一个 API Key 访问多种 LLM 模型
- 支持 OpenAI、Anthropic Claude、Google Gemini、Meta Llama 等多种模型
- 提供免费试用额度

#### 🔧 统一配置系统
- 新增 `config/model-config.js` - 统一的模型配置管理
- 自动根据环境变量选择 OpenAI 或 OpenRouter
- 支持在代码中灵活切换模型

#### 📚 新增文档
- `OPENROUTER_GUIDE.md` - OpenRouter 详细使用指南
- 模型推荐列表和对比
- 成本控制建议

#### 🛠️ 新增工具
- `npm run models` - 查看当前配置和可用模型
- `showModelConfig()` - 显示当前模型配置
- `listOpenRouterModels()` - 列出 OpenRouter 常用模型

### 🔄 改进

#### 所有示例更新
- ✅ `basic-agent.js` - 使用新的配置系统
- ✅ `agent-with-tools.js` - 使用新的配置系统
- ✅ `agent-with-memory.js` - 使用新的配置系统
- ✅ `multi-agent.js` - 使用新的配置系统
- ✅ `workflow-agent.js` - 使用新的配置系统
- ✅ `advanced-example.js` - 使用新的配置系统
- ✅ `custom-agent-template.js` - 使用新的配置系统

#### 环境变量配置
- 更新 `.env.example` 包含 OpenRouter 配置
- 添加 `AI_PROVIDER` 选择器（openai/openrouter）
- 支持多模型配置

#### 文档更新
- 更新 `README.md` 添加 OpenRouter 信息
- 更新 `QUICKSTART.md` 添加快速配置指南
- 更新 `TROUBLESHOOTING.md` 添加 OpenRouter 问题解决
- 更新 `index.js` 显示 OpenRouter 选项

### 💡 使用方式

#### 使用 OpenRouter（推荐）
```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-your-key
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

#### 使用 OpenAI
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-3.5-turbo
```

#### 在代码中使用
```javascript
import { getModel } from "../config/model-config.js";

// 使用环境变量中的配置
const model = getModel({ temperature: 0.7 });

// 临时使用其他模型
const model2 = getModel({ 
  temperature: 0.7,
  modelName: "anthropic/claude-3-haiku"
});
```

### 🎯 优势

1. **多模型支持** - 一个项目可以使用多种 LLM
2. **灵活切换** - 只需修改环境变量，无需改代码
3. **成本优化** - 根据需求选择合适价格的模型
4. **免费试用** - OpenRouter 提供免费额度
5. **向后兼容** - 仍然支持直接使用 OpenAI

---

## v1.0.0 - 初始版本

### 特性

- 7 个完整的 Agents.js 示例
- 从基础到高级的学习路径
- 详细的文档和注释
- 支持 OpenAI GPT 模型
- 工具定义和使用示例
- 多 Agent 协作示例
- 记忆和状态管理示例

### 文档

- README.md - 项目概述
- QUICKSTART.md - 快速入门
- EXAMPLES.md - 示例详解
- TROUBLESHOOTING.md - 问题排查
- PROJECT_SUMMARY.md - 项目总结

---

## 升级指南

### 从 v1.0.0 升级到 v2.0.0

1. **更新环境变量**

创建新的 `.env` 文件：
```bash
cp .env.example .env
```

选择使用 OpenRouter 或 OpenAI：
```env
# OpenRouter
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your-key

# 或 OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=your-key
```

2. **代码无需修改**

所有示例已自动更新，直接运行即可：
```bash
npm run demo:basic
```

3. **探索新功能**

```bash
# 查看可用模型
npm run models

# 在 .env 中切换模型
OPENROUTER_MODEL=anthropic/claude-3-haiku
```

---

## 路线图

### v2.1.0 (计划中)
- [ ] 支持流式输出
- [ ] 添加更多模型提供商（Azure OpenAI、AWS Bedrock）
- [ ] 模型性能对比工具
- [ ] 成本追踪功能

### v2.2.0 (计划中)
- [ ] 添加向量数据库示例
- [ ] RAG (检索增强生成) 示例
- [ ] Function Calling 高级示例
- [ ] Agent 编排和工作流示例

---

欢迎提出建议和反馈！🎉
