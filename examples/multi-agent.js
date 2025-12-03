/**
 * 示例 4: 多 Agent 协作
 * 展示如何让多个 Agent 协作完成任务
 */

import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getModel, showModelConfig } from "../config/model-config.js";

async function runMultiAgent() {
  console.log("👥 示例 4: 多 Agent 协作\n");
  console.log("=".repeat(50));

  // 显示当前模型配置
  showModelConfig();

  const model = getModel({ temperature: 0.7 });

  // === Agent 1: 研究员 - 负责收集信息 ===
  const researchDatabase = {
    "人工智能": "AI是计算机科学的一个分支，致力于创建能够模拟人类智能的系统",
    "机器学习": "机器学习是AI的子集，通过数据和经验自动改进算法性能",
    "深度学习": "深度学习使用多层神经网络处理复杂数据，是机器学习的一种方法",
  };

  const researchTool = new DynamicStructuredTool({
    name: "research_topic",
    description: "研究指定主题并返回相关信息",
    schema: z.object({
      topic: z.string().describe("要研究的主题"),
    }),
    func: async ({ topic }) => {
      return researchDatabase[topic] || `未找到关于"${topic}"的信息`;
    },
  });

  const researcher = await initializeAgentExecutorWithOptions(
    [researchTool],
    model,
    {
      agentType: "chat-conversational-react-description",
      verbose: false,
    }
  );

  // === Agent 2: 作家 - 负责撰写内容 ===
  const writerTool = new DynamicStructuredTool({
    name: "write_article",
    description: "根据提供的信息撰写文章",
    schema: z.object({
      topic: z.string().describe("文章主题"),
      content: z.string().describe("参考内容"),
    }),
    func: async ({ topic, content }) => {
      return `📝 文章《${topic}简介》\n\n${content}\n\n这是一个快速发展的领域，值得深入学习。`;
    },
  });

  const writer = await initializeAgentExecutorWithOptions(
    [writerTool],
    model,
    {
      agentType: "chat-conversational-react-description",
      verbose: false,
    }
  );

  // === Agent 3: 编辑 - 负责审核和优化 ===
  const editorTool = new DynamicStructuredTool({
    name: "review_content",
    description: "审核并优化文章内容",
    schema: z.object({
      article: z.string().describe("要审核的文章"),
    }),
    func: async ({ article }) => {
      return `✅ 审核完成\n\n${article}\n\n[编辑建议: 内容清晰，建议添加更多实例]`;
    },
  });

  const editor = await initializeAgentExecutorWithOptions(
    [editorTool],
    model,
    {
      agentType: "chat-conversational-react-description",
      verbose: false,
    }
  );

  // === 协作流程 ===
  console.log("\n🎯 任务: 创建一篇关于'人工智能'的文章\n");

  // 步骤 1: 研究员收集信息
  console.log("📚 步骤 1: 研究员收集信息...\n");
  const researchResult = await researcher.invoke({
    input: "研究'人工智能'这个主题",
  });
  console.log(`研究结果: ${researchResult.output}\n`);

  // 步骤 2: 作家撰写文章
  console.log("✍️  步骤 2: 作家撰写文章...\n");
  const articleResult = await writer.invoke({
    input: `请根据以下信息撰写一篇关于"人工智能"的文章: ${researchResult.output}`,
  });
  console.log(`${articleResult.output}\n`);

  // 步骤 3: 编辑审核
  console.log("🔍 步骤 3: 编辑审核文章...\n");
  const finalResult = await editor.invoke({
    input: `请审核这篇文章: ${articleResult.output}`,
  });
  console.log(`${finalResult.output}\n`);

  console.log("=".repeat(50));
  console.log("\n✅ 多 Agent 协作完成！");
}

// 运行示例
runMultiAgent().catch(console.error);
