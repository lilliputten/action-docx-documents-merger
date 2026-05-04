import { Link } from 'react-router-dom';

import { isDev } from '@/config';
import { docTypes } from '@/features/docType';
import { cn } from '@/lib';

export function MainPage() {
  const typesList = Object.entries(docTypes).map(([id, name]) => {
    return (
      <div
        key={id}
        className={cn(
          isDev && '__MainPage_DocType', // DEBUG
        )}
      >
        {name}
      </div>
    );
  });
  return (
    <div
      className={cn(
        isDev && '__MainPage', // DEBUG
        'max-w-md self-center',
        'content-truncate',
        'flex flex-col',
      )}
    >
      <div
        className={cn(
          isDev && '__MainPage_Inner', // DEBUG
          'content-truncate',
          'p-6',
          'flex flex-col',
          // 'border-1', // DEBUG
        )}
      >
        <h1 className="content-truncate">{import.meta.env.VITE_APP_TITLE}</h1>
        {typesList}
        <p className="text-sm content-truncate">
          <Link to="/create?doc=rubber&doc=glass">Create Document</Link>
        </p>
      </div>
    </div>
  );
}
