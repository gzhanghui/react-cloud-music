import { floor } from 'lodash'
export default function transform(value) {
  let str = '';
  if (value < 1000) {
    return value
  } else {
    str = floor(value / 1000, 2) + 'k'
  }
  return str
}