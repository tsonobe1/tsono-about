---
title: '🔥Honoにはまってる'
date: '2026-02-06'
kind: 'tech'
tags:
  - hono
  - Cloudflare
description: '🔥'
---


[Durable Object で遊んでる](/diary/do) でいろいろ試した後、 hono で書き直している

https://hono.dev/

めっちゃいい

apiがシンプルに書けるし、便利なミドルウェアが豊富  
zodとの連携も強くてバリデーションを書きやすい

自分が作っているものは規模が小さいといいつつ、Cloudflare D1 と Durable Object（アラームが使いたい）も触る。乱雑に作るとまずいので以下のアーキテクチャにしてる

```sh
├── index.ts # 入口
├── 機能名
│   ├── controller # APIのふりわけ
│   ├── domain # 型など
│   ├── durable-object #  durable object alarm が呼ばれるときに処理（仮）
│   ├── repository # D1クエリ（生）
│   └── service # controllerから呼ばれるメソッド
└── web # クライアント
    ├── controller
    ├── csr # CSRする部分 
    └── ssr # ssrで返すベースのhtml
```

serviceとrepositoryはクラスじゃなくて純粋な関数にしている。規模が大きくなって辛くなってきたら考える。

クライアント側は、正直 pages にformをおいてworkerのapiを叩くのでもいいけど、[jsx-dom](https://hono.dev/docs/guides/jsx-dom
)を試したくてこういう構造にしている。

楽しいなぁ、もっと深く触りたい