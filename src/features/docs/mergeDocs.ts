import { TDocTypeId } from '@/features/docType';
import { getErrorText } from '@/lib';

import { fetchDocBuffer } from './fetchDocBuffer';

export async function mergeDocs(ids: TDocTypeId[]) {
  const promises = ids.map((id) => fetchDocBuffer(id));
  try {
    const results = await Promise.all(promises);
    console.log('[mergeDocs:loaded]', {
      results,
      promises,
      ids,
    });
    debugger;
    return results;
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
