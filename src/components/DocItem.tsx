import { Check } from 'lucide-react';

import { isDev } from '@/config';
import { docTypes, TDocTypeId, TDocTypeName } from '@/features/docType';
import { cn } from '@/lib';

interface TProps {
  id: TDocTypeId;
  className?: string;
  selected: boolean;
  toggle: (id: TDocTypeId) => void;
}

export function DocItem(props: TProps) {
  const { id, className, selected, toggle } = props;
  const name: TDocTypeName = docTypes[id];
  return (
    <li
      key={id}
      className={cn(
        isDev && '__DocItem', // DEBUG
        'content-truncate',
        'flex items-center gap-3 p-3',
        'animate',
        'cursor-pointer',
        'hover:bg-sky-500/10',
        'rounded',
        selected && 'bg-green-500/20 hover:bg-green-500/30',
        className,
      )}
      onClick={() => toggle(id)}
    >
      <Check className="size-4 shrink-0 text-green-500" />
      <span className="flex-1 truncate">{name}</span>
    </li>
  );
}
