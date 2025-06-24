"use client";

import { CloudUploadIcon } from "lucide-react";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type FileOrUrl = File | string;

type FileUploaderProps = {
  files: FileOrUrl[] | null;
  onChange: (files: FileOrUrl[]) => void;
};

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const convertFileToUrl = (file: FileOrUrl): string => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return file; // string URL
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);
    },
    [onChange],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border-border bg-secondary mx-auto flex size-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed"
    >
      <input {...getInputProps()} />
      {files && files.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          alt="Imagem"
          width={1000}
          height={1000}
          className="size-56 overflow-hidden rounded-2xl object-cover object-top"
        />
      ) : (
        <>
          <CloudUploadIcon size={40} className="text-primary" />
          <p className="text-dark-600 max-w-32 gap-2 text-center text-xs">
            <span className="text-primary font-semibold">
              Click para fazer upload
            </span>{" "}
            ou arraste e solte a imagem aqui
          </p>
        </>
      )}
    </div>
  );
};

export default FileUploader;
