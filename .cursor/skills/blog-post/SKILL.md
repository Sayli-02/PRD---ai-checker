---
name: blog-post
description: Frontmatter fields, post structure and research steps for blog posts. Use when researching a blog topic, writing or editing an MDX post in content/blog/, or reviewing a post before a pull request.
---

# Blog post

A post is one MDX file in `content/blog/<slug>.mdx`, added through a pull request. No database.

## Frontmatter (all required)

```yaml
title:
slug:
description:   # under 160 characters
date:          # YYYY-MM-DD
updated:       # YYYY-MM-DD
author:
category:
tags: []
coverImage:
faq:           # list of { question, answer }
```

## Research (before drafting)

1. Collect real questions: Google "People also ask", autocomplete, Search Console (once live), Reddit, Quora, Google Trends India.
2. Ask ChatGPT, Gemini and Perplexity the question. Note who they cite and what is missing.
3. Read the top 5 Google results. Plan a post that answers better and more specifically.
4. Pick one primary question and 3-5 related ones for the FAQ.
5. Write a one-page brief first: target question, audience, outline, sources, internal links.

## Writing

- Answer the main question in the first 2-3 sentences, then go deeper.
- Question-style H2 headings, short paragraphs, at least one table or list.
- Real numbers with linked sources. No copied text.
- 1,000-2,000 words. 2-3 internal links, 1-3 external links to credible sources.
- AI may help draft. A human edits every post and fact-checks every number.
- Follow `copy-rules`: no prices, no guaranteed results.

## Page output (generated, do not hand-write)

Reading time, table of contents, author block, 3 related posts, FAQ block, check CTA mid-post and at the end, `Article` + `FAQPage` + `BreadcrumbList` JSON-LD, OG image, sitemap and RSS entries.

Content is loaded only through `lib/content.ts` so a headless CMS can replace it later.
