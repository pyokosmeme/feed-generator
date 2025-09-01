# Biocosmism Feed Generator Design

## Overview
This document outlines a lightweight AT Protocol feed generator for surfacing discussions about Biocosmism. The feed concentrates on the **3½ Tenets of Biocosmism** and any posts that mention biocosmism or common variants. It is intended to run inexpensively while still being sophisticated enough to support ranked results and basic user controls like "show more" and "show less".

## Goals
- Highlight posts about Biocosmism and its variants ("biocosmist", "biocosmic", etc.).
- Detect and label content that maps to the 3½ Tenets:
  1. **Live forever** – life extension, resurrection, longevity research.
  2. **Go anywhere** – space travel, cosmic expansion, rejection of borders.
  3. **Become anything** – morphological freedom, self-directed evolution, body modification.
  4. **½ If you want to** – voluntary participation and protection of choice.
- Provide a simple ranking system with support for "show more"/"show less" user feedback.
- Remain inexpensive to operate (single SQLite database, low‑overhead hosting).

## High‑Level Architecture
```
ATProto Firehose --> Indexer --> SQLite DB --> Feed Algorithm --> getFeedSkeleton endpoint
```
- **Indexer** subscribes to `com.atproto.sync.subscribeRepos` and stores relevant posts in SQLite.
- **Feed Algorithm** queries indexed posts, applies filtering, scoring and personalization, then returns an array of post URIs for `app.bsky.feed.getFeedSkeleton`.

## Filtering Strategy
1. **Keyword/Regex Matching**
   - Seed terms: `biocosmism`, `biocosmist`, `biocosmic`, `immortalism`, `interplanetarianism`, `morphological freedom`, `longevity`, `anti-aging`, `space colonization`.
   - Case-insensitive regex, tokenization and simple stemming for variants.
2. **Tenet Classification**
   - Lightweight keyword maps for each tenet (e.g. "cryonics" → Live forever, "Mars" → Go anywhere).
   - Store tenet tags on the post record for later ranking and filtering.

## Ranking & "Show More/Show Less"
- Start with recency-based ranking (newer posts first).
- Apply score multipliers:
  - +1.5× for posts matching multiple tenets.
  - User selects **Show more** → +2× boost for that post and similar posts by tags/author for 60 days.
  - User selects **Show less** → ×0.5 dampening for 60 days.
- Store user feedback in a small table keyed by DID.

## API Surface
- `app.bsky.feed.getFeedSkeleton` – serves ranked posts.
- Optional: `PUT /preferences` – accept show more/less signals.
- Health check endpoint for monitoring.

## Deployment Considerations
- Target a single cheap VPS or serverless platform.
- Run HTTPS on port 443 with a valid certificate.
- Environment variables for service DID, feed URI, and database path.
- Cron or background job to prune posts older than 48 hours.

## Future Enhancements
- Semantic search or LLM‑based classification to reduce missed matches.
- Authenticated endpoints to deliver personalized feeds per user.
- Web dashboard for adjusting keyword lists and tenet mappings.

## Implementation Checklist
- [ ] Define keyword lists and tenet mappings in config.
- [ ] Implement firehose indexer and SQLite schema.
- [ ] Add scoring logic with show more/less multipliers.
- [ ] Expose `getFeedSkeleton` and preference endpoints.
- [ ] Register the feed with DID and publish using `scripts/publishFeedGen.ts`.

