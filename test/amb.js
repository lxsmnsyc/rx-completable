/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#amb', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.amb([Completable.complete(), Completable.complete()]);
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should signal complete from the earliest source.', (done) => {
    const completable = Completable.amb([Completable.complete(), Completable.timer(100)]);
    completable.subscribe(
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error from the earliest source.', (done) => {
    const completable = Completable.amb([Completable.error(new Error('Hello')), Completable.timer(100)]);
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if one of the source is non-Completable.', (done) => {
    const completable = Completable.amb(['Hello', Completable.timer(100)]);
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if given argument is not Iterable', (done) => {
    const completable = Completable.amb();
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
});
