global.structuredClone = function structuredClone(objectToClone: any) {
    if ('object' !== typeof objectToClone) return {};
    return JSON.parse(JSON.stringify(objectToClone));
};
