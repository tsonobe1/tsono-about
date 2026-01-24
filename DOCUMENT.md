# Asset Optimization Guidelines

## 画像（JPEG / PNG / WebP）

- アップロード前に最大幅 1600px 程度へリサイズし、`pngquant` などで可逆圧縮してから `public/images` へ配置します。
- 写真は可能な限り WebP/AVIF に変換し、Markdown では `/images/.../*.webp` を参照。`<NuxtImg>` がさらにリサイズするため、元データも軽いほどビルド/変換が安定します。

## GIF / アニメーション

- アニメーション GIF はそのまま Nuxt Image で最適化されないため、`ffmpeg` で MP4/WebM に変換して `<video>` で埋め込む。
- その場合も元 GIF を `public/images` に残しておくと、フォールバック `<img>` として利用できます。

## テスト方針

- 単体テストは原則 Vitest を使用し、Arrange / Act / Assert が分かる「古典学派」スタイルで記述します。
- テストケースの説明文やコメントは日本語にし、意図がコードだけで伝わるようにします。
- モックは外部ツールやデータベースへのアクセスなど、不可避なケースに限定します。
