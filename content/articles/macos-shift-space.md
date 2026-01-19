---
title: 'macOSでshift + spaceを使って入力ソースを切りかえる'
summary: 'macOSでショートカットに"shift + space"を割り当てる方法。'
kind: 'tech'
date: 2025-07-02T00:00:00+09:00
tags:
  - 'macOS'
---

## Summary

1. `open ~/Library/Preferences/com.apple.symbolichotkeys.plist`
2. `Root` &gt; `AppleSymbolicHotKeys` &gt; `61` &gt; `value` &gt; `parameters`
3. `item 2` を `131072` に設定する
4. PCを再起動
5. `システム設定` -&gt; `キーボード` -&gt; `キーボードショートカット` -&gt; `入力ソース` に `shift + space` が設定されていることを確認
6. `shift + space` で入力ソースを切り替えられることを確認

## 経緯

昨年から仕事で Windows を使うようになり、以前から私物の M1 MacBook Air で愛用していた `Keycron k2(英字キー)` をWindowsにもつなぐようになった。

英字配列のため IME の `日本語⇔英語` 切り替えに設定が必須。
macでは `control + space` で変換していた（`caps lock` を `control` に置き換えて）

![macOSでの切り替え方法](/images/articles/macos-shift-space/figures/mac-key.webp)

ところがWindowsだと（経緯は忘れたが）同様の設定ができず、結局 `shift + space` で運用することとした。

![Windowsでの切り替え方法](/images/articles/macos-shift-space/figures/win-key.webp)

仕事用PCのほうが使用率が高いのでいつの間にか手癖が変わってしまい、mac使用時に `shift + space` を押してしまうタイプミスが頻発。
作業にならないので、入力ソースを切り替えるためのショートカットを変更しようとしたが...

## shift + space のキーボードショートカットを設定できない

当方 `macOS 15.5` だが、`システム設定 → キーボード → キーボードショートカット` で `shift + space` が設定できない。
打ち込んでも反応しない。

![システム設定 > キーボード > キーボードショートカット](/images/articles/macos-shift-space/figures/settings-shortcut.webp)

そこで調べていたところ、以下を記事を発見

[macOS 한영전환키를 Shift+Space로 설정하기 (feat. Sonoma)](https://seorenn.tistory.com/547)

やはり `shift + space` は設定できないようだが、解決策が書いてある。

`com.apple.symbolichotkeys.plist` ファイルの中にある、 `AppleSymbolicHotkeys` のうち

- 60番が `前の入力ソースを選択`
- 61番が `次の入力ソースを選択`

に該当し、Item2 の値を `131072` というキーコードに書き換えることで `shift + space` を登録できる模様。

![com.apple.symbolichotkeys.plist変更後](/images/articles/macos-shift-space/figures/plist.webp)

試してみたところ、PCを再起動することで入力ソース切り替えのショートカットに `shift + space` が反映された 🙌

![システム設定 > キーボード > キーボードショートカット](/images/articles/macos-shift-space/figures/shortcut-confirm.webp)

これで、同じ使い心地で日本語と英語を切り替えられて快適。

元記事でも言及されているが、なぜショートカットに `shift + space` が登録できなんだろう。
（ほかアプリのショートカットとバッティングする可能性が高いとか？）

今のところ、常駐させているアプリケーション（Emacs, iTerm）とは衝突しておらず、問題なく使えている。
