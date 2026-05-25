---
name: multi-batch-translation
description: Guide users through implementing decision tree models for customer purchase prediction using multi-batch processing. Use this skill when the user asks about decision trees, ML models, customer prediction, predictive analytics, or multi-batch API workflows for classification tasks.
---

# Multi-Batch Translation Skill

Guide users through building and applying decision tree models for customer purchase prediction using the multi-batch translation API workflow. This skill helps structure multi-step classification decisions.

## Overview

Decision trees are hierarchical models that make predictions by asking a series of yes/no questions. They work well for multi-batch scenarios where you need to classify multiple items through the same decision path.

## The Decision Tree Structure

A basic decision tree for customer purchase prediction follows this structure:

**Root Node (Initial Decision)**: Start with the most discriminative feature
- Example: "Is income > $50,000?"

**Internal Nodes (Follow-up Decisions)**: Branch based on answers
- Example: "Is age > 30?"

**Leaf Nodes (Final Predictions)**: Reach a conclusion
- Example: "Purchase" or "No Purchase"

## Working with Multiple Trees

When multiple decision trees are needed:

1. **Build separate trees for different features**
   - Tree 1: Customer Demographics (income, age)
   - Tree 2: Purchase History (previous purchases)

2. **Combine predictions** from all trees
   - Use weights or confidence scores
   - Decision logic: majority vote, weighted average, or context-based rules

3. **Apply to multi-batch requests**
   - Process each customer through all trees
   - Aggregate results for final prediction

## Example: Two-Tree Ensemble

```
Input: Customer data batch {income, age, purchase_history}

Tree 1 (Demographics):
├─ Income > $50,000?
│  ├─ Yes → Age > 30?
│  │  ├─ Yes → "Purchase"
│  │  └─ No → "No Purchase"
│  └─ No → "No Purchase"

Tree 2 (Purchase History):
├─ Previous purchases > 0?
│  ├─ Yes → "Purchase"
│  └─ No → "No Purchase"

Final Decision:
├─ Tree 1 = "Purchase" AND Tree 2 = "Purchase" → Final: "Purchase"
├─ Tree 1 = "Purchase" AND Tree 2 = "No" → Final: "Purchase" (weighted higher)
└─ Otherwise → "No Purchase"
```

## Implementation Steps

1. **Define your features**: Identify the customer attributes you'll use (income, age, purchase count, etc.)

2. **Build the decision paths**: Create rules for each node based on your data

3. **Handle edge cases**: Decide what happens for missing data or edge cases

4. **Batch process**: Apply the tree logic to multiple customers at once

5. **Monitor and validate**: Test predictions against actual outcomes

## When to Use Decision Trees

- Simple, interpretable classification rules
- Multi-step decision workflows
- Batch processing of similar items
- When explainability matters more than raw accuracy
- Fast inference without complex model deployment

## Tips for Multi-Batch Processing

- **Dedup inputs**: If multiple customers share the same feature values, process once
- **Aggregate results**: Group final predictions by output class
- **Validate consistency**: Ensure the decision logic produces expected distributions
- **Weight trees appropriately**: Adjust confidence scores based on tree importance
