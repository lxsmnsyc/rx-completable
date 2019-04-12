import Completable from '../../completable';
import concat from './concat';
/**
 * @ignore
 */
export default (source, other) => {
  if (!(other instanceof Completable)) {
    return source;
  }
  return concat([source, other]);
};
