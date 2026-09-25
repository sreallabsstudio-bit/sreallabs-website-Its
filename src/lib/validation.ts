import { z } from 'zod'
import { parseYouTubeUrl, isValidGoogleDriveUrl } from '@/lib/youtube'

const optionalUrl = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .nullable()
  .transform((v) => (v && v.trim() ? v.trim() : null))

export const projectCoreSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(160),
  slug: z
    .string()
    .trim()
    .max(90)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers and dashes')
    .optional()
    .nullable()
    .transform((v) => v || null),
  description: z.string().trim().min(1, 'Description is required').max(6000),
  categoryId: z.string().trim().max(64).optional().nullable().transform((v) => v || null),
  client: z.string().trim().max(160).optional().nullable().transform((v) => (v && v.trim() ? v.trim() : null)),
  industry: z.string().trim().max(120).optional().nullable().transform((v) => (v && v.trim() ? v.trim() : null)),
  youtubeUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : null))
    .refine((v) => v === null || parseYouTubeUrl(v) !== null, {
      message: 'Not a valid YouTube URL (supported: youtube.com/watch, youtu.be, shorts, embed)',
    }),
  googleDriveUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : null))
    .refine((v) => v === null || isValidGoogleDriveUrl(v), {
      message: 'Google Drive URL must start with https://drive.google.com/ or https://docs.google.com/',
    }),
  thumbnailUrl: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : null))
    .refine((v) => v === null || /^https:\/\//.test(v), {
      message: 'Thumbnail must be an https:// image URL',
    }),
  legacyVideoUrl: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : null))
    .refine((v) => v === null || /^https:\/\//.test(v), {
      message: 'Video URL must be an https:// URL',
    }),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(100000).default(0),
  service: z.string().trim().max(120).optional().nullable().transform((v) => (v && v.trim() ? v.trim() : null)),
  year: z.string().trim().max(12).optional().nullable().transform((v) => (v && v.trim() ? v.trim() : null)),
  tags: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
  fullDescription: z.string().trim().max(12000).optional().nullable().transform((v) => (v && v.trim() ? v.trim() : null)),
  challenge: z.string().trim().max(6000).optional().nullable().transform((v) => (v && v.trim() ? v.trim() : null)),
  solution: z.string().trim().max(6000).optional().nullable().transform((v) => (v && v.trim() ? v.trim() : null)),
  result: z.string().trim().max(6000).optional().nullable().transform((v) => (v && v.trim() ? v.trim() : null)),
  additionalImages: z.array(z.string().trim().url().max(1000)).max(24).default([]),
})

export const projectCreateSchema = projectCoreSchema
export const projectUpdateSchema = projectCoreSchema.partial()

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  sortOrder: z.number().int().min(0).max(10000).default(0),
  active: z.boolean().default(true),
})

export const categoryUpdateSchema = categorySchema.partial()

export const contentUpdateSchema = z.object({
  values: z.record(z.string().trim().min(1).max(80), z.string().max(5000)),
})

export const seoUpdateSchema = z.object({
  siteTitle: z.string().trim().min(1).max(200),
  metaDescription: z.string().trim().min(1).max(500),
  ogImageUrl: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : null)),
})

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z
    .string()
    .min(10, 'New password must be at least 10 characters')
    .max(200),
})

export const reorderSchema = z.object({
  projectId: z.string().min(1),
  direction: z.enum(['up', 'down']),
})
