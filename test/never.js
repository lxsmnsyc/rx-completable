/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#never', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.never();
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should not signal.', () => {
    const completable = Completable.never();
    completable.subscribe(
      () => done(false),
      () => done(false),
    );
  });
});
