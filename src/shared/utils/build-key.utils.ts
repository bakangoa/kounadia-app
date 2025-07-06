
export function buildKey(operation: string, params: any): string {
    let paramsStr = '';
    if (params instanceof Array) {
        paramsStr = JSON.stringify(params);
    }
    else if (params instanceof Object) {
        paramsStr = JSON.stringify(params);
    }
    else {
        paramsStr = params;
    }
    return `${operation}:${paramsStr}`;
}

export function breakKey(key: string): {
    operation: string,
    params: any
} {
    const parts = key.split(':');
    return {
        operation: parts[0],
        params: parts[1]
    };
}
