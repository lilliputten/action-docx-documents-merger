import { docxMimeType } from '@/constants';

import { TDocData } from './fetchDocBuffer';

export function bufferToBlob(buffer: TDocData, mimeType: string = docxMimeType): Blob {
  // Handle ArrayBufferLike by converting to a safe Uint8Array
  const uint8Array = new Uint8Array(buffer);
  return new Blob([uint8Array], { type: mimeType });
}
