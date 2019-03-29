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
  describe('#merge', () => {
    /**
     *
     */
    it('should create a Completable', () => {
      const completable = Completable.merge(Completable.just(Completable.complete()));

      assert(completable instanceof Completable);
    });
    /**
     *
     */
    it('should signal error if no source is provided', (done) => {
      const completable = Completable.merge();

      completable.subscribe(
        () => done(false),
        () => done(),
      );
    });
    /**
     *
     */
    it('should signal error if source emitted a non-Completable', (done) => {
      const completable = Completable.merge(Completable.complete());

      completable.subscribe(
        () => done(false),
        () => done(),
      );
    });
    /**
     *
     */
    it('should signal success of the signaled Completable', (done) => {
      const completable = Completable.merge(Completable.just(Completable.complete()));

      completable.subscribe(
        x => (x === 'Hello' ? done() : done(false)),
        () => done(false),
      );
    });
  });
});
