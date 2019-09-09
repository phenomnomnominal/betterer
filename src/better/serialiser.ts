export function serialise (value: any) {
    return isJSON(value) ? value : JSON.stringify(value);
}

function isJSON (value: any) {
    try {
        JSON.parse(value);
        return typeof value === 'string';
    } catch {
        return false;
    }
}