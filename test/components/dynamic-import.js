export default function func() {
  const name = 'Dynamic File';
  return import(`./second-${name.toLowerCase().replace(/\s+/g, '-')}`);
}
