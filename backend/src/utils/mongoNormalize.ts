import type { Document } from "mongoose";

export function normalizeMongo<T extends { _id: any; __v?: number }>(doc: T) {
  const { _id, __v, ...rest } = doc;

  return {
    id: _id.toString(),
    ...rest,
  };
}

export function normalizeMongoDoc<T extends Document>(doc: T) {
  const obj = doc.toObject();
  const { _id, __v, ...rest } = obj;
  return { id: _id.toString(), ...rest } as Omit<T, "_id" | "__v"> & {
    id: string;
  };
}

export function normalizeMongoList<T extends { _id: any; __v?: number }>(
  docs: T[]
) {
  return docs.map(normalizeMongo);
}
