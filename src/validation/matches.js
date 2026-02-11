import { z } from 'zod';

// Match status constants
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

// Helper to validate ISO date strings
const isoDateString = z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  { message: 'Invalid ISO date string' }
);

// Query schema for listing matches
export const listMatchesQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional(),
});

// Param schema for match ID
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Schema for creating a match
export const createMatchSchema = z
  .object({
    sport: z.string().min(1, 'Sport is required'),
    homeTeam: z.string().min(1, 'Home team is required'),
    awayTeam: z.string().min(1, 'Away team is required'),
    startTime: isoDateString,
    endTime: isoDateString,
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time must be after start time',
        path: ['endTime'],
      });
    }
  });

// Schema for updating match score
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
