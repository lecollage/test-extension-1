# Product Research Assistant

## Chrome Extension – Spec Driven Development Document

Version: 0.1.0
Author: TBD
Status: Draft

---

# 1. Problem

Users researching products before purchase typically:

- open 20–40 browser tabs
- manually compare products
- copy links into notes or spreadsheets
- lose track of candidates

This workflow is inefficient and unstructured.

There is no browser-native workflow for:

- collecting candidate products
- grouping variants
- comparing products
- tracking decisions

---

# 2. Goals

The system must allow users to:

1. collect product candidates during browsing
2. organize candidates into research projects
3. group identical products from multiple stores
4. compare candidate products
5. store notes and decisions
6. detect duplicates automatically

---

# 3. Non-Goals

The MVP will NOT include:

- AI review summarization
- automatic spec extraction
- price history tracking
- deal alerts
- product recommendation engine

These features may be added in future versions.

---

# 4. System Context

The system is a Chrome Extension operating within the browser environment.

Core components:

Chrome Extension
├ Content Scripts
├ Background Worker
├ Popup UI
├ Settings Page
└ Local Storage

The extension interacts with:

- e-commerce websites
- browser DOM
- Chrome extension APIs

---

# 5. Core Concepts

## Research Project

A research project represents a purchase investigation.

Examples:

- Monitor Stand Research
- KVM Switch Comparison
- Washing Machine Selection

---

## Candidate

A candidate is a product that the user is considering purchasing.

Each candidate belongs to a candidate group.

---

## Candidate Group

Candidate groups represent a normalized product model.

Example:

Ergotron LX

A group may contain multiple store variants.

---

## Store Variant

A store variant represents the same product sold by different stores.

Example:

Ergotron LX

- Amazon – $59
- Allegro – $62
- MediaMarkt – $65

---

# 6. Functional Requirements

## FR-1 Save Candidate

Users must be able to save the current product page as a candidate.

Trigger:

Save to Research

Extracted fields:

- product title
- price
- URL
- image

---

## FR-2 Research Projects

Users must be able to:

- create project
- rename project
- delete project

---

## FR-3 Candidate List

Each project contains a candidate list.

Candidates must be displayed grouped by:

Brand + Model

---

## FR-4 Candidate Interaction

Users must be able to:

- open product page
- edit candidate title
- add notes
- delete candidate
- collapse / expand groups

---

## FR-5 Candidate Detection

The extension must support three candidate creation methods.

### Method A — Product Page Button

Save to Research

### Method B — Text Selection

User selects product title.

Context menu:

Add to Candidate List

### Method C — Product Page Suggestion

If a page appears to be a product page the extension may show:

Add this product to research?

---

# 7. Product Page Detection

The system must detect product pages using heuristics.

Signals:

- Title (h1 or product title)
- Price element
- Add-to-cart button

Scoring:

score = 0
title detected → +1
price detected → +1
buy button detected → +1

If score ≥ 2 → page considered product page.

---

# 8. Product Normalization

Different stores may use different titles for the same product.

Example:

- Ergotron LX Desk Monitor Arm
- Ergotron LX Monitor Mount
- Ergotron LX Desk Arm

Normalized name:

Ergotron LX

Normalization pipeline:

1. lowercase text
2. remove marketing words
3. detect brand
4. detect model
5. remove generic words

---

# 9. Model Detection

Product models often look like:

- LX
- MX
- V002
- U2720Q

Regex heuristic:

[A-Z0-9]{2,10}

---

# 10. Candidate Deduplication

Algorithm:

normalize(new_product_title)

for each candidate_group:

    if normalized_name == group.normalized_name:
        assign to group

    if similarity(normalized_name, group.normalized_name) > 0.8:
        suggest duplicate

Fuzzy matching options:

- Levenshtein distance
- Jaro-Winkler similarity

Threshold: similarity ≥ 0.8

---

# 11. Settings

The extension must include a Settings page.

Enable / Disable toggle:

Enable Extension [ON/OFF]

If disabled:

- content scripts stop running
- UI injection stops

Documentation link:

https://projectdocs.example

Feedback form fields:

- message
- extension version
- browser version

Extension metadata:

Version: 0.1.0
Author: TBD
Website: TBD

---

# 12. Data Model

## ResearchProject

{
"id": "uuid",
"title": "Monitor Stand Research",
"created_at": "timestamp"
}

## CandidateGroup

{
"id": "uuid",
"project_id": "uuid",
"brand": "Ergotron",
"model": "LX"
}

## CandidateItem

{
"id": "uuid",
"group_id": "uuid",
"title": "Ergotron LX Desk Arm",
"store": "Amazon",
"price": "$59",
"url": "https://amazon.com/product",
"image": "image_url"
}

---

# 13. Architecture

Chrome Extension

- content-script
- background-worker
- popup-ui
- settings-page
- local-storage

---

# 14. Technology Stack

Frontend:

- React
- TypeScript
- Tailwind

Extension APIs:

- Chrome Extension Manifest V3
- Chrome APIs

Storage:

- chrome.storage.local

---

# 15. MVP Roadmap

Week 1

- extension skeleton
- product page detection
- save candidate

Week 2

- research projects
- candidate list
- grouping logic

Week 3

- comparison UI
- notes
- settings page
- feedback form

---

# 16. Acceptance Criteria

MVP is complete if a user can:

1. create a research project
2. save product candidates
3. view grouped candidates
4. compare candidates
5. add notes
6. disable the extension
7. send feedback
