export function isObject(object: unknown): object is Record<string, unknown> {
  return object != null && typeof object === 'object';
}

export function objectCompare(object1: Record<string, unknown>, object2: Record<string, unknown>) {
  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);

  if (objKeys1.length !== objKeys2.length) return false;

  for (const key of objKeys1) {
    const value1 = object1[key];
    const value2 = object2[key];

    const isObjects = isObject(value1) && isObject(value2);

    if ((isObjects && !objectCompare(value1, value2)) || (!isObjects && value1 !== value2)) {
      return false;
    }
  }
  return true;
}
