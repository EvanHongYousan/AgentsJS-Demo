#!/usr/bin/env node

/**
 * Agents.js Demo - 主入口文件
 * 运行这个文件可以看到所有可用的示例
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🤖 欢迎使用 Agents.js 学习项目！                  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

📚 这个项目包含 7 个完整的示例，帮助你快速掌握 Agents.js

═══════════════════════════════════════════════════════════════

📖 可用示例：

  1️⃣  基础 Agent
     命令: npm run demo:basic
     学习: Agent 基本概念和使用方法
     难度: ⭐
     
  2️⃣  带工具的 Agent  
     命令: npm run demo:tools
     学习: 如何定义和使用自定义工具
     难度: ⭐⭐
     
  3️⃣  带记忆的 Agent
     命令: npm run demo:memory
     学习: 如何让 Agent 记住对话历史
     难度: ⭐⭐
     
  4️⃣  多 Agent 协作
     命令: npm run demo:multi
     学习: 多个 Agent 如何协作完成任务
     难度: ⭐⭐⭐
     
  5️⃣  工作流 Agent
     命令: npm run demo:workflow
     学习: 处理复杂业务流程
     难度: ⭐⭐⭐
     
  6️⃣  综合示例
     命令: npm run demo:advanced
     学习: 完整的智能助手应用
     难度: ⭐⭐⭐⭐
     
  7️⃣  自定义模板
     命令: npm run demo:custom
     学习: 创建自己的 Agent
     难度: ⭐⭐

═══════════════════════════════════════════════════════════════

🚀 快速开始：

  1. 安装依赖：
     npm install
     
  2. 配置 API Key：
     cp .env.example .env
     然后编辑 .env 文件，填入你的 OpenAI API Key
     
  3. 运行第一个示例：
     npm run demo:basic

═══════════════════════════════════════════════════════════════

📖 文档：

  • README.md          - 项目概述和核心概念
  • QUICKSTART.md      - 5分钟快速入门指南  
  • EXAMPLES.md        - 所有示例的详细说明
  • TROUBLESHOOTING.md - 常见问题和解决方案

═══════════════════════════════════════════════════════════════

💡 推荐学习路径：

  第1天: demo:basic → demo:tools
  第2天: demo:memory → demo:multi  
  第3天: demo:workflow → demo:advanced → demo:custom

═══════════════════════════════════════════════════════════════

🔗 资源链接：

  • LangChain.js 官方文档: https://js.langchain.com/
  • Agent 指南: https://js.langchain.com/docs/modules/agents/
  • 工具开发: https://js.langchain.com/docs/modules/tools/

═══════════════════════════════════════════════════════════════

需要帮助？查看 TROUBLESHOOTING.md 或 EXAMPLES.md

Happy Learning! 🎉
`);
