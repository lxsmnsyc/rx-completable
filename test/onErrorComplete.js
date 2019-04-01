/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#onErrorComplete', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.error(new Error('Hello')).onErrorComplete(() => 'World');
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should return the same instance if parameter passed is not a Completable or a function', () => {
    const source = Completable.error(new Error('Hello'));
    const completable = source.onErrorComplete();
    assert(completable === source);
  });
  /**
   *
   */
  it('should emit the supplied item by the given function in case of error', (done) => {
    const completable = Completable.error(new Error('Hello')).onErrorComplete(() => 'World');

    completable.subscribe(
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should emit error if provide function throws error.', (done) => {
    const completable = Completable.error(new Error('Hello')).onErrorComplete(() => { throw new Error('Ooops'); });
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should emit error if provide function returns undefined.', (done) => {
    const completable = Completable.error(new Error('Hello')).onErrorComplete(() => {});
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
});
