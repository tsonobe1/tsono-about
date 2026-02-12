---
title: Codex CLI が git操作できないと言ってくる
description: 
kind: 'tech'
date: 2026-02-12
tags:
  - xcode
  - codex cli
---

Codex CLIが
```sh
• Ran git status --short
  └ You have not agreed to the Xcode license agreements. Please run 'sudo
    xcodebuild -license' from within a Terminal window to review and agree
    to the Xcode and Apple SDKs license.

───────────────────────────────────────────────────────────────────────────

• 今はコミットできません。git 実行時に以下で止まっています。
```
と言ってくる

## 解決
Xcode を開いて

![Xcode](/images/articles/codex-cli-has-not-xcode-lisence/xcode.webp)


Agree すればいい

多分、Xcode のアップデートをしたのが原因
