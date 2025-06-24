import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

import { r2 } from "@/lib/r2client";

export const handleFileUpload = async (
  file: File,
): Promise<string | undefined> => {
  try {
    // Gera um nome único para o arquivo
    const fileKey = `${randomUUID()}-${file.name}`;

    // Lê o conteúdo do arquivo (File para Buffer)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Faz upload direto para o bucket
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET!,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    // Retorna a URL pública do arquivo
    return `https://pub-85b5d9237221411490c4639bf19cd4f0.r2.dev/${fileKey}`;
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return undefined;
  }
};
