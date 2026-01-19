---
title: '開発環境現状確認 2026'
date: '2026-01-18'
kind: 'tech'
tags:
  - environment
summary: '2026年時点での開発環境メモ。'
---

## OS

仕事は Windows と Ubuntu（WSL2） 。プライベートで macOS と Rasbian。

Windows 環境で開発していたが、昨年 WSL に移行した。docker も Ubuntu の docker engine を使うようになった。
使い慣れた Linuxコマンドも使えるし、エイリアスも使いまわせるしで快適に。
ファイルシステムの都合か、動作も早い。

ラズパイ は immich で家族写真を管理したり、ファイル共有のハブとして使用。
[immich](https://immich.app)
その他、プライベートにまつわる全ては M1 の MacBook Air で完結。後続の Apple シリコンも気になるが、M1 で快適に使えてしまっている。

## エディタ

JetBrainIDEを使っている。
オールインワンで揃っているので開発のとっかかりが楽でいい。
DataGrid すき。

## AI

CodexCLI はプライベートな開発用。GeminiCLIはコードリーディングに使用。ChatGPTは汎用。
仕事では ChatGPT にコンテキストと目的を投げてコピペ。疑問があれば更問して納得してからコピペ。そして手直し。
自分が説明できる状態でPRを出したいのでそんな感じの使い方。使わないほうが早いこともしばしば。

プライベートでは CodexCLI に書かせてから手動で修正。CodeRabbit CLI でレビューして...という感じ。MCPは全解除してしまった。

CodeRabbit、すき

また、NotebookLM を Podcast 生成用に使用。知りたいことを放り込んで音声化しておけば、育児や家事の合間に聞けるので重宝している。
子供ができてからまとまった時間が取れなくなってきたので、暇な耳に流し込む情報を自分で増やせるのはありがたい。
2025年末の月980円で使えるキャンペーンに乗っかったので、たくさん生成できてうれしい。

## シェル

windows は powershell。mac は fish shell を使っている。
fish は昔いれたままなんの手入れもしておらず。Bash互換じゃない点に不便を感じることもあるので、zsh にしようか悩み中。

## ターミナル

iTerm2、色々試したが変わらず。tmuxと共に使用。
ホットキーで開いたり隠したり。

## dotfile

まったく手入れができていない。
iMac → Intel Mac → M1 という遍歴だが、毎回初期化して新規一点環境を作り直してしまうので...

## ランチャー

Raycast 。ランチャー兼クリップボード管理ツールとして使っている

## TODO管理

Emacs の orgモード。
事前にタスク分割をガッツリやるタイプの人間。毎タスクを時間計測している。見積もりを設定しておき、タスクを `DONE` にした時の差分が前後10分ある場合は、要因の入力を求めるようにカスタマイズまでしている。

大幅に差がある時は、だいたい設計理解や達成条件が甘いことが多い。

また、ストーリーポイントによる見積もりができるよう設定をいじっている。

## 日報

Emacs。 `clocktable` で 1日の終わりにその日の実行タスクを列挙する。
社内日報に書くネタを拾い、そのまま org mode で記述 → markdown にエクスポートしてSlackに提出するワークフローになっている。

## ノートテイキング

Emacs の org-roam を使っている。
[Org-roam](https://www.orgroam.com)
いわゆる Zettelkasten[^zettelkasten] でメモが取れるプラグイン。2024年にエンジニアに転職した時から愛用。
勉強やら仕事やらプライベートやらの全てをぶちこんでいる。

ちなみに Emacs の設定は 2024年初頭の ChatGPT によるバイブコーディングによるものなので、酷い有様。いつか手を入れたい。

## PC間でのデータ共有

Syncthingを利用。前述のEmacsによるノート、タスクなどの諸々を同期。仕事に関するものは共有しないよう除外設定をしている。
常にラズパイがハブとなっているため、WindowsとMac の片方だけ開いている状態でも問題なく同期可能。データにコンフリクトは起きない。

## キーボード・マウス

2020年6月4日に購入した Keychron K2 を愛用中。アルミフレームの茶軸です。
[Keychron K2ワイヤレスメカニカルキーボード（バージョン2）（US ANSI 配列）](https://keychron.co.jp/products/keychron-k2-wireless-mechanical-keyboard?srsltid=AfmBOoof9j6ujHbCFJSEyFoaCraTkC9bViAujTojQ9qhnacrcTYElYeI)
転職前は自前の Macbook に繋いでいたが、今はほぼ Windows 専属に。

kinesis advantage 360 がほしい。
マウスは Logicool の M575 を使用。

## モニター

LG 27MP89HM-S をメインに使用。右側に BoYata のノートPCスタンドを置き、その上に Windows を置いている。
[BoYata ノートパソコンスタンド](https://www.amazon.co.jp/dp/B07H774Q42?ref_=ppx_hzsearch_conn_dt_b_fed_asin_title_4)

左側には モバイルディスプレイを縦置きしているので 3画面状態。
[cocopar15.6インチ](https://www.amazon.co.jp/dp/B083RFYZGW?ref_=ppx_hzsearch_conn_dt_b_fed_asin_title_2&th=1)
[KUUVAN タブレット スタンド](https://www.amazon.co.jp/dp/B0CMTQ51H2?ref_=ppx_hzsearch_conn_dt_b_fed_asin_title_2)

[^zettelkasten]: ノートテイキングの手法の一つ。情報を小さな単位で分割し、それらを相互にリンクさせることで知識のネットワークを構築する方法論。[参考](https://dev.classmethod.jp/articles/intro-zettelkasten-and-emacs-org-roam/)
