import Completable from '../../completable';
import { immediateComplete } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  immediateComplete(observer);
}
/**
 * @ignore
 */
export default () => {
  const single = new Completable();
  single.subscribeActual = subscribeActual.bind(single);
  return single;
};
