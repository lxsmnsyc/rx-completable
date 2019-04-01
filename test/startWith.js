/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#startWith', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().startWith(Completable.complete());

    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should return the same instance if the given completable is a non-Completable', () => {
    const source = Completable.complete();
    const completable = source.startWith();
    assert(source === completable);
  });
  /**
   *
   */
  it('should start with the other Completable.', (done) => {
    let started = '';
    const prefix = Completable.complete().doOnComplete(() => { started += 'A'; });
    const source = Completable.complete().doOnComplete(() => { started += 'B'; }).startWith(prefix);

    source.subscribe(
      () => (started === 'AB' ? done() : done(false)),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should error with the other Completable if the other throws an error', (done) => {
    let started;
    const prefix = Completable.error(new Error('Hello')).doOnError(() => { started = true; });
    const source = Completable.complete().startWith(prefix);

    source.subscribe(
      () => done(false),
      () => (started ? done() : done(false)),
    );
  });
  /**
   *
   */
  it('should error with the source Completable if the source throws an error', (done) => {
    let started;
    const prefix = Completable.complete();
    const source = Completable.error(new Error('Hello')).doOnError(() => { started = true; }).startWith(prefix);

    source.subscribe(
      () => done(false),
      () => (started ? done() : done(false)),
    );
  });
});
