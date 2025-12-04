/**
 * 示例 5: 工作流 Agent
 * 展示如何创建一个执行复杂工作流的 Agent
 */

import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getModel, showModelConfig } from "../config/model-config.js";

async function runWorkflowAgent() {
  console.log("🔄 示例 5: 工作流 Agent\n");
  console.log("=".repeat(50));

  // 模拟订单系统
  const orders = [];
  const inventory = {
    "笔记本电脑": 10,
    "手机": 15,
    "耳机": 20,
  };

  // 工具 1: 检查库存
  const checkInventoryTool = new DynamicStructuredTool({
    name: "check_inventory",
    description: "检查商品库存",
    schema: z.object({
      product: z.string().describe("商品名称"),
    }),
    func: async ({ product }) => {
      const stock = inventory[product];
      if (stock !== undefined) {
        return `📦 ${product} 库存: ${stock} 件`;
      }
      return `❌ 未找到商品: ${product}`;
    },
  });

  // 工具 2: 创建订单
  const createOrderTool = new DynamicStructuredTool({
    name: "create_order",
    description: "创建新订单",
    schema: z.object({
      product: z.string().describe("商品名称"),
      quantity: z.number().describe("购买数量"),
      customer: z.string().describe("客户名称"),
    }),
    func: async ({ product, quantity, customer }) => {
      if (!inventory[product] || inventory[product] < quantity) {
        return `❌ 订单创建失败: 库存不足`;
      }
      
      const orderId = orders.length + 1;
      orders.push({ orderId, product, quantity, customer, status: "pending" });
      inventory[product] -= quantity;
      
      return `✅ 订单创建成功！订单号: ${orderId}，商品: ${product} x ${quantity}`;
    },
  });

  // 工具 3: 查询订单
  const queryOrderTool = new DynamicStructuredTool({
    name: "query_order",
    description: "查询订单状态",
    schema: z.object({
      orderId: z.number().describe("订单号"),
    }),
    func: async ({ orderId }) => {
      const order = orders.find(o => o.orderId === orderId);
      if (order) {
        return `📋 订单 ${orderId}: ${order.product} x ${order.quantity}，状态: ${order.status}`;
      }
      return `❌ 未找到订单: ${orderId}`;
    },
  });

  // 工具 4: 发货
  const shipOrderTool = new DynamicStructuredTool({
    name: "ship_order",
    description: "发货订单",
    schema: z.object({
      orderId: z.number().describe("订单号"),
    }),
    func: async ({ orderId }) => {
      const order = orders.find(o => o.orderId === orderId);
      if (!order) {
        return `❌ 未找到订单: ${orderId}`;
      }
      if (order.status === "shipped") {
        return `⚠️ 订单 ${orderId} 已发货`;
      }
      
      order.status = "shipped";
      return `✅ 订单 ${orderId} 已发货！`;
    },
  });

  // 显示当前模型配置
  showModelConfig();

  // 创建 Agent
  const model = getModel({ temperature: 0 });

  const agent = await initializeAgentExecutorWithOptions(
    [checkInventoryTool, createOrderTool, queryOrderTool, shipOrderTool],
    model,
    {
      agentType: "structured-chat-zero-shot-react-description",
      verbose: true,
      maxIterations: 10,
    }
  );

  // 执行复杂工作流
  const workflows = [
    "帮我查一下笔记本电脑的库存",
    "我是张三，想买2台笔记本电脑，帮我创建订单",
    "查询我刚才创建的订单状态, 订单号是1",
    "帮我发货刚才的订单, 订单号是1",
    "再查一次订单状态确认已发货, 订单号是1",
  ];

  console.log("\n🎯 开始执行订单处理工作流...\n");

  for (const task of workflows) {
    console.log(`\n📝 任务: ${task}\n`);
    const response = await agent.invoke({ input: task });
    console.log(`✅ 结果: ${response.output}`);
    console.log("-".repeat(50));
  }

  // 显示最终状态
  console.log("\n📊 最终状态:");
  console.log("\n库存:");
  Object.entries(inventory).forEach(([product, stock]) => {
    console.log(`  - ${product}: ${stock} 件`);
  });
  console.log("\n订单:");
  orders.forEach(order => {
    console.log(`  - 订单${order.orderId}: ${order.customer} - ${order.product} x ${order.quantity} [${order.status}]`);
  });

  console.log("\n" + "=".repeat(50));
}

// 运行示例
runWorkflowAgent().catch(console.error);
