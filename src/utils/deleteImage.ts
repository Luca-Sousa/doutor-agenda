import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { r2 } from "@/lib/r2client";

export const deleteFileFromBucket = async (fileKey: string) => {
  try {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET!,
        Key: fileKey,
      }),
    );

    return true;
  } catch (error) {
    console.error("Erro ao deletar o arquivo:", error);
    throw new Error("Erro ao deletar o arquivo");
  }
};
