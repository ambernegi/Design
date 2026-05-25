---
name: multi-batch-translation
description: Walk through a multi-batch decision-tree prediction model for customer purchase behavior. Use when the user asks about multi-batch translation decision logic, prediction trees, or combining multiple tree outputs.
---

# Multi-Batch Translation Skill

Guide the user through understanding and applying decision trees for multi-batch prediction scenarios, using customer purchase behavior as the working example.

## Inputs to collect

Before explaining the decision trees, gather:

1. **Domain context** — what does the user want to predict (purchase decision, customer churn, etc.)?
2. **Features** — what data points (income, age, previous purchases) does the user have available?
3. **Single vs. multiple trees** — is the user working with one decision tree or combining results from multiple trees?
4. **Combining strategy** — if multiple trees: how should results be weighted or combined (majority vote, confidence weighting, manual override)?

## Decision tree logic

A decision tree makes predictions by following a sequence of binary questions from root to leaf:

- **Root Node (Income)**: "Is income > $50,000?"
  - Yes → proceed to next question
  - No → predict "No Purchase"

- **Internal Node (Age)**: "Is age > 30?"
  - Yes → proceed to next question
  - No → predict "No Purchase"

- **Leaf Nodes (Previous Purchases)**: 
  - Has previous purchases → "Purchase"
  - No previous purchases → "No Purchase"

Each path through the tree represents one prediction rule.

## Multiple tree results

When combining results from multiple trees:

- **Tree 1 (Demographics)** predicts based on income and age
- **Tree 2 (Purchase History)** predicts based on previous purchase count

Example outcomes:
- Tree 1: "Purchase", Tree 2: "No Purchase" → final decision depends on weight/confidence assigned to each tree

## Combining tree results

Strategies for combining predictions:

1. **Confidence weighting** — assign a confidence score to each tree; weight the final prediction accordingly
2. **Majority vote** — if odd number of trees, use simple majority
3. **Domain rules** — apply business logic to override based on problem context (e.g., "always trust Tree 1 for high-income segments")

## Output

Provide:

1. A step-by-step walkthrough of the user's decision tree(s) using their actual features and data
2. Example predictions for realistic customer scenarios from their domain
3. A recommendation for combining multiple trees if applicable
4. Guidance on how to tune or adjust the tree structure based on prediction performance
