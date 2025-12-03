#!/usr/bin/env node

/**
 * 测试 API 连接和配置
 * 用于验证环境变量配置是否正确
 */

import { getModel, showModelConfig } from "../config/model-config.js";

async function testConnection() {
  console.log("\n" + "=".repeat(70));
  console.log("                    🧪 测试 API 连接");
  console.log("=".repeat(70) + "\n");

  try {
    // 显示配置
    showModelConfig();

    console.log("⏳ 正在测试连接...\n");

    // 创建模型
    const model = getModel({ temperature: 0.7 });

    // 测试简单调用
    const response = await model.invoke("用一句话回复：你好");

    console.log("✅ 连接成功！\n");
    console.log("📩 测试响应:");
    console.log(`   ${response.content}\n`);

    console.log("=".repeat(70));
    console.log("🎉 配置正确！你可以开始使用了。");
    console.log("=".repeat(70) + "\n");

    console.log("💡 下一步:");
    console.log("   • 运行 'npm run demo:basic' 开始第一个示例");
    console.log("   • 查看 QUICKSTART.md 了解更多\n");

  } catch (error) {
    console.error("\n❌ 连接失败！\n");
    console.error("错误信息:", error.message);
    console.error("\n");

    // 提供帮助信息
    const provider = process.env.AI_PROVIDER || "openrouter";
    
    if (error.message.includes("API key") || error.message.includes("缺少")) {
      console.log("🔧 解决方案:");
      console.log("   1. 确认 .env 文件存在");
      console.log("   2. 检查 API Key 配置:");
      
      if (provider === "openrouter") {
        console.log("      OPENROUTER_API_KEY=sk-or-v1-your-key-here");
        console.log("   3. 获取 API Key: https://openrouter.ai/keys");
      } else {
        console.log("      OPENAI_API_KEY=sk-your-key-here");
        console.log("   3. 获取 API Key: https://platform.openai.com/api-keys");
      }
      
      console.log("\n   查看详细指南: TROUBLESHOOTING.md\n");
      
    } else if (error.message.includes("Model not found")) {
      console.log("🔧 解决方案:");
      console.log("   1. 检查模型名称是否正确");
      console.log("   2. 运行 'npm run models' 查看可用模型");
      console.log("   3. 确认模型名称区分大小写\n");
      
    } else if (error.message.includes("Insufficient") || error.message.includes("quota")) {
      console.log("🔧 解决方案:");
      console.log("   1. 检查账户余额");
      
      if (provider === "openrouter") {
        console.log("   2. 访问 https://openrouter.ai/credits 充值");
        console.log("   3. 或使用免费模型:");
        console.log("      OPENROUTER_MODEL=google/gemini-pro\n");
      } else {
        console.log("   2. 访问 https://platform.openai.com/account/billing 充值\n");
      }
      
    } else {
      console.log("🔧 解决方案:");
      console.log("   1. 检查网络连接");
      console.log("   2. 查看 TROUBLESHOOTING.md");
      console.log("   3. 确认 .env 配置正确\n");
    }

    process.exit(1);
  }
}

// 运行测试
testConnection();
