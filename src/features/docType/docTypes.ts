export const docTypes = {
  rubber: 'Резиновые',
  plastic: 'Пластмассовые',
  metal: 'Металлические',
  glass: 'Стеклянные',
  dressings: 'Перевязочные средства',
} as const;
export type TDocTypeId = (typeof docTypes)[keyof typeof docTypes];
