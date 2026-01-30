import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { Res } from "../core/response";

type ValidationTarget = "body" | "query" | "params";

type ValidationSchema<
  T extends Partial<Record<ValidationTarget, ZodType<any>>>
> = T;

export const validateZod = <
  T extends Partial<Record<ValidationTarget, ZodType<any>>>
>(
  schemas: ValidationSchema<T>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated: Partial<Record<ValidationTarget, any>> = {};

      (["body", "query", "params"] as ValidationTarget[]).forEach((key) => {
        if (schemas[key]) {
          const parsedValue = schemas[key]!.parse(req[key]);
          validated[key] = parsedValue;
        }
      });

      (req as any).validated = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return Res.badRequest(res, "Validation failed", errors);
      }
      next(error);
    }
  };
};
