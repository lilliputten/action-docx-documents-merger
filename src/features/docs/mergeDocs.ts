import { mergeDocx } from '@benedicte/docx-merge';
// import DocxMerger from '@valentiniljaz/docx-merger';

// import * as htmlDocx from 'html-docx-js';
// import mammoth from 'mammoth';

import { TDocTypeId } from '@/features/docType';
import { getErrorText } from '@/lib';

import { fetchDocBuffer } from './helpers';

export async function mergeDocs(ids: TDocTypeId[]) {
  const docsCount = ids.length;
  if (!docsCount) {
    throw new Error('Не заданы исходные документы');
  }
  const promises = ids.map((id) => fetchDocBuffer(id));
  try {
    const results = await Promise.all(promises);
    console.log('[mergeDocs:loaded]', {
      docsCount,
      results,
      promises,
      ids,
    });
    debugger;
    if (docsCount === 1) {
      return results[0];
    }
    const file1 = results[0];
    const file2 = results[1];
    /* // METHOD 1
     * const docx = new DocxMerger();
     * await docx.initialize({}, [file1, file2]);
     * // SAVING THE DOCX FILE
     * const result = await docx.save('nodebuffer');
     */
    // METHOD 2
    // @see https://www.npmjs.com/package/@benedicte/docx-merge
    const result = mergeDocx(file1, file2, {});
    console.log('[mergeDocs:done]', {
      promises,
      ids,
    });
    debugger;
    return result;
  } catch (error) {
    const message = 'Ошибка объединения документов';
    const details = getErrorText(error);
    const comboMsg = [message, details].join(': ');
    // eslint-disable-next-line no-console
    console.error('[mergeDocs]', comboMsg, {
      message,
      details,
      error,
      ids,
    });
    debugger; // eslint-disable-line no-debugger
    throw new Error(comboMsg);
  }
}
