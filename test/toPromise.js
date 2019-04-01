/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#toPromise', () => {
  /**
   *
   */
  it('should create a Promise', () => {
    const completable = Completable.complete().toPromise();
    assert(completable instanceof Promise);
  });
});
