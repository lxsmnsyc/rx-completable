/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#concat', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.concat([Completable.complete(), Completable.complete()]);
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should start with the from left to right', (done) => {
    let started = '';
    const prefix = Completable.complete().doOnComplete(() => { started += 'A'; });
    const suffix = Completable.complete().doOnComplete(() => { started += 'B'; });
    const source = Completable.concat([prefix, suffix]);

    source.subscribe(
      () => (started === 'AB' ? done() : done(false)),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error from the first Completable', (done) => {
    const completable = Completable.concat([Completable.error(new Error('Hello')), Completable.timer(100)]);
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if one of the source is non-Completable.', (done) => {
    const completable = Completable.concat(['Hello', Completable.timer(100)]);
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if given argument is not Iterable', (done) => {
    const completable = Completable.concat();
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
});
