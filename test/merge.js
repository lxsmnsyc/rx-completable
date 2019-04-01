/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#merge', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.merge([Completable.complete(), Completable.complete()]);
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should start with the from the first completion to the last completion', (done) => {
    let started = '';
    const prefix = Completable.complete().doOnComplete(() => { started += 'A'; });
    const suffix = Completable.complete().doOnComplete(() => { started += 'B'; });
    const source = Completable.merge([prefix, suffix]);

    source.subscribe(
      () => (started === 'AB' ? done() : done(false)),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error from the first', (done) => {
    const completable = Completable.merge([Completable.error(new Error('Hello')), Completable.timer(100)]);
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if one of the source is non-Completable.', (done) => {
    const completable = Completable.merge(['Hello', Completable.timer(100)]);
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if given argument is not Iterable', (done) => {
    const completable = Completable.merge();
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
});
