/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#catch', () => {
  /**
   *
   */
  it('should create a Promise', () => {
    const completable = Completable.error(new Error('Hello')).catch(x => x);
    assert(completable instanceof Promise);
  });
});
