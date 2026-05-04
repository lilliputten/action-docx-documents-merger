import { getDocTypeIdentString, TDocTypeId } from '@/features/docType';

const docUrlPrefix = './docs/';
const docExt = '.docx';

export type TDocCachedBuffers = Partial<Record<TDocTypeId, ArrayBuffer>>;

const cachedBuffers: TDocCachedBuffers = {};

export async function fetchDocBuffer(id: TDocTypeId) {
  const url = `${docUrlPrefix}${id}_${docExt}`;
  const cachedData = cachedBuffers[id];
  console.log('[fetchDocBuffer:start]', {
    cachedData,
    url,
    id,
  });
  if (cachedData) {
    return cachedData;
  }
  const res = await fetch(url);
  const { ok, status, headers } = res;
  const headersHash = [...headers.entries()].reduce(
    (hash, [id, val]) => {
      hash[id] = val;
      return hash;
    },
    {} as Record<string, string>,
  );
  const contentType = headers.get('content-type');
  if (!ok || status !== 200 || contentType === 'text/html') {
    const message = `Не удалось загрузить документ для СОП ${getDocTypeIdentString(id)}`;
    // eslint-disable-next-line no-console
    console.error('[fetchDocBuffer]', message, {
      ok,
      status,
      contentType,
      headers,
      res,
      url,
      id,
    });
    debugger; // eslint-disable-line no-debugger
    throw new Error(message);
  }
  console.log('[fetchDocBuffer:done]', {
    ok,
    status,
    contentType,
    headersHash,
    headers,
    res,
    url,
    id,
  });
  debugger;
  const arrayBuffer = await res.arrayBuffer();
  cachedBuffers[id] = arrayBuffer;
  return arrayBuffer;
}
