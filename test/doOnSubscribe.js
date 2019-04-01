/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#doOnSubscribe', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().doOnSubscribe(() => {});
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should return the same instance if no function is passed', () => {
    const source = Completable.complete();
    const completable = source.doOnSubscribe();
    assert(source === completable);
  });
  /**
   *
   */
  it('should be called before actual subscription.', (done) => {
    let called;
    const completable = Completable.complete().doOnSubscribe(() => { called = true; });
    completable.subscribeWith({
      onSubscribe() {
        if (called) {
          done();
        } else {
          done(false);
        }
      },
    });
  });
});
