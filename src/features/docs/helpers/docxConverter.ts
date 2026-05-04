import mammoth from 'mammoth';

import { getErrorText } from '@/lib';

/**
 * Converts DOCX ArrayBuffer to HTML string
 */
export const convertDocxToHtml = async (
  buffer: ArrayBuffer,
  fileName?: string,
): Promise<string> => {
  try {
    const result = await mammoth.convertToHtml({ arrayBuffer: buffer });

    if (result.messages.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(`Conversion warnings for ${fileName || 'document'}:`, result.messages);
    }

    return result.value;
  } catch (error) {
    throw new Error(
      `Failed to convert DOCX to HTML${fileName ? ` (${fileName})` : ''}: ${getErrorText(error)}`,
    );
  }
};

/**
 * Converts multiple DOCX buffers to HTML strings
 */
export const convertMultipleDocxToHtml = async (
  buffers: ArrayBuffer[],
  fileNames?: string[],
): Promise<string[]> => {
  const conversions = buffers.map((buffer, index) => convertDocxToHtml(buffer, fileNames?.[index]));
  return Promise.all(conversions);
};

/**
 * Validates if buffer is a valid DOCX file by checking magic numbers
 */
export const isValidDocxBuffer = (buffer: ArrayBuffer): boolean => {
  const uint8Array = new Uint8Array(buffer);
  // DOCX files start with PK (0x50 0x4B) - ZIP file signature
  return uint8Array[0] === 0x50 && uint8Array[1] === 0x4b;
};
