---
title: Overview
description: High-level introduction to the Design Automation API — what it does, when to use it, and how it fits into your workflow.
sidebar_position: 1
---

# Overview

The Design Automation API lets you run scripts and design automation logic in the cloud against CAD files. Use it to extract data, generate outputs, and run batch transformations on Autodesk design files without requiring a local installation of the authoring tool.

## When to use this API

- Automating repetitive design tasks at scale (batch parameter updates, geometry extraction)
- Running design validation scripts as part of a CI/CD pipeline
- Generating derivative outputs (drawings, BOMs, renders) from model files
- Integrating design logic into cloud-native applications

## Key concepts

| Concept | Description |
|---------|-------------|
| Activity | A definition of work to run — references an AppBundle and specifies inputs/outputs |
| AppBundle | Packaged automation code (scripts, plugins) uploaded and versioned in the cloud |
| WorkItem | An execution instance — runs an Activity against specific input files |
| Engine | The Autodesk application runtime that executes the Activity (e.g. AutoCAD, Revit) |

## Typical workflow

1. Upload your automation code as an **AppBundle**.
2. Define an **Activity** that describes what the AppBundle does and what it expects.
3. Submit a **WorkItem** to run the Activity against a specific design file.
4. Poll for completion and retrieve the output files.

## Next steps

- Follow the [Quickstart](../how-to-guide/getting-started) to run your first WorkItem.
- Review [Security and Tokens](./security) to understand authentication requirements.
- See the [Reference](../reference/auth) section for endpoint details.
