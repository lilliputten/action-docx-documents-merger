import { docTypes, TDocTypeId, TDocTypeName } from '@/features/docType';

export function getDocTypeIdentString(id: TDocTypeId) {
  const name: TDocTypeName | undefined = docTypes[id];
  const ident = [
    // Ident parts...
    name && `"${name}"`,
    `("${id}")`,
  ];
  return ident.filter(Boolean).join(' ');
}
