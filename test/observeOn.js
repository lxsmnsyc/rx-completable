/* eslint-disable no-undef */
import assert from 'assert';
import Scheduler from 'rx-scheduler';
import Completable from '../src/completable';

describe('#observeOn', () => {
  it('should return a Completable', () => {
    assert(Completable.complete().observeOn(Scheduler.current));
  });
  it('should be synchronous with non-Scheduler', (done) => {
    let flag = false;

    const completable = Completable.complete().observeOn();

    completable.subscribe(
      () => { flag = true; },
      done,
    );

    if (flag) {
      done();
    } else {
      done(false);
    }
  });
  it('should be synchronous with Scheduler.current', (done) => {
    let flag = false;

    const completable = Completable.complete().observeOn(Scheduler.current);

    completable.subscribe(
      () => { flag = true; },
      done,
    );

    if (flag) {
      done();
    } else {
      done(false);
    }
  });
  it('should be asynchronous with Scheduler.tick', (done) => {
    let flag = false;

    const completable = Completable.complete().observeOn(Scheduler.tick);

    completable.subscribe(
      () => { flag = true; },
      done,
    );

    process.nextTick(() => {
      if (flag) {
        done();
      } else {
        done(false);
      }
    });

    if (flag) {
      done(false);
    }
  });
  it('should be asynchronous with Scheduler.async', (done) => {
    let flag = false;

    const completable = Completable.complete().observeOn(Scheduler.async);

    completable.subscribe(
      () => { flag = true; },
      done,
    );

    Promise.resolve().then(() => {
      if (flag) {
        done();
      } else {
        done(false);
      }
    });

    if (flag) {
      done(false);
    }
  });
  it('should be asynchronous with Scheduler.immediate', (done) => {
    let flag = false;

    const completable = Completable.complete().observeOn(Scheduler.immediate);

    completable.subscribe(
      () => { flag = true; },
      done,
    );

    setImmediate(() => {
      if (flag) {
        done();
      } else {
        done(false);
      }
    });

    if (flag) {
      done(false);
    }
  });
  it('should be asynchronous with Scheduler.timeout', (done) => {
    let flag = false;

    const completable = Completable.error(new Error('Hello World')).observeOn(Scheduler.timeout);

    completable.subscribe(
      done,
      () => { flag = true; },
    );

    setTimeout(() => {
      if (flag) {
        done();
      } else {
        done(false);
      }
    });

    if (flag) {
      done(false);
    }
  });
});
