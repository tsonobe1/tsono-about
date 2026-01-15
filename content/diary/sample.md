---
title: 'Nuxt Content サンプル'
description: 'Nuxt Contentで作成したサンプル記事です。'
date: '2026-01-11'
---

# Nuxt Content サンプル記事

Nuxt Contentを使うと、Markdownで書いた文章がそのままサイトに表示されます。
このページは **サンプル記事の詳細** を想定して、少し長めの本文を入れています。

以下のコードは「マインドマップ用ノード管理」のデモであり、実運用を想定しないサンプルです。

```ts
// Demo only — not for production use.
import { readonly, ref } from 'vue'
import { clamp } from '@/features/shared/utils/math'
import { nanoid } from 'nanoid'
import type { Node, Direction } from '@/features/mindmap/domain/node'

export class CannotAddSiblingToRootError extends Error {
  constructor(basisId: string) {
    super(`Cannot add sibling to root (basisId: ${basisId}).`)
    this.name = 'CannotAddSiblingToRootError'
  }
}

export class NotFoundNodeError extends Error {
  constructor(id: string) {
    super(`Node not found (id: ${id})`)
    this.name = 'NotFoundNodeError'
  }
}

export class CannotDeleteRootError extends Error {
  constructor(id: string) {
    super(`Cannot delete root (id: ${id})`)
    this.name = 'CannotDeleteRootError'
  }
}

export class CannotEditUnselectedNodeError extends Error {
  constructor(id: string) {
    super(`Cannot edit unselected node (id: ${id})`)
    this.name = 'CannotEditUnselectedNodeError'
  }
}

export class CannotEditTextWhenNotEditingError extends Error {
  constructor(id: string) {
    super(`Cannot edit text when not editing (id: ${id})`)
    this.name = 'CannotEditTextWhenNotEditingError'
  }
}

export class CannotMoveToDescendantError extends Error {
  constructor(id: string, newParentId: string) {
    super(
      `Cannot move node to its descendant (id: ${id}, newParentId: ${newParentId})`,
    )
    this.name = 'CannotMoveToDescendantError'
  }
}

export class CannotMoveToSelfError extends Error {
  constructor(id: string, newParentId: string) {
    super(`Cannot move node to self (id: ${id}, newParentId: ${newParentId})`)
    this.name = 'CannotMoveToSelfError'
  }
}

export class CannotMoveRootError extends Error {
  constructor(id: string, newParentId: string) {
    super(`Cannot move root (id: ${id}, newParentId: ${newParentId})`)
    this.name = 'CannotMoveRootError'
  }
}

const ROOT_ID = 'root'

function createRootNode(): Node {
  const now = new Date()
  return {
    id: ROOT_ID,
    text: '新規のマインドマップ',
    size: null,
    color: null,
    createdAt: now,
    updatedAt: now,
    parentId: null,
    childIds: [],
    direction: null,
  }
}

export function useNode(initialNodes?: Record<string, Node>) {
  const nodes = ref<Record<string, Node>>(
    initialNodes ?? { [ROOT_ID]: createRootNode() },
  )
  const selectedIds = ref<Set<string>>(new Set())
  const editingId = ref<string | null>(null)

  function generateId(): string {
    return nanoid()
  }

  /**
   * 親ID が null であるもの = ルートノードを返す
   */
  function getRoot(): Node {
    return findNode(ROOT_ID)
  }

  function setSelected(id: string, selected: boolean) {
    findNode(id)
    const next = new Set(selectedIds.value)
    if (selected) {
      next.add(id)
    } else {
      next.delete(id)
    }
    selectedIds.value = next
  }

  function addNode(parentId: string): Readonly<Node> {
    const parent = findNode(parentId)

    const newId = generateId()
    const now = new Date()
    const newNode = {
      id: newId,
      text: '',
      size: null,
      color: null,
      createdAt: now,
      updatedAt: now,
      parentId: parentId,
      childIds: [],
      direction: null,
    }
    nodes.value[newId] = newNode
    parent.childIds.push(newId)

    return newNode
  }

  function addSiblingNode(basisId: string): Readonly<Node> {
    const basis = findNode(basisId)

    const parentId = basis.parentId
    if (parentId == null) {
      throw new CannotAddSiblingToRootError(basisId)
    }

    return addNode(parentId)
  }

  /**
   * Depth first search アルゴリズムを用いて 子孫ノードのIDを収集する
   * @param id
   */
  function collectSelfAndDescendantIds(id: string): Set<string> {
    const descendants = new Set<string>()
    const stack = [id]

    // 子孫をすべて収集
    while (stack.length > 0) {
      const currentId = stack.pop()
      if (!currentId || descendants.has(currentId)) continue

      const node = nodes.value[currentId]
      if (!node) continue

      descendants.add(currentId)

      for (const childId of node.childIds) {
        stack.push(childId)
      }
    }
    return descendants
  }

  function removeFromParentChildIds(id: string) {
    const node = findNode(id)
    const parentId = node.parentId
    if (parentId != null) {
      const parent = nodes.value[parentId]
      if (parent) {
        const index = parent.childIds.indexOf(id)
        if (index !== -1) parent.childIds.splice(index, 1)
      }
    }
  }

  function deleteNode(id: string): void {
    if (id === ROOT_ID) {
      throw new CannotDeleteRootError(id)
    }

    const self = findNode(id)
    const targetIds = collectSelfAndDescendantIds(id)

    // 親の childIds から自身のIDを除去
    removeFromParentChildIds(self.id)

    // 対象と子孫の選択解除
    if (targetIds.size) {
      const next = new Set(selectedIds.value)
      for (const targetId of targetIds) {
        next.delete(targetId)
      }
      selectedIds.value = next
    }

    // 対象または子孫が編集中なら解除
    if (editingId.value && targetIds.has(editingId.value)) {
      endEdit()
    }

    for (const targetId of targetIds) {
      delete nodes.value[targetId]
    }
  }

  function findNode(id: string): Node {
    const node = nodes.value[id]
    if (!node) {
      throw new NotFoundNodeError(id)
    }
    return node
  }

  function startEdit(id: string) {
    const target = findNode(id)
    if (!selectedIds.value.has(id)) {
      throw new CannotEditUnselectedNodeError(id)
    }
    editingId.value = target.id
  }

  function endEdit() {
    editingId.value = null
  }

  function updateText(id: string, text: string) {
    if (editingId.value !== id) {
      throw new CannotEditTextWhenNotEditingError(id)
    }

    const node = findNode(id)
    if (node.text !== text) {
      node.text = text
      node.updatedAt = new Date()
    }
  }

  function moveNode(id: string, newParentId: string, insertIndex?: number) {
    if (id === ROOT_ID) {
      throw new CannotMoveRootError(id, newParentId)
    }

    if (id === newParentId) {
      throw new CannotMoveToSelfError(id, newParentId)
    }

    const newParent = findNode(newParentId)

    // 子を親にすることは不可能
    const descendants = collectSelfAndDescendantIds(id)
    if (descendants.has(newParentId)) {
      throw new CannotMoveToDescendantError(id, newParentId)
    }

    const target = findNode(id)

    // 同じ親に移動する場合は、insertIndex が指定されていれば並べ替えのみ行う
    if (target.parentId === newParentId) {
      if (insertIndex == null) return

      const parent = newParent
      // 既存の位置を除去する
      const currentIdx = parent.childIds.indexOf(id)
      if (currentIdx === -1) return
      parent.childIds.splice(currentIdx, 1)

      // 目的位置へ挿入
      const adjusted = insertIndex > currentIdx ? insertIndex - 1 : insertIndex
      const clamped = clamp(adjusted, 0, parent.childIds.length)
      parent.childIds.splice(clamped, 0, id)
      return
    }

    // 旧親の childIds から対象IDを除去
    removeFromParentChildIds(target.id)

    // 新親の childIds に追加（指定順があればその位置へ）
    const targetLength = newParent.childIds.length
    if (insertIndex == null) {
      newParent.childIds.push(id)
    } else {
      const clamped = clamp(insertIndex, 0, targetLength)
      newParent.childIds.splice(clamped, 0, id)
    }

    // 親参照と更新日時を更新
    target.parentId = newParentId
    target.updatedAt = new Date()
  }

  function setDirection(id: string, direction: Direction | null) {
    const target = findNode(id)

    // ルートなら強制null
    if (target.id === ROOT_ID) {
      target.direction = null
      return
    }

    // 親がルートではない場合、強制null
    if (target.parentId !== ROOT_ID) {
      target.direction = null
      return
    }

    target.direction = direction
  }

  return {
    nodes: readonly(nodes),
    editingId: readonly(editingId),
    selectedIds: readonly(selectedIds),
    getRoot,
    setSelected,
    addNode,
    addSiblingNode,
    deleteNode,
    findNode,
    startEdit,
    endEdit,
    updateText,
    moveNode,
    setDirection,
  }
}
```

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

これで **TypeScript としてハイライト**されます。

---

## 対応言語

Shiki 対応言語はほぼ全部使えます。

例：

- `js`, `ts`, `vue`
- `python`, `sql`, `bash`
- `json`, `yaml`
- `html`, `css` など

---

## テーマ設定（重要）

`nuxt.config.ts` で指定します。

```ts
export default defineNuxtConfig({
  content: {
    highlight: {
      theme: 'github-dark', // or 'nord', 'dracula', 'light-plus', etc.
    },
  },
})
```

→ 1行目、3–4行目が強調されます。

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
