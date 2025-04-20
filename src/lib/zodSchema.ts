import {z } from "zod"

export const postSchema = z.object({
  patientName: z.string(),
  testType: z.string(),
  result: z.string(),
  notes: z.string().nullable().optional(),
})

export const putSchema = z.object({
  testType: z.string(),
  result: z.string(),
  notes: z.string().nullable().optional(),
})

export const idSchema = z.object({
  id: z.string(),
})

export const getSchema = z.object({
  id: z.string(),
})

