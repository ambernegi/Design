---
name: multi-batch-translation
description: Walk through a multi-batch decision-tree prediction model for customer purchase behavior. Use when the user asks about multi-batch translation decision logic, prediction trees, or combining multiple tree outputs.
---

# Multi-Batch Translation Skill

Guide the user through understanding how decision trees predict customer purchase behavior and how multiple tree outputs can be combined for a final prediction.

## Inputs to collect

1. **Customer income** — numeric value; the first split point is $50,000.
2. **Customer age** — numeric value; the second split point is 30.
3. **Previous purchases** — boolean (has the customer made previous purchases?).

## Decision tree logic

### Tree 1: Customer Demographics

1. "Income > $50,000?"
   - No → predict **No Purchase**
   - Yes → proceed to age check
2. "Age > 30?"
   - No → predict **No Purchase**
   - Yes → predict **Purchase**

### Tree 2: Previous Purchases

1. "Previous Purchases > 0?"
   - Yes → predict **Purchase**
   - No → predict **No Purchase**

## Combining tree results

When Tree 1 and Tree 2 disagree, the final prediction depends on the weight or confidence assigned to each tree. This is decided based on the problem context — for example, weighting Tree 1 higher if demographic signals are stronger predictors in the dataset.

## Output

Produce, in this order:

1. The prediction from Tree 1 based on the user's inputs.
2. The prediction from Tree 2 based on previous purchase history.
3. The combined final prediction with a note on which tree carried more weight and why.
