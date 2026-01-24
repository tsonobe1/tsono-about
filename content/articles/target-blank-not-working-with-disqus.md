---
title: target='_blank'なリンクが開かない
date: 2025-08-24
updatedAt: 2025-09-15
kind: 'tech'
tags:
  - 'Disqus'
  - 'target_blank'
  - 'noopener'
  - 'noreferrer'
  - 'Chrome'
  - 'Safari'
  - 'Hugo'
---

## 結論

- 外部リンクを新規タブで開く場合、aタグに **noreferrer**, **noopener** 属性を付ける必要はない
- Disqusの Affiliate link のチェックを外す

## 経緯: target="\_blank" のリンクが開かない

このブログでは、外部リンクに `target="_blank"`{html} を付けることで、デフォルトで新しいタブを開くようにしている。

::note
2026/01/17時点では Nuxt Content でブログを書いていますが、当時は Hugo で作成していました。
::

ところが、本番環境に記事を公開して閲覧していたところ、外部リンクが正しく開かない現象に遭遇した。
具体的には、リンク押下後に Google Chrome ではアドレスバーに `about:blank`{lang="html"} と表示され、新規タブで真っ白なページが開く。

Safari では、アドレスバーに遷移元のURLが表示され、新規タブで真っ白なページが表示される。

さらに奇妙なのは、この挙動が一定ではない点。
例えば「1回目は正しくリンク先が開くのに、2回目以降は真っ白なタブになってしまう」場合もあれば、「最初のクリックから真っ白なタブが開く」場合もある。

ただ、新規タブを開くを押下 or Command + クリックすると正常に開く。

まとめると👇️

- `target="_blank"` なリンクをクリックすると、真っ白なページが開く
- 新規タブのアドレスバーの値がブラウザによって異なる
- 真っ白なタブが開くタイミングにばらつきがある
- `新しいタブで開く` は問題ない

🤔????

なんだこれ...

## 原因

クリックイベントを補足しているスクリプトを調べたところ、Disqus の一部スクリプトが関係していそうだった。
Disqus はウェブサイトやブログにコメントを追加できるサービス。
2007年頃の立ち上げから2013年頃に向けてバズった模様。それ移行も「Disqus導入してみた」系の記事は散見され、私も Hugo で作成している本ブログに導入した。
それが 2024年8月初旬頃。

Disqus には、外部リンクを自動的にアフィリエイトリンクに差し替える _Affiliate Links_ 機能がある。これにより収益を得ている模様。
[The Disqus Affiliated Links Program](https://tuhrig.de/the-disqus-affiliated-links-program/?utm_source=chatgpt.com)

Disqusで新しいサイトを作成するとデフォルトで有効化されている。

これが有効だと、記事内リンクのクリックをスクリプトで捕捉し、アフィリエイトリンク先にリダイレクトする。
この機能を無効化することでスクリプトが読み込まれなくなり、正常に新規タブで外部リンクを開けるようになる。

おそらく新規タブを開いた後に非同期で取得したリンクにリダイレクトをさせる処理があり、それが何らかの理由で、うまくいってなかったっぽい。

`opener` で新規タブの `location` をアフィリエイトサイトのリンクに変更しているが、`nopener` 属性のせいでうまくいかない...というストーリーかと思ったが、それだとすべての `target="_blank"` なリンクが開けなくなるし、そもそも元タブから新規タブのURLを変更するのはlocationじゃない気がするし...

うーん、よくわからない

## 解決方法

とりあえずDisqusのアフィリエイトリンク設定を無効にすること

1. [Disqus Advanced Settings](https://<disqusの自サイト>.disqus.com/admin/settings/advanced/) にアクセス
2. `affiliate links` のチェックを外す

{{< figure src="/結論/2025-09-14_20-06-36_スクリーンショット 2025-09-14 20.06.30.png" title="Disqusのアフィリエイトリンクを無効にする" width="720" >}}

### 追記 2025-09-14

今動作を確認したところ、

- アフィリエイトリンク機能が有効
- `target="_blank"` なリンク

でも問題なく遷移できた。

#### テスト用ページ

[Disqus Affiliate Links テスト](https://tsonobe1.github.io/gisqus_link_test/)

執筆時は確かに記事冒頭の動作だった気がするけど...

## 新規タブで開きたい `<a>タグ` の属性はどうすべきか

良い機会なので調べ直してみた。

- `noreferrer`
  - ページA → ページB の遷移時に、 `HTTP Referer` ヘッダの送信を省略する
- `noopener`
  - ページA → ページB の遷移時に、 `window.opener` を `null` に設定する
  - `HTTP Referer` ヘッダは送信される
- `noreferrer` を設定すると、 `noopener` の設定が自動付与される
- `window.opener.location = "<URL>"` のように書き換えると、ページAのタブを任意のページCに遷移できる
  - この仕様を用いた攻撃を `Tabnabbing` という
  - [Tabnabbing](https://owasp.org/www-community/attacks/Reverse_Tabnabbing?utm_source=chatgpt.com)
- 今のモダンなブラウザでは `target="_blank"` なタグには暗黙的に `noopener` 相当の処理が自動付与される
  - [Target=\_blank implies rel=noopener | Stefan Judis Web Development](https://www.stefanjudis.com/today-i-learned/target-blank-implies-rel-noopener/?utm_source=chatgpt.com)
  - つまり、`window.opener` が null となる
- `noreferrer` はリファラを一切渡さないため、アクセス解析に支障をもたらす
  - [別タブへのリンク記述「target="\_blank"とrel="noopener noreferrer"」の見直しを - 株式会社真摯](https://cinci.jp/blog/20240723-review-target-blank-noopener-noreferrer-practices)
- Referer情報をどのくらい含めるかは `Referrer-Policy` で設定する
  - デフォは `strict-origin-when-cross-origin`

### まとめ

- 単なる技術ブログでは外部リンクに
  - `noreferrer属性` は不要
  - `noopener属性` も明示しなくていい
