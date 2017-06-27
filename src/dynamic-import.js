import common from 'common-chunk';

export default function func() {
  const name = 'Dynamic File';
  console.log(`File loaded: ${name}`);
  console.log('- common call', common({ num: 39 }));

  return import('./second-dynamic-file');
}
