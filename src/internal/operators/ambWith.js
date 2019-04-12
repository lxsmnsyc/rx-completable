import Completable from '../../completable';
import amb from './amb';
/**
 * @ignore
 */
export default (source, other) => {
  if (!(other instanceof Completable)) {
    return source;
  }
  return amb([source, other]);
};
