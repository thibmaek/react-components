export const diff = (a, b) => [...new Set(a.filter(i => !new Set(b).has(i)))];
