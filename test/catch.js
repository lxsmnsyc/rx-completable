/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('Completable', () => {
  /**
   *
   */
  describe('#catch', () => {
    /**
     *
     */
    it('should create a Promise', () => {
      const completable = Completable.just('Hello').catch(x => x);
      assert(completable instanceof Promise);
    });
  });
});
