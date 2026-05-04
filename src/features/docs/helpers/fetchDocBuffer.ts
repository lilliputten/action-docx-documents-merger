import { getDocTypeIdentString, TDocTypeId } from '@/features/docType';

const docUrlPrefix = './static/docs/';
const docExt = '.docx';

export type TDocData = ArrayBuffer; // Buffer<ArrayBufferLike>;
export type TDocBuffer = Buffer<ArrayBufferLike>;
export type TDocCachedBuffers = Partial<Record<TDocTypeId, TDocData>>;

const cachedBuffers: TDocCachedBuffers = {};

export async function fetchDocBuffer(id: TDocTypeId) {
  const url = `${docUrlPrefix}${id}${docExt}`;
  const cachedData = cachedBuffers[id];
  console.log('[fetchDocBuffer:start]', {
    cachedData,
    url,
    id,
  });
  if (cachedData) {
    return cachedData;
  }
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
  });
  const { ok, status, headers } = res;
  const headersHash = [...headers.entries()].reduce(
    (hash, [id, val]) => {
      hash[id] = val;
      return hash;
    },
    {} as Record<string, string>,
  );
  const contentType = headers.get('content-type');
  // Some servers can return html response for not-found files
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
    res,
    url,
    id,
  });
  const arrayBuffer = await res.arrayBuffer();
  /* // Possible transformations:
   * const nodeBuffer = Buffer.from(arrayBuffer);
   * const binary = String.fromCharCode(...new Uint8Array(arrayBuffer));
   */
  cachedBuffers[id] = arrayBuffer;
  return arrayBuffer;
}
