import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { r2 } from "@/lib/r2client";

export async function POST(request: Request) {
  try {
    const uploadBodySchema = z.object({
      fileName: z.string().min(1),
      fileContent: z.string().regex(/\w+\/[-+.\w]+/),
    });

    const body = await request.json();
    const { fileName, fileContent } = uploadBodySchema.parse(body);

    // Gera uma chave única para o arquivo
    const fileKey = uuidv4().concat("-").concat(fileName);

    // Configura o comando para o S3/R2
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: fileKey,
      ContentType: fileContent,
    });

    // Gera a URL pré-assinada
    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 600 });

    // Retorna a URL assinada
    return NextResponse.json({ signedUrl, fileKey }, { status: 200 });
  } catch (error) {
    console.error("Erro ao gerar URL pré-assinada:", error);
    return NextResponse.json(
      { error: "Falha ao gerar URL pré-assinada" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const deleteBodySchema = z.object({
      fileKey: z.string().min(1),
    });

    const body = await request.json();
    const { fileKey } = deleteBodySchema.parse(body);

    const command = new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: fileKey,
    });

    await r2.send(command);

    return NextResponse.json(
      { message: "Arquivo deletado com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao deletar o arquivo:", error);
    return NextResponse.json(
      { error: "Falha ao deletar o arquivo" },
      { status: 500 },
    );
  }
}
