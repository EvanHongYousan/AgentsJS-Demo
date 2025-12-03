#!/usr/bin/env node

/**
 * 验证工具定义的正确性
 * 检查 schema 和 func 参数是否匹配
 */

import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

console.log("\n" + "=".repeat(70));
console.log("                    🔍 工具验证测试");
console.log("=".repeat(70) + "\n");

// 测试工具集合
const testTools = [];

// ✅ 正确示例 1: 无参数工具
testTools.push({
  name: "正确示例 - 无参数工具",
  tool: new DynamicStructuredTool({
    name: "no_param_tool",
    description: "无参数工具",
    schema: z.object({}),
    func: async () => "成功",
  }),
  testInput: {},
});

// ✅ 正确示例 2: 必需参数
testTools.push({
  name: "正确示例 - 必需参数",
  tool: new DynamicStructuredTool({
    name: "required_param_tool",
    description: "必需参数工具",
    schema: z.object({
      text: z.string().describe("文本参数"),
    }),
    func: async ({ text }) => `收到: ${text}`,
  }),
  testInput: { text: "测试" },
});

// ✅ 正确示例 3: 可选参数
testTools.push({
  name: "正确示例 - 可选参数",
  tool: new DynamicStructuredTool({
    name: "optional_param_tool",
    description: "可选参数工具",
    schema: z.object({
      required: z.string(),
      optional: z.number().optional(),
    }),
    func: async ({ required, optional = 10 }) => 
      `必需: ${required}, 可选: ${optional}`,
  }),
  testInput: { required: "测试" },
});

// ❌ 错误示例 1: Schema 有参数但 func 没接收
try {
  const badTool1 = new DynamicStructuredTool({
    name: "bad_tool_1",
    description: "错误示例1",
    schema: z.object({
      param: z.string().optional(),
    }),
    func: async () => "这会导致错误",
  });
  
  testTools.push({
    name: "❌ 错误示例 - Schema有参数但func未接收",
    tool: badTool1,
    testInput: { param: "测试" },
    shouldFail: true,
  });
} catch (e) {
  console.log("⚠️  已跳过错误工具定义\n");
}

// 运行测试
let passed = 0;
let failed = 0;

for (const test of testTools) {
  try {
    console.log(`\n测试: ${test.name}`);
    console.log(`  输入: ${JSON.stringify(test.testInput)}`);
    
    const result = await test.tool.invoke(test.testInput);
    
    if (test.shouldFail) {
      console.log(`  ❌ 失败: 应该报错但成功了`);
      failed++;
    } else {
      console.log(`  ✅ 通过: ${result}`);
      passed++;
    }
  } catch (error) {
    if (test.shouldFail) {
      console.log(`  ✅ 预期错误: ${error.message}`);
      passed++;
    } else {
      console.log(`  ❌ 失败: ${error.message}`);
      failed++;
    }
  }
}

console.log("\n" + "=".repeat(70));
console.log(`测试结果: ${passed} 通过, ${failed} 失败`);
console.log("=".repeat(70));

if (failed > 0) {
  console.log("\n⚠️  发现问题！请检查工具定义。");
  console.log("📖 查看详细指南: docs/COMMON_ERRORS.md\n");
  process.exit(1);
} else {
  console.log("\n✅ 所有工具验证通过！\n");
  process.exit(0);
}
