import { z, ZodRawShape, ZodObject } from "zod";

// --------------------- ObjectId ---------------------
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

export const paramIdSchema = (field = "id") =>
  z.object({ [field]: objectIdSchema });

// --------------------- Email ---------------------
export const emailSchema = z.string().email({ message: "Invalid email" });

// --------------------- Password ---------------------
export const passwordSchema = z
  .string()
  .min(6, { message: "Password too short" });

// --------------------- Username ---------------------
export const usernameSchema = (min = 3, max = 50) =>
  z.string().trim().min(min, { message: `Username too short` }).max(max);

// --------------------- Phone ---------------------
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^(?:0(?:3|5|7|8|9)\d{8}|\+[1-9]\d{1,14})$/, {
    message:
      "Invalid phone number. Must be VN local (0901234567) or international E.164 (+84901234567)",
  });

// --------------------- Time string HH:mm ---------------------
export const timeStringSchema = z.preprocess(
  (arg) => {
    if (typeof arg !== "string") return arg;
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(arg);
    if (!match) return arg;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours * 60 + minutes;
  },
  z.number().min(0).max(1439, "Time must be between 00:00 and 23:59"),
);

// --------------------- ISO Date ---------------------
export const isoDateSchema = z.preprocess(
  (arg) => {
    if (typeof arg === "string") {
      const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!isoRegex.test(arg)) return arg;
      return new Date(arg);
    }
    if (arg instanceof Date) return arg;
    return arg;
  },
  z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid date format",
  }),
);

// --------------------- Optional string with min/max ---------------------
export const stringSchema = (fieldName = "This field", min = 1, max = 255) =>
  z
    .string()
    .trim()
    .min(min, { message: `${fieldName} must be at least ${min} characters` })
    .max(max, { message: `${fieldName} must be at most ${max} characters` });

// --------------------- Pagination query ---------------------
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().trim().min(1).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z
    .string()
    .trim()
    .max(255, { message: "Search query too long" })
    .optional(),
});

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --------------------- mime type  ---------------------
export const mimeTypeSchema = z.string().refine(
  (v) => {
    if (!v) return false;
    const [type] = v.split("/");
    const allowedTopLevel = ["video", "image", "application", "audio", "text"];
    return allowedTopLevel.includes(type);
  },
  { message: "Invalid MIME type" },
);

// --------------------- Non-empty object ---------------------
export const nonEmptyObject = <T extends ZodRawShape>(schema: ZodObject<T>) =>
  schema.refine(
    (data) =>
      Object.keys(data).some(
        (key) => data[key as keyof typeof data] !== undefined,
      ),
    { message: "At least one field must be provided" },
  );
