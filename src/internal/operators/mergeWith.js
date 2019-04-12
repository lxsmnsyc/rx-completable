import Completable from '../../completable';
import merge from './merge';
/**
 * @ignore
 */
export default (source, other) => {
  if (!(other instanceof Completable)) {
    return source;
  }
  return merge([source, other]);
};
