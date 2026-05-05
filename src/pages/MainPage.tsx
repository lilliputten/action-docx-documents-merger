import React from 'react';
import { Check, LoaderCircle } from 'lucide-react';
import { toast } from 'react-toastify';

import { DocItem } from '@/components';
import { appTitle, isDev } from '@/config';
import { docxMimeType } from '@/constants';
import { bufferToBlob } from '@/features/docs/helpers';
import { mergeDocs } from '@/features/docs/mergeDocs';
import { docTypeIds, TDocTypeId } from '@/features/docType';
import { cn, getErrorText } from '@/lib';
import { ErrorLike } from '@/types/ErrorLike';

const __debugUseDemoData = isDev && false;
const defaultItems: TDocTypeId[] = __debugUseDemoData ? ['glass'] : [];

export function MainPage() {
  const [error, setError] = React.useState<ErrorLike>();
  const [isCreating, setIsCreating] = React.useState(false);
  const [hasCreated, setHasCreated] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<Set<TDocTypeId>>(new Set(defaultItems));

  // Effect: Reset the 'created' state if items has changed
  React.useEffect(() => {
    setHasCreated(false);
  }, [selectedItems]);

  const createDoc = React.useCallback(async () => {
    if (!selectedItems.size) {
      return;
    }

    setIsCreating(true);

    const items = [...selectedItems];

    const documentTitle = 'document-' + items.join('-');
    const documentFilename = `${documentTitle}.docx`;

    console.log('[MainPage:createDoc:start]', {
      documentTitle,
      documentFilename,
      items,
    });

    try {
      const buffer = await mergeDocs(items);
      if (!buffer) {
        throw new Error('Создан пустой документ');
      }
      const blob = bufferToBlob(buffer);

      console.log('[MainPage:createDoc:done]', {
        blob,
        items,
        buffer,
        documentFilename,
        documentTitle,
      });

      if (blob) {
        // Try to use File System Access API for better control (modern browsers)
        if (window.showSaveFilePicker) {
          try {
            const handle = await window.showSaveFilePicker({
              suggestedName: documentFilename,
              types: [
                {
                  description: 'Word Document',
                  accept: {
                    [docxMimeType]: ['.docx'],
                  },
                },
              ],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            // File has been successfully saved!
            setHasCreated(true);
            return;
          } catch (err) {
            // User cancelled or error occurred, fall back to traditional method
            if ((err as Error).name === 'AbortError') {
              // User cancelled the save dialog
              return;
            }
            // For other errors, fall through to traditional download
          }
        }

        // Traditional download method (fallback for older browsers)
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = documentFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Note: We can't reliably detect when the download completes
        // with the traditional method. Set state immediately after triggering.
        URL.revokeObjectURL(url);
        setHasCreated(true);
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
      // throw new Error(comboMsg);
      setError(comboMsg);
      toast.error(comboMsg);
    } finally {
      setIsCreating(false);
    }
  }, [selectedItems]);

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
        'flex w-full flex-col self-center',
        'max-w-md',
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
            'content-truncate animation flex flex-col gap-1 p-0',
            isCreating && 'disabled',
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
              'cursor-pointer select-none',
              'bg-sky-500 hover:bg-sky-600 active:bg-sky-700',
              !selectedItems.size && 'disabled bg-slate-500/50',
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
                <img src="./static/doc-icon.svg" className="size-8 shrink-0 text-green-500" />
                <span className="flex-1 truncate">Создать документ</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
