/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#merge', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.merge(Completable.complete(), Completable.timer(100));

    assert(completable instanceof Completable);
  });
});
