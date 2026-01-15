---
title: 'Nuxt Contentでドキュメントを書く手順'
date: '2026-01-08'
kind: 'tech'
tags:
  - nuxt
  - content
  - docs
summary: '執筆から公開までのワークフローをステップごとに整理しました。'
---

1. `content/` に下書きを作る。タイトルと日付、概要を frontmatter に入れておく。
2. `pnpm dev` でプレビューしながら見出しの構造を整える。
3. `<ContentRenderer>` で確認しつつ、画像やコードブロックを挿入する。
4. PR を作成してレビューを依頼。`pnpm nuxi typecheck` で型崩れがないかも見る。
5. main に merge されたら、Cloudflare Pages が自動でデプロイ。

この流れをテンプレート化しておくと、チームで同じ速度感でドキュメントを更新できる。
