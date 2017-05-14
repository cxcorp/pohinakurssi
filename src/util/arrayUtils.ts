/**
 * Produces the set difference of two arrays (a ∖ b).
 */
export function except<T>(a: T[], b: T[]): T[] {
    const ret: T[] = [];
    const bSet = new Set<T>(b);
    
    for (let i = 0; i < a.length; i++) {
        const val = a[i];
        if (!bSet.has(val)) {
            ret.push(val);
        }
    }
    
    return ret;
}