import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    // 記事
    article: defineCollection({
      type: 'page',
      source: 'articles/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.date(),
        kind: z.enum(['tech', 'craft', 'essay']),
        tags: z.array(z.string()).optional(),
        summary: z.string().optional(),
      }),
      indexes: [{ columns: ['date'] }, { columns: ['kind'] }],
    }),

    // 2. 日記
    diary: defineCollection({
      type: 'page',
      source: 'diary/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.date(),
        category: z.enum(['movie', 'life', 'other']).optional(),
        description: z.string().optional(),
      }),
      indexes: [{ columns: ['date'] }],
    }),

    // 3. 作品
    portfolio: defineCollection({
      type: 'data',
      source: 'portfolio/**/*.yml',
      schema: z.object({
        title: z.string(),
        type: z.enum(['diy', 'music', 'app', 'design', 'other']),
        year: z.number(),
        url: z.string().optional(),
        description: z.string().optional(),
        // 表示制御用
        featured: z.boolean().optional(),
        order: z.number().optional(),
        // 画像を使うなら
        cover: z.string().optional(),
        gallery: z.array(z.string()).optional(),
      }),
      indexes: [{ columns: ['type'] }, { columns: ['year'] }],
    }),

    // 4. 職務経歴書
    career: defineCollection({
      type: 'page',
      source: 'career/index.md',
      schema: z.object({
        title: z.string().optional(),
        updatedAt: z.date().optional(),
      }),
    }),
  },
})
