---
title: 'Nuxt Content サンプル'
description: 'Nuxt Contentで作成したサンプル記事です。'
date: '2026-01-11'
---

# Nuxt Content サンプル記事

Nuxt Contentを使うと、Markdownで書いた文章がそのままサイトに表示されます。
このページは **サンプル記事の詳細** を想定して、少し長めの本文を入れています。

## このページの目的

次のような要素が含まれていることを確認できます。

- 見出しや段落の階層
- 箇条書きや引用
- インラインコードとコードブロック
- ある程度の文章量

## 使い方の例

`content/` フォルダに Markdown を置くと、自動的にページとして扱われます。
例えば `content/sample.md` を置くと `/sample` で読めるようになります。

```bash
mkdir content
echo "# Hello" > content/hello.md
```

```ts
console.log('testing code block')
console.log('testing code block')
console.log('testing code block')
console.log('testing code block')
console.log('testing code block')
```

## ちょっとした説明文

Nuxt Content は、ブログやドキュメント、ポートフォリオのような
文章中心のサイトに向いています。文章を編集して保存するだけで、
サイトが更新されるのでとても楽です。

![アクセント用のイメージ](/images/blue-orb.svg)

参考リンクとして、[Nuxt Content公式ガイド](https://content.nuxt.com) も置いておきます。

> 小さな更新を素早く反映できるのが魅力です。

## まとめ

このサンプル記事は「長さ」や「構造」を確認するためのものです。
必要に応じて文章を増やしたり、別の記事を追加したりできます。
