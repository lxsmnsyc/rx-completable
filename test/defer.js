/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#defer', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.defer(() => Completable.complete());

    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should succeed with the given value.', (done) => {
    const completable = Completable.defer(() => Completable.complete());

    completable.subscribe(
      x => (x === 'Hello World' ? done() : done(false)),
      e => done(e),
    );
  });
  /**
   *
   */
  it('should signal error if callable returns a non-Completable', (done) => {
    const completable = Completable.defer(() => {});

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if callable throws an error', (done) => {
    const completable = Completable.defer(() => {
      throw new Error('Expected');
    });

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
});
