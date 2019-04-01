/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#fromCallable', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.fromCallable(() => 'Hello World');
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should succeed with the given value.', (done) => {
    const completable = Completable.fromCallable(() => 'Hello World');

    completable.subscribe(
      x => (x === 'Hello World' ? done() : done(false)),
      e => done(e),
    );
  });
  /**
   *
   */
  it('should signal an error if the callable throws an error.', (done) => {
    const completable = Completable.fromCallable(() => {
      throw new Error('Expected');
    });

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal an error if the callable returns a rejected Promise.', (done) => {
    const completable = Completable.fromCallable(() => new Promise((x, y) => y(new Error('Expected'))));

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal an error if the callable is not a function', (done) => {
    const completable = Completable.fromCallable();

    completable.subscribe(
      () => done(false),
      e => (e === 'Completable.fromCallable: callable received is not a function.' ? done() : done(false)),
    );
  });
});
