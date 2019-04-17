import Completable from '../../completable';
import { immediateComplete, isNull } from '../utils';
/**
 * @ignore
 */
let INSTANCE;
/**
 * @ignore
 */
export default () => {
  if (isNull(INSTANCE)) {
    INSTANCE = new Completable(o => immediateComplete(o));
  }
  return INSTANCE;
};
