import React from 'react';

import { getErrorText } from '@/lib';

import { TDocBuffer } from '../helpers';
import { isValidDocxBuffer } from '../helpers/docxConverter';
import { mergeDocxBuffers } from '../helpers/docxMerger';
import type { MergeError, MergeProgress } from '../types';

type TMergeDocumentsParams = { buffers: ArrayBuffer[]; documentTitle?: string };
type TMergeDocumentsResult = Promise<Blob | undefined>;
type TMergeDocuments = (params: TMergeDocumentsParams) => TMergeDocumentsResult;

interface UseDocxMergeReturn {
  mergeDocuments: TMergeDocuments;
  isMerging: boolean;
  progress?: MergeProgress;
  error?: MergeError;
  reset: () => void;
}

export const useDocxMerge = (): UseDocxMergeReturn => {
  const [isMerging, setIsMerging] = React.useState(false);
  const [progress, setProgress] = React.useState<MergeProgress | undefined>(undefined);
  const [error, setError] = React.useState<MergeError | undefined>(undefined);

  const reset = React.useCallback(() => {
    setError(undefined);
    setProgress(undefined);
    setIsMerging(false);
  }, []);

  const mergeDocuments = React.useCallback(
    async ({ buffers, documentTitle }: TMergeDocumentsParams): TMergeDocumentsResult => {
      if (!buffers.length) {
        const message = 'No documents provided for merging';
        // eslint-disable-next-line no-console
        console.error('[useDocxMerge:mergeDocuments]', message);
        debugger; // eslint-disable-line no-debugger
        setError({ message });
        return undefined;
      }

      setIsMerging(true);
      setError(undefined);

      try {
        // Validate buffers
        for (let i = 0; i < buffers.length; i++) {
          setProgress({ current: i, total: buffers.length });

          if (!isValidDocxBuffer(buffers[i])) {
            throw new Error(`Invalid DOCX format at index ${i}`);
          }
        }

        setProgress({ current: buffers.length, total: buffers.length });

        // Perform merge
        const mergedBlob = await mergeDocxBuffers(buffers, {
          pageBreakBetween: true,
          documentTitle: documentTitle || `Merged_${Date.now()}`,
          // orientation: 'portrait',
        });

        return mergedBlob;
      } catch (error) {
        const message = getErrorText(error);
        // eslint-disable-next-line no-console
        console.error('[useDocxMerge:mergeDocuments]', message, {
          error,
        });
        debugger; // eslint-disable-line no-debugger
        const mergeError: MergeError = {
          message,
          originalError: error,
        };
        setError(mergeError);
        return undefined;
      } finally {
        setIsMerging(false);
        setProgress(undefined);
      }
    },
    [],
  );

  return { mergeDocuments, isMerging, progress, error, reset };
};
