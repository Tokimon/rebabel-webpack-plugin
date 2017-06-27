export default function someFunc() {
  const fn = (type) => `a type of: ${type}`;
  return Promise.resolve(`Imported file is ${fn('Special')}`);
}
