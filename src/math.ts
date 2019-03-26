// public because of the export keyword
export function add( a: number, b: number ): number {
    log( `${a} + ${b}` );
    return a + b;
}

// private
function log( message: string ): void {
    console.log( message );
}