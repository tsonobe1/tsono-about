---
title: 理解度と速度のバランスを取ったAI駆動の開発ワークフロー
date: 2026-02-20T00:00:00.000Z
description: 2026/02/20時点で良い感触のワークフロー。
kind: tech
seo:
  title: 理解度と速度のバランスを取ったAI駆動の開発ワークフロー
  description: 2026/02/20時点で良い感触のワークフロー
tags:
  - codex
  - workflow
---

AIが大量に生成するコードに圧倒されることなく、実装への理解を保ちながら、人間が主導権を握り続けるためのワークフロー。

2026/02/20時点で感触が良いものをメモしておく。

## 最初の要件定義

1. システムが満たすべき要件をリストとして列挙する
   - ここは自分で考えて手で書く。漏れや重複を少なく、エッジケースや分岐も細かく考える
   - 出来上がったアプリの動きを妄想する楽しいフェーズ
2. `Codex CLI`の plan mode で、要件定義したい旨・システムを作る目的・想定ユーザ・1.のリストを投げる
   - ディスカッションをしてヌケモレ重複を解消する
3. 作ってもらった plan を `/docs/plan` 内に配置してもらう

## 機能設計

1. phase1 の詳細度を高めた plan を、plan mode で作成する
   - 実装に近い話をディスカッションして決めていく

## 開発

1. Codex CLI に phase1 plan に対する TDD用の TODO リストを作成してもらい、`.md` に追加する
2. TODO リストをレビューする
3. TDDのループで実装を進める
   1. TODOリストから1件選ぶ
   2. Red: そのケースに対する失敗するテストを1つ追加 or 修正する -> レビュー
   3. Green: テストを通すための最小限の実装を行う -> レビュー
   4. Refactor: テストがグリーンの状態を維持したままリファクタリングする -> レビューしてもらう。
   5. lint, format, knip を実行
   6. plan を更新する
   7. コミットする
   8. 問題なければ別のTODOに進む。
4. ☝のシーケンス内では都度、質問、要件・機能・TODOのブラッシュアップを行う
5. 定期的にテストケースの構造化を行う

## 新しいセッションに入ったとき

- 上述のTDDの指示を毎回打ち込むのはめんどくさい
- また、context が圧迫してきたら plan を更新させた後 `/compact`するが、`/compact` 後はワークフローが崩れる
- そのため、上述のフローを [skills](#%E5%8F%82%E8%80%83-skills)に登録している
  - 実装中の plan と次タスクを明示して指示している

```bash
# 指示
$workflow に従って、 docs/implementation_plan_phase1-3.md の phase1.5 Case5 の続きを実装しよう
```

### 参考: skills

```md
---
name: workflow
description: Shared collaboration workflow for implementing one TODO case at a time (t-wada style classical TDD). Assumes plan and TODO list are already agreed. Includes explicit review gates and pre-commit quality checks (lint/format/knip).
---

# Workflow

## Objective

Execute implementation with a strict one-case TDD cadence, using explicit review gates and deterministic diffs.

## Preconditions

- Plan and TDD TODO list are already agreed.
- We will start from an existing TODO item.

## Invocation

When starting work, the user says:

- `$workflow に従って、{XX} の {YY} を実装していこう`

## TDD Loop (One Case Only)

1. Pick exactly one TODO case (state the TODO id/title explicitly).
2. **Red**: add or adjust one failing test for the case.
3. Ask the user to review the test intent and failing result.
4. **Green**: implement the minimum code required to pass the test.
5. Ask the user to review the implementation.
6. **Refactor** while keeping tests green.
7. Ask the user to review the refactor.
8. **Plan Update (before commit)**:
    - Reflect the implemented behavior in the plan.
    - Mark the TODO case as completed.
    - Adjust acceptance criteria if clarified during implementation.
    - Record any design decision discovered during the case.
9. **Quality Gate (before commit)**:
    - run `lint`
    - run `format`
    - run `knip`
    - if any fail: fix minimally, keep scope constrained to the same TODO case.
10. **Commit the case**.
11. Move to the next TODO case.

## Guardrails

- Do not batch multiple TODO cases in one cycle.
- TODO must follow t-wada style, classical style TDD.
    - Behavior-first.
    - Outside-in thinking only when needed.
    - Prefer state verification over interaction verification.
    - No unnecessary mocking.
- Each TODO must represent a single observable behavior.
- Test cases must be written structurally.

  Use the following structure:
    - XXをするYY
        - XX のとき YY となる

- Test case names must be written in Japanese.
- Test names must describe behavior (condition + result), not method names.
- One test = one behavior.
- Do not test multiple branches in a single test.
- Avoid implementation detail assertions.
- Keep each step observable and explain why the change is needed.
- Prefer minimal deterministic diffs.
- Pause coding and return to discussion if disagreement appears.
- If scope changes, stop and re-align TODO/acceptance before continuing.
- Do not use English identifiers in test names unless domain terminology requires it.

- The plan must be updated before every commit.
- Implementation and plan must remain consistent.
- No commit without plan alignment.

## Commit Rules

- Commit only after completing Red → Green → Refactor and passing the Quality Gate.
- Use short imperative commit messages with prefixes such as `test`, `fix`, `refactor`, `docs`, `add`.
- Keep unrelated changes out of the commit.
```

効果的だと感じる文面は、`TODO must follow t-wada style, classical style TDD.`。

## 意識していること

1. 異なる粒度の計画書を作成し、更新し続ける
   - 進捗把握がしやすくなる
2. 1テストケース単位でコミットすることでPR粒度を小さくする
   - 実装の理解度を高められる
   - やりとりの頻度は増えるが、レビュー負荷が少なくなる
3. 最初にシステムが満たすべき要件を自分で書いておく
   - 一番重要かもしれない
   - 事前に必要な条件をしっかりと考えて抜いて頭に入れておくと、AIが書いたコードの妥当性をスムーズに判断できる
