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
  describe('#lift', () => {
    /**
     *
     */
    it('should return the same instance if no function is provided', () => {
      const source = Completable.complete();
      const completable = source.lift();

      assert(source === completable);
    });
    /**
     *
     */
    it('should signal an error if the lift operator returned a non-Observer', (done) => {
      const completable = Completable.complete().lift(() => {});

      completable.subscribe(
        () => done(false),
        () => done(),
      );
    });
    /**
     *
     */
    it('should subscribe successfully', (done) => {
      const completable = Completable.complete().lift(observer => ({
        onSubscribe: observer.onSubscribe,
        onComplete: observer.onComplete,
      }));

      completable.subscribe(
        () => done(),
      );
    });
  });
});
