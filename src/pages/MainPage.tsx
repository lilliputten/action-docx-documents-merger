import React from 'react';
import { saveAs } from 'file-saver';
import { Check, LoaderCircle } from 'lucide-react';
import { toast } from 'react-toastify';

import { DocItem } from '@/components';
import { appTitle, isDev } from '@/config';
import { fetchDocBuffer } from '@/features/docs/helpers';
import { useDocxMerge } from '@/features/docs/hooks';
import { docTypeIds, TDocTypeId } from '@/features/docType';
import { cn, getErrorText } from '@/lib';
import { ErrorLike } from '@/types/ErrorLike';

import docIcon from '/static/doc-icon.svg';

export function MainPage() {
  const [error, setError] = React.useState<ErrorLike>();
  const [isCreating, setIsCreating] = React.useState(false);
  const [hasCreated, setHasCreated] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<Set<TDocTypeId>>(
    new Set(
      isDev
        ? [
            'glass',
            // 'rubber',
          ]
        : [],
    ),
  );

  const { mergeDocuments, isMerging, progress, error: mergeError, reset } = useDocxMerge();

  const createDoc = React.useCallback(async () => {
    if (!selectedItems.size) {
      return;
    }

    const items = [...selectedItems];
    console.log('[MainPage:createDoc:start]', {
      items,
    });

    const promises = items.map((id) => fetchDocBuffer(id));
    try {
      const buffers = await Promise.all(promises);
      console.log('[MainPage:createDoc:loaded]', {
        buffers,
        promises,
        items,
      });
      const documentTitle = 'document-' + items.join('-');
      const documentFilename = `${documentTitle}.docx`;
      const mergedBlob = await mergeDocuments({ buffers, documentTitle });
      console.log('[MainPage:createDoc:done]', {
        mergedBlob,
        promises,
        items,
      });

      if (mergedBlob) {
        // saveAs(mergedBlob, documentFilename);
        // Trigger download
        const url = URL.createObjectURL(mergedBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${documentTitle}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      const message = 'Ошибка создания документа';
      const details = getErrorText(error);
      const comboMsg = [message, details].join(': ');
      // eslint-disable-next-line no-console
      console.error('[mergeDocs]', comboMsg, {
        message,
        details,
        error,
        items,
      });
      debugger; // eslint-disable-line no-debugger
      throw new Error(comboMsg);
    }
    /* // UNUSED: Navigate to a specific page
     * const searchParams = new URLSearchParams();
     * items.forEach((item) => searchParams.append('doc', item));
     * navigate({
     *   pathname: '/create',
     *   search: `?${searchParams.toString()}`,
     * });
     */
  }, [mergeDocuments, selectedItems]);

  const toggleitem = React.useCallback((id: TDocTypeId) => {
    setSelectedItems((selectedItems) => {
      const newItems = new Set([...selectedItems]);
      if (selectedItems.has(id)) {
        newItems.delete(id);
      } else {
        newItems.add(id);
      }
      return newItems;
    });
  }, []);

  const typesList = React.useMemo(
    () =>
      docTypeIds.map((id) => (
        <DocItem
          key={id}
          id={id}
          className={cn(
            isDev && '__MainPage_DocType', // DEBUG
          )}
          selected={selectedItems.has(id)}
          toggle={toggleitem}
        />
      )),
    [selectedItems, toggleitem],
  );

  return (
    <div
      className={cn(
        isDev && '__MainPage', // DEBUG
        'flex w-full max-w-md flex-col self-center',
      )}
    >
      <div
        className={cn(
          isDev && '__MainPage_Container', // DEBUG
          'content-truncate flex flex-col gap-4 p-6',
        )}
      >
        {!!error && (
          <div
            className={cn(
              isDev && '__MainPage_Error', // DEBUG
              'content-truncate rounded bg-red-500 p-3 text-sm text-white',
            )}
          >
            {String(error)}
          </div>
        )}
        <h1
          className={cn(
            isDev && '__MainPage_Title', // DEBUG
            'content-truncate m-0',
          )}
        >
          {appTitle}
        </h1>
        <ul
          className={cn(
            isDev && '__MainPage_Items', // DEBUG
            'content-truncate flex flex-col gap-1 p-0',
          )}
        >
          {typesList}
        </ul>
        <div
          className={cn(
            isDev && '__MainPage_Actions', // DEBUG
            'content-truncate',
          )}
        >
          <div
            className={cn(
              isDev && '__MainPage_MainButton', // DEBUG
              'btn-base flex items-center p-3 text-white',
              'btn-primary cursor-pointer',
              !selectedItems.size && 'disabled',
            )}
            onClick={createDoc}
          >
            {isCreating ? (
              <>
                <LoaderCircle className="size-8 animate-spin opacity-50" />
                <span className="flex-1 truncate">Создание документа</span>
              </>
            ) : hasCreated ? (
              <>
                <Check className="size-8 opacity-50" />
                <span className="flex-1 truncate">Документ создан</span>
              </>
            ) : (
              <>
                <img src={docIcon} className="size-8 shrink-0 text-green-500" />
                <span className="flex-1 truncate">Создать документ</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
