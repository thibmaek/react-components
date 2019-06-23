export const diff = <T>(a: T[], b: T[]) => [...new Set(a.filter(i => !new Set(b).has(i)))];
