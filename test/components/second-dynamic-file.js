import common from './common-chunk';

export default function nested(message) {
  return `Message: ${message} - Number: ${common()}`;
}
