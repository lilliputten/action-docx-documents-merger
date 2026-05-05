import { TDocData } from './fetchDocBuffer';

export function bufferToBlob(
  buffer: TDocData,
  mimeType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
): Blob {
  // Handle ArrayBufferLike by converting to a safe Uint8Array
  const uint8Array = new Uint8Array(buffer);
  return new Blob([uint8Array], { type: mimeType });
}
