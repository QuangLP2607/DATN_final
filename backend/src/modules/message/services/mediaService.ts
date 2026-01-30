import { Types } from "mongoose";
import { MessageMediaModel } from "../../../models/MessageMedia";
import { IMedia } from "../../../interfaces/media";
import { fetchS3Url } from "../../../utils/s3UrlCache";
import { MessageMediaDTO } from "../dto";

const mediaService = {
  attachMediaToMessage: async (
    media_ids: string[],
    message_id: Types.ObjectId
  ): Promise<MessageMediaDTO[]> => {
    const mediaDocs = await MessageMediaModel.find({
      media_id: { $in: media_ids.map((id) => new Types.ObjectId(id)) },
    })
      .populate<{ media_id: IMedia }>(
        "media_id",
        "file_key file_name file_type"
      )
      .lean();

    const media: MessageMediaDTO[] = await Promise.all(
      mediaDocs.map(async (m) => ({
        id: m.media_id._id.toString(),
        type: m.media_id.file_type === "image" ? "image" : "file",
        filename: m.media_id.file_name,
        url: m.media_id.file_key ? await fetchS3Url(m.media_id.file_key) : "",
      }))
    );

    // gắn vào message_id
    await Promise.all(
      mediaDocs.map((m) =>
        MessageMediaModel.updateOne({ _id: m._id }, { message_id })
      )
    );

    return media;
  },
};

export default mediaService;
