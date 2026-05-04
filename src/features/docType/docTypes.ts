export const docTypes = {
  rubber: 'Резиновые',
  plastic: 'Пластмассовые',
  metal: 'Металлические',
  glass: 'Стеклянные',
  dressings: 'Перевязочные средства',
} as const;
export type TDocTypeId = keyof typeof docTypes;
export type TDocTypeName = (typeof docTypes)[keyof typeof docTypes];
export const docTypeIds = Object.keys(docTypes) as TDocTypeId[];
