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
  describe('#onErrorResumeNext', () => {
    /**
     *
     */
    it('should create a Completable', () => {
      const completable = Completable.error(new Error('Hello')).onErrorResumeNext(Completable.complete());
      assert(completable instanceof Completable);
    });
    /**
     *
     */
    it('should return the same instance if parameter passed is not a Completable or a function', () => {
      const source = Completable.error(new Error('Hello'));
      const completable = source.onErrorResumeNext();
      assert(completable === source);
    });
    /**
     *
     */
    it('should subscribe to the given Completable', (done) => {
      const completable = Completable.error(new Error('Hello')).onErrorResumeNext(Completable.complete());
      completable.subscribe(
        () => done(),
        done,
      );
    });
    /**
     *
     */
    it('should subscribe to the given Completable-producing Function', (done) => {
      const completable = Completable.error(new Error('Hello')).onErrorResumeNext(() => Completable.complete());
      completable.subscribe(
        () => done(),
        done,
      );
    });
    /**
     *
     */
    it('should emit error if provide function throws error.', (done) => {
      const completable = Completable.error(new Error('Hello')).onErrorResumeNext(() => { throw new Error('Ooops'); });
      completable.subscribe(
        done,
        () => done(),
      );
    });
    /**
     *
     */
    it('should emit error if provide function returns non-Completable.', (done) => {
      const completable = Completable.error(new Error('Hello')).onErrorResumeNext(() => {});
      completable.subscribe(
        done,
        () => done(),
      );
    });
  });
});
