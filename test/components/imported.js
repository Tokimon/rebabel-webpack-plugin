export default function someFunc(num) {
  const fn = (int) => `${int}`;
  return Promise.resolve(`Imported: ${fn(num + 5)}`);
}
