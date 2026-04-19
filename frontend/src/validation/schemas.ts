import { z } from 'zod';

export const postTitleSchema = z.string().min(1).max(200);
export const postContentSchema = z.string().min(1);