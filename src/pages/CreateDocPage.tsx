import { Link, useSearchParams } from 'react-router-dom';

import { isDev } from '@/config';
import { cn } from '@/lib';

export function CreateDocPage() {
  const [searchParams] = useSearchParams();
  const docs = searchParams.getAll('doc');
  return (
    <div
      className={cn(
        isDev && '__CreateDocPage', // DEBUG
        'p-6',
        'max-w-md self-center',
        'border-1',
      )}
    >
      <h1 className="truncate">CreateDocPage</h1>
      <pre className="content-truncate">{JSON.stringify(docs, null, 2)}</pre>
      <p className="text-sm content-truncate">
        <Link to="/">Main</Link>
      </p>
    </div>
  );
}
