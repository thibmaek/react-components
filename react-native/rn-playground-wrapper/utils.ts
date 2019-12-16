export const diff = (a: any[], b: any[]) => [...new Set(a.filter(i => !new Set(b).has(i)))];
