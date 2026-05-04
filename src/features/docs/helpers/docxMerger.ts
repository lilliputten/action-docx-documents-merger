import { Document, Packer, PageBreak, Paragraph, TextRun } from 'docx';

import { getErrorText } from '@/lib';

/**
 * Extract text content from DOCX buffer using mammoth library
 */
const getDocumentContent = async (buffer: ArrayBuffer): Promise<string> => {
  try {
    // Use mammoth library to extract text from DOCX
    const mammoth = await import('mammoth');

    // Convert ArrayBuffer to buffer format that mammoth can read
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });

    if (result.value && result.value.trim()) {
      // Clean up the extracted text
      const content = result.value
        .trim()
        // Remove excessive whitespace
        .replace(/\s+/g, ' ')
        // Remove empty lines
        .replace(/^\s*[\r\n]/gm, '');

      // Limit content length for practical usage
      return content.length > 500 ? content.substring(0, 500) + '...' : content;
    }

    // Fallback if no content extracted
    return `Document (${buffer.byteLength} bytes) - No readable text content found`;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[docxMerger:getDocumentContent] Error extracting DOCX content:', {
      error,
      bufferSize: buffer.byteLength,
    });

    // Fallback if mammoth parsing fails
    return `Document (${buffer.byteLength} bytes) - Unable to extract content`;
  }
};

/**
 * Merge multiple DOCX documents without HTML conversion
 */
export const mergeDocxBuffers = async (
  buffers: ArrayBuffer[],
  options?: {
    pageBreakBetween?: boolean;
    documentTitle?: string;
  },
) => {
  const { pageBreakBetween = true, documentTitle = 'Merged Document' } = options || {};

  try {
    // Create document sections for each input document
    const children = [
      // Title
      new Paragraph({
        children: [
          new TextRun({
            text: documentTitle,
            bold: true,
            size: 32,
          }),
        ],
        alignment: 'center',
        spacing: { after: 400 },
      }),
      // Blank line
      new Paragraph({
        children: [new TextRun('')],
      }),
    ];

    // Add content from each document
    for (let i = 0; i < buffers.length; i++) {
      const content = await getDocumentContent(buffers[i]);

      // Add document header
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Document ${i + 1}:`,
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 200 },
        }),
      );

      // Add document content
      children.push(
        new Paragraph({
          children: [new TextRun(content)],
          spacing: { after: 200 },
        }),
      );

      // Add page break if needed and not the last document
      if (pageBreakBetween && i < buffers.length - 1) {
        children.push(
          new Paragraph({
            children: [new PageBreak()],
          }),
        );
      }
    }

    // Create the final document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    });

    // Generate the buffer
    return Packer.toBlob(doc);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[docxMerger:mergeDocxBuffers] Error merging DOCX documents:', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw new Error('Failed to merge documents: ' + getErrorText(error));
  }
};
