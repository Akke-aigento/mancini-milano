const SIZE_ORDER: Record<string, number> = {
  'one size': -1, 'os': -1, 'xxs': 0, 'xs': 1, 's': 2,
  'm': 3, 'l': 4, 'xl': 5, 'xxl': 6, '2xl': 6,
  'xxxl': 7, '3xl': 7, '4xl': 8, '5xl': 9,
};

export function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const al = a.toLowerCase().trim();
    const bl = b.toLowerCase().trim();
    const aMap = SIZE_ORDER[al];
    const bMap = SIZE_ORDER[bl];
    if (aMap !== undefined && bMap !== undefined) return aMap - bMap;
    if (aMap !== undefined) return -1;
    if (bMap !== undefined) return 1;
    const aNum = parseFloat(al.replace(/[^0-9.]/g, ''));
    const bNum = parseFloat(bl.replace(/[^0-9.]/g, ''));
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    if (!isNaN(aNum)) return -1;
    if (!isNaN(bNum)) return 1;
    return al.localeCompare(bl);
  });
}
