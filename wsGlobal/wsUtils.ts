export function parseMessage(data: string) {
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error(`Couldn't parse message ${err}`);
  }
}

export function jstr(data: object) {
  return JSON.stringify(data);
}
