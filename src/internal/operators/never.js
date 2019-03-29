/* eslint-disable class-methods-use-this */
import Completable from '../../completable';

const SIGNAL = {
  aborted: false,
  addEventListener: () => {},
  removeEventListener: () => {},
  onabort: () => {},
};


const CONTROLLER = {
  signal: SIGNAL,
  abort: () => {},
};

/**
 * @ignore
 */
function subscribeActual(observer) {
  observer.onSubscribe(CONTROLLER);
}
/**
 * @ignore
 */
let INSTANCE;
/**
 * @ignore
 */
export default () => {
  if (typeof INSTANCE === 'undefined') {
    INSTANCE = new Completable();
    INSTANCE.subscribeActual = subscribeActual.bind(INSTANCE);
  }
  return INSTANCE;
};
