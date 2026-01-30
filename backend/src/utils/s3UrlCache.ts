import s3 from "../config/s3";
import { redis } from "../config/redis";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const CACHE_TTL = Number(process.env.AWS_EXPIRES_IN);

export async function fetchS3Url(key: string): Promise<string> {
  // check cache
  const cached = await redis.get(key);
  if (cached) return cached;

  // generate signed URL
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME!, Key: key }),
    { expiresIn: CACHE_TTL }
  );

  // store in cache
  await redis.set(key, url, "EX", CACHE_TTL);

  return url;
}
