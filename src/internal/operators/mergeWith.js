import mergeArray from './mergeArray';
import is from '../is';
/**
 * @ignore
 */
export default (source, other) => {
  if (!is(other)) {
    return source;
  }
  return mergeArray([source, other]);
};
