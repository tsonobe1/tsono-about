# tsono-about

## Development

```bash
pnpm install
pnpm dev
```

## Nuxt Studio

- このプロジェクトは `nuxt-studio` を導入済みです。
- `studio` のルートは `/_studio` です（`nuxt.config.ts`）。

### 開発モード（認証不要）

- 開発中は認証なしで Studio を使えます。
- まず通常ページ（例: `/`）を開き、左下の Studio ボタンから起動してください。
- `/_studio` を直接開くと認証ルートに入り、`No authentication provider found` が出る場合があります。

### 本番モード（認証必須）

- 本番で Studio を使う場合は OAuth 設定が必要です。
- 例: GitHub OAuth の環境変数
  - `STUDIO_GITHUB_CLIENT_ID`
  - `STUDIO_GITHUB_CLIENT_SECRET`
