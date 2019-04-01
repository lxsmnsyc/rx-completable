/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#then', () => {
  /**
   *
   */
  it('should create a Promise', () => {
    const completable = Completable.complete().then(x => x, x => x);
    assert(completable instanceof Promise);
  });
});
