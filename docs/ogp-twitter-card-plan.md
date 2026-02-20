# OGP/Twitterカード対応計画（Nuxt 3 / 全ページ）

## Summary

X(Twitter) などでURL共有時に安定してカード表示されるよう、`title/description` に加えて `og:image`・`twitter:card`・`og:url`・`canonical` を全ページで統一設定する。  
記事/日記は frontmatter で `ogImage` を任意指定できるようにし、未指定時は専用の共通画像を使う。

## Public API / Interface 変更

1. `runtimeConfig.public` に `siteUrl` を追加する。  
   既定値: `https://about.tsono.dev`。環境変数: `NUXT_PUBLIC_SITE_URL`。
2. コンテンツスキーマに `ogImage?: string` を追加する。  
   対象: `article`, `diary` コレクション。
3. 共通OGP画像を追加する。  
   パス: `public/images/og/default.png`（1200x630推奨）。

## 実装詳細（決定済み）

1. `utils/seo.ts` を新設し、以下を一元化する。  
   `toAbsoluteUrl(path, siteUrl)`・`resolveOgImage(imagePath, fallbackPath, siteUrl)`・`buildPageSeoMeta(...)`。
2. `nuxt.config.ts` を更新する。  
   `runtimeConfig.public.siteUrl` 追加。`app.head` に最小共通値（`og:site_name`, `twitter:card` の既定）を設定。
3. 記事詳細ページ `pages/[...slug].vue` を更新する。  
   既存 `useSeoMeta` を拡張し、`ogType`（`article`）、`ogUrl`、`ogImage`、`twitterImage`、`twitterCard`（画像あり時は `summary_large_image`）を設定。  
   `useHead` で canonical を設定。
4. その他ページ（`/`, `/articles`, `/diary`, `/career`, `/about`, `/gallery`）にも `useSeoMeta` と canonical を追加する。  
   ページごとに title/description を明示し、画像は共通fallbackを利用。
5. `content.config.ts` に `ogImage` フィールドを追加し、既存記事は無変更で動く後方互換にする。
6. サンプルとして1件の `content/articles/*.md` に `ogImage` を設定し、記事ごとの上書きが機能することを確認する。

## テストケース / 検証シナリオ

1. ユニットテスト（新規 `tests/seo.spec.ts`）  
   `siteUrl` と相対パスから絶対URLを正しく生成できる。  
   `ogImage` 指定あり/なしで期待URLが切り替わる。  
   末尾スラッシュや空値を正規化できる。
2. 既存テスト実行  
   `pnpm test` が通ること。
3. ビルド確認  
   `pnpm generate` 後、生成HTMLに `og:image`、`twitter:card`、`og:url`、canonical が入ること（対象ページを複数確認）。
4. 手動確認  
   X Card Validator / Facebook Sharing Debugger でカード表示を確認（記事1件、トップ1件）。

## Assumptions / Defaults

1. 正式ドメインは `https://about.tsono.dev` を使用する。
2. fallback画像は専用新規作成 `public/images/og/default.png` を使用する。
3. `ogImage` は `article` と `diary` のみ対応し、他コレクションは共通画像で十分とする。
4. locale は当面 `ja_JP` を前提にし、多言語対応は対象外。
5. Twitterアカウント（`twitter:site`）は未設定のままにする（必要になれば追加入力）。
