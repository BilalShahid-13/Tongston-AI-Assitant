import { ZodArray, ZodBoolean, ZodNumber, ZodString, type ZodObject } from "zod";

export const resetPlanValues = (schema: ZodObject<any>): Record<string, any> => {
  const shape = schema.shape;
  const emptyValues: Record<string, any> = {};

  for (const key in shape) {
    const field = shape[key];
    if (field instanceof ZodString) emptyValues[key] = "";
    else if (field instanceof ZodArray) emptyValues[key] = [];
    else if (field instanceof ZodNumber) emptyValues[key] = 0;
    else if (field instanceof ZodBoolean) emptyValues[key] = false;
    else emptyValues[key] = undefined;
  }

  return emptyValues;
};