import mergeArray from './mergeArray';
import is from '../is';
/**
 * @ignore
 */
export default (source, other) => (
  !is(other)
    ? source
    : mergeArray([source, other])
);
