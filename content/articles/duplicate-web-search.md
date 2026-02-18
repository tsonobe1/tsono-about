---
title: Codex CLI が web_search 設定が非推奨と言っていくる
date: 2026-02-10T00:00:00.000Z
description: 2026/02/10時点でCodex CLIが
kind: tech
tags:
  - codex cli
---

2026/02/10時点でCodex CLIが

```text
[tools].web_search` is deprecated. Use `web_search` instead
```

と言ってくる

## 原因

かつて `.codex/config.toml` に設定した `[tools] web_search = true` が非推奨になった模様 :br
最新を見てみると...

[config.toml](https://developers.openai.com/codex/config-reference/#configtoml)

![config.toml設定値一覧](/images/articles/duplicate-web-search/image.webp)

`features.` や `tools.` が非推奨となっている。  
最下部の `web_search` が最新。stringで `cached` or `live` を指定してねとのこと。

## 解決

新鮮なデータが欲しいので `live` を設定

```toml [config.toml]
web_search = 'live'
```

CLIも無事警告が出ずに起動。
