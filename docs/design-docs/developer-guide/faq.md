---
title: FAQ
description: Frequently asked questions about the Design Automation API.
sidebar_position: 4
---

# FAQ

## What is the difference between an AppBundle and an Activity?

An **AppBundle** is a packaged piece of automation code (a DLL, script, or plugin). An **Activity** defines how that code runs — what engine to use, what command line to invoke, and what inputs and outputs to expect. You can think of AppBundle as the "what" and Activity as the "how".

## Which engines are supported?

Design Automation supports AutoCAD, Revit, Inventor, and 3ds Max. The available engine versions are listed at `GET /engines`. Use an exact version string (e.g. `Autodesk.AutoCAD+24`) when defining Activities.

## Can I run multiple AppBundles in a single Activity?

Yes. An Activity can reference multiple AppBundles in its `appbundles` array, and the engine will load all of them before executing the command line.

## How do I provide input files to a WorkItem?

Pass a signed URL (with GET permission) as the value for each input argument. Design Automation downloads the file before running the Activity. Use Object Storage Service (OSS) or any HTTPS-accessible URL.

## How do I retrieve output files?

Pass a signed URL with PUT permission as the value for each output argument. Design Automation uploads the output file to that URL after the Activity completes.

## How long does a WorkItem take?

It depends on the complexity of the Activity and the size of the input files. WorkItems are queued and processed asynchronously. Poll the WorkItem status endpoint until `status` is `success` or `failed`.

## Is there a maximum execution time?

Yes. WorkItems have a configurable timeout (up to a platform maximum). If the Activity does not complete within the allowed time, the WorkItem transitions to `timedout` status.

## How do I get API credentials?

Register at the [APS Portal](https://aps.autodesk.com), create an application, and use the Client ID and Client Secret to obtain an access token.
