import AppError from "../../core/AppError";
import { Types } from "mongoose";
import { MessageMediaModel } from "../../models/MessageMedia";
import { MediaModel } from "../../models/Media";
import { CreateMessageMediaInput } from "./dto/create";
import { DeleteMessageMediaInput } from "./dto/delete";
import s3 from "../../config/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const BUCKET = process.env.AWS_BUCKET_NAME!;

export default {
  // -------------------- create message media --------------------
  create: async (data: CreateMessageMediaInput) => {
    const docs = data.media_ids.map((mediaId) => ({
      message_id: new Types.ObjectId(data.message_id),
      media_id: new Types.ObjectId(mediaId),
    }));

    try {
      await MessageMediaModel.insertMany(docs, { ordered: false });
    } catch (err: any) {
      if (err.code !== 11000) throw err;
    }

    return { message_id: data.message_id };
  },

  // -------------------- delete message media --------------------
  delete: async (data: DeleteMessageMediaInput) => {
    const deleted = await MessageMediaModel.findOneAndDelete({
      message_id: new Types.ObjectId(data.message_id),
      media_id: new Types.ObjectId(data.media_id),
    });

    if (!deleted) {
      throw AppError.notFound("MessageMedia not found");
    }

    const count = await MessageMediaModel.countDocuments({
      media_id: deleted.media_id,
    });

    if (count === 0) {
      const media = await MediaModel.findById(deleted.media_id);
      if (media) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: media.file_key,
          })
        );
        await media.deleteOne();
      }
    }

    return { message_id: data.message_id, media_id: data.media_id };
  },
};
