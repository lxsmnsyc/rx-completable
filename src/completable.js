/**
 * @license
 * MIT License
 *
 * Copyright (c) 2019 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2019
 */

/**
 * @external {Iterable} https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
 */
/**
 * @external {Thennable} https://promisesaplus.com/
 */
/**
 * @external {PromiseLike} https://promisesaplus.com/
 */
/**
 * @external {AbortController} https://developer.mozilla.org/en-US/docs/Web/API/AbortController
 */
import AbortController from 'abort-controller';
import { isObserver } from './internal/utils';
import {
  amb, ambWith, andThen, cache, complete,
  compose, concat, create, defer, delay,
  delaySubscription, doAfterTerminate,
  doFinally, doOnAbort, doOnComplete,
  doOnError, doOnEvent, doOnSubscribe,
  doOnTerminate, error, fromCallable,
  fromPromise, fromResolvable, lift, merge,
  mergeWith, never, onErrorComplete,
  onErrorResumeNext, repeat, retry,
  startWith, timeout, timer, takeUntil, repeatUntil,
} from './internal/operators';

/**
 * The Completable class represents a deferred computation
 * without any value but only indication for completion
 * or exception.
 *
 * Completable behaves similarly to Observable except that
 * it can only emit either a completion or error signal
 * (there is no onNext or onSuccess as with the other
 * reactive types).
 *
 * The Completable operates with the following sequential protocol:
 *
 * onSubscribe (onError | onComplete)?
 *
 * Note that as with the Observable protocol, onError and
 * onComplete are mutually exclusive events.
 *
 * Like Observable, a running Completable can be stopped through
 * the AbortController instance provided to consumers through
 * Observer.onSubscribe(AbortController).
 *
 * Like an Observable, a Completable is lazy, can be either
 * "hot" or "cold", synchronous or asynchronous.
 * Completable instances returned by the methods of this class are
 * cold.
 *
 * The documentation for this class makes use of marble diagrams.
 * The following legend explains these diagrams:
 *
 * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.png" class="diagram">
 */
export default class Completable {
  /**
   * Returns a Completable which terminates as soon as
   * one of the source Completables terminates
   * (normally or with an error) and disposes all
   * other Completables.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.amb.png" class="diagram">
   *
   * @param {!Iterable} sources
   * the array of source Completables.
   * A subscription to each source will occur in the
   * same order as in this Iterable.
   * @returns {Completable}
   */
  static amb(sources) {
    return amb(sources);
  }

  /**
   * Returns a Completable that emits the a terminated
   * event of either this Completable or the other
   * Completable whichever fires first.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.ambWith.png" class="diagram">
   *
   * @param {!Completable} other
   * the other Completable, not null. A subscription to
   * this provided source will occur after subscribing
   * to the current source.
   * @returns {Completable}
   */
  ambWith(other) {
    return ambWith(this, other);
  }

  /**
   * Returns a Completable that first runs this Completable
   * and then the other completable.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.andThen.c.png" class="diagram">
   *
   * @param {!Completable} other
   * the other Completable, not null
   * @returns {Completable}
   */
  andThen(other) {
    return andThen(this, other);
  }

  /**
   * Subscribes to this Completable only once, when the first
   * Observer subscribes to the result Completable, caches its
   * terminal event and relays/replays it to observers.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.cache.png" class="diagram">
   *
   * @returns {Completable}
   */
  cache() {
    return cache(this);
  }

  /**
   * Returns a Completable instance that completes immediately
   * when subscribed to.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.complete.png" class="diagram">
   *
   * @returns {Completable}
   */
  static complete() {
    return complete();
  }

  /**
   * Calls the given transformer function with this instance an
   * returns the function's resulting Completable.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.compose.png" class="diagram">
   *
   * @param {!function(completable: Completable):Completable} transformer
   * the transformer function, not null
   * @returns {Completable}
   */
  compose(transformer) {
    return compose(this, transformer);
  }

  /**
   * Returns a Completable which completes only when all sources
   * complete, one after another.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.concat.png" class="diagram">
   *
   * @param {!Iterable} sources
   * the sources to concatenate
   * @returns {Completable}
   */
  static concat(sources) {
    return concat(sources);
  }

  /**
   * Concatenates this Completable with another Completable.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.concatWith.png" class="diagram">
   *
   * This is an alias for andThen.
   * @param {!Completable} other
   * the other Completable, not null
   * @returns {Completable}
   */
  concatWith(other) {
    return andThen(this, other);
  }

  /**
   * Provides an API (via a cold Completable) that bridges the
   * reactive world with the callback-style world.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.create.png" class="diagram">
   *
   * @param {!function(e: Emitter)} subscriber
   * the emitter that is called when a Observer subscribes
   * to the returned Completable
   * @returns {Completable}
   */
  static create(subscriber) {
    return create(subscriber);
  }

  /**
   * Defers the subscription to a Completable instance returned
   * by a supplier.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.defer.png" class="diagram">
   *
   * @param {function():Completable} supplier
   * the supplier that returns the Completable that will be subscribed to.
   * @returns {Completable}
   */
  static defer(supplier) {
    return defer(supplier);
  }

  /**
   * Returns a Completable which delays the emission of the
   * completion event by the given time.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.delay.png" class="diagram">
   *
   * @param {!number} amount
   * the amount of time the success signal should be
   * delayed for (in milliseconds).
   * @param {?boolean} doDelayError
   * if true, both success and error signals are delayed.
   * if false, only success signals are delayed.
   * @returns {Completable}
   */
  delay(amount, doDelayOnError) {
    return delay(this, amount, doDelayOnError);
  }

  /**
   * Delays the actual subscription to the current
   * Completable until the given time delay elapsed.
   *
   * @param {!Number} amount
   * the time amount to wait with the subscription
   * (in milliseconds).
   * @returns {Completable}
   */
  delaySubscription(amount) {
    return delaySubscription(this, amount);
  }

  /**
   * Returns a Completable instance that calls the given
   * onTerminate callback after this Completable completes
   * normally or with an exception.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doAfterTerminate.png" class="diagram">
   *
   * @param {!function} action
   * the callback to call after this Completable terminates
   * @returns {Completable}
   */
  doAfterTerminate(action) {
    return doAfterTerminate(this, action);
  }

  /**
   * Calls the specified action after this Completable
   * signals onError or onComplete or gets aborted by
   * the downstream.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doFinally.png" class="diagram">
   *
   * In case of a race between a terminal event and
   * a dispose call, the provided onFinally action
   * is executed once per subscription.
   * @param {!function} action
   * the action called when this Completable terminates or gets aborted.
   * @returns {Completable}
   */
  doFinally(action) {
    return doFinally(this, action);
  }

  /**
   * Calls the shared Action if a Observer subscribed
   * to the current Completable aborts the common
   * Disposable it received via onSubscribe.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doOnDispose.png" class="diagram">
   *
   * @param {!function} action
   * the action to call when the child subscriber aborts the subscription.
   * @returns {Completable}
   */
  doOnAbort(action) {
    return doOnAbort(this, action);
  }

  /**
   * Returns a Completable which calls the given onComplete
   * callback if this Completable completes.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doOnComplete.png" class="diagram">
   *
   * @param {!function} action
   * the callback to call when this emits an onComplete event
   * @returns {Completable}
   */
  doOnComplete(action) {
    return doOnComplete(this, action);
  }

  /**
   * Returns a Completable which calls the given onError
   * callback if this Completable emits an error.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doOnError.png" class="diagram">
   *
   * @param {!function(x: Error)} consumer
   * the error callback
   * @returns {Completable}
   */
  doOnError(consumer) {
    return doOnError(this, consumer);
  }

  /**
   * Returns a Completable which calls the given onEvent callback
   * with the Error for an onError or undefined for an onComplete
   * signal from this Completable before delivering said signal
   * to the downstream.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doOnEvent.png" class="diagram">
   *
   * @param {!function(x: Error)} consumer
   * the event callback
   * @returns {Completable}
   */
  doOnEvent(consumer) {
    return doOnEvent(this, consumer);
  }

  /**
   * Returns a Completable instance that calls the given onSubscribe
   * callback with the AbortController that child subscribers receive
   * on subscription.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doOnSubscribe.png" class="diagram">
   *
   * @param {!function(ac: AbortController)} consumer
   * the callback called when a child subscriber subscribes
   * @returns {Completable}
   */
  doOnSubscribe(consumer) {
    return doOnSubscribe(this, consumer);
  }

  /**
   * Returns a Completable instance that calls the given onTerminate
   * callback just before this Completable completes normally or with
   * an exception.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doOnTerminate.png" class="diagram">
   *
   * @param {!function} action
   * the callback to call just before this Completable terminates
   * @returns {Completable}
   */
  doOnTerminate(action) {
    return doOnTerminate(this, action);
  }

  /**
   * Creates a Completable with an error.
   *
   * Signals an error returned by the callback function
   * for each individual Observer or returns a Completable
   * that invokes a subscriber's onError method when
   * the subscriber subscribes to it.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.error.png" class="diagram">
   *
   * @param {!(function():Error|Error)} err
   * - the callable that is called for each individual
   * Observer and returns or throws a value to be emitted.
   * - the particular value to pass to onError
   * @returns {Completable}
   */
  static error(err) {
    return error(err);
  }

  /**
   * Returns a Completable which when subscribed, executes
   * the callable function, ignores its normal result and
   * emits onError or onComplete only.
   *
   * If the result is a Promise-like instance, the
   * Observer is then subscribed to the Promise through
   * the fromPromise operator.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.fromCallable.png" class="diagram">
   * If the callable throws an exception, the respective Error
   * is delivered to the downstream via Observer.onError(Error),
   * except when the downstream has aborted this Completable source.
   *
   * @param {!function} callable
   * the callable instance to execute for each subscriber
   * @returns {Completable}
   */
  static fromCallable(callable) {
    return fromCallable(callable);
  }

  /**
   * Converts a Promise-like instance into a Completable.
   *
   * @param {!(Promise|Thennable|PromiseLike)} promise
   * The promise to be converted into a Completable.
   * @returns {Completable}
   */
  static fromPromise(promise) {
    return fromPromise(promise);
  }

  /**
   * Provides a Promise-like interface for emitting signals.
   *
   * @param {!function(resolve: function, reject:function))} fulfillable
   * A function that accepts two parameters: resolve and reject,
   * similar to a Promise construct.
   * @returns {Completable}
   */
  static fromResolvable(subscriber) {
    return fromResolvable(subscriber);
  }

  /**
   * This method requires advanced knowledge about building operators,
   * please consider other standard composition methods first;
   *
   * Returns a Completable which, when subscribed to, invokes the operator
   * method for each individual downstream Completable and allows the
   * insertion of a custom operator by accessing the downstream's
   * Observer during this subscription phase and providing a new Observer,
   * containing the custom operator's intended business logic,
   * that will be used in the subscription process going further upstream.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.lift.png" class="diagram">
   *
   * Generally, such a new Observer will wrap the downstream's Observer
   * and forwards the onError and onComplete events from the upstream
   * directly or according to the emission pattern the custom operator's
   * business logic requires. In addition, such operator can intercept
   * the flow control calls of abort and signal.abort that would have
   * traveled upstream and perform additional actions depending on
   * the same business logic requirements.
   *
   * Note that implementing custom operators via this lift()
   * method adds slightly more overhead by requiring an additional
   * allocation and indirection per assembled flows. Instead,
   * using compose() method and  creating a transformer function
   * with it is recommended.
   *
   * @param {!function(observer: Observer)} consumer
   * the callback called when a child subscriber subscribes
   * @returns {Completable}
   */
  lift(operator) {
    return lift(this, operator);
  }

  /**
   * Returns a Completable instance that subscribes to all sources at once
   * and completes only when all source Completables complete or one of them
   * emits an error.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.merge.png" class="diagram">
   *
   * @param {Iterable} sources
   * the iterable sequence of sources.
   * @returns {Completable}
   */
  static merge(sources) {
    return merge(sources);
  }

  /**
   * Returns a Completable which subscribes to this and the other Completable
   * and completes when both of them complete or one emits an error.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.mergeWith.png" class="diagram">
   *
   * @param {Completable} other
   * the other Completable instance
   * @returns {Completable}
   */
  mergeWith(other) {
    return mergeWith(this, other);
  }

  /**
   * Returns a Completable that never calls onError or onComplete.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.never.png" class="diagram">
   *
   * @returns {Completable}
   * the singleton instance that never calls onError or onComplete
   */
  static never() {
    return never();
  }

  /**
   * Returns a Completable instance that if this Completable emits an
   * error and the predicate returns true, it will emit an onComplete
   * and swallow the throwable.
   *
   * If no predicate is provided, returns a Completable instance that
   * if this Completable emits an error, it will emit an onComplete
   * and swallow the error
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.onErrorComplete.png" class="diagram">
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.onErrorComplete.f.png" class="diagram">
   *
   * @param {?function(e: Error):boolean} completion
   * the predicate to call when an Error is emitted which should return
   * true if the Error should be swallowed and replaced with an onComplete.
   * @returns {Completable}
   */
  onErrorComplete(completion) {
    return onErrorComplete(this, completion);
  }

  /**
   * Returns a Completable instance that when encounters an error from
   * this Completable, calls the specified mapper function that returns
   * another Completable instance for it and resumes the execution with it.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.onErrorResumeNext.png" class="diagram">
   *
   * @param {function(e:Error):Completable} other
   * the mapper function that takes the error and should return a
   * Completable as continuation.
   * @returns {Completable}
   */
  onErrorResumeNext(other) {
    return onErrorResumeNext(this, other);
  }

  /**
   * Returns a Completable that subscribes repeatedly at most
   * the given times to this Completable. If no amount is given,
   * subscribes repeatedly until aborted.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.repeat.png" class="diagram">
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.repeat.n.png" class="diagram">
   *
   * @param {?number} times
   * the number of times the resubscription should happen
   * @returns {Completable}
   */
  repeat(times) {
    return repeat(this, times);
  }

  /**
   * Re-subscribe to the current Completable if the given predicate
   * returns true when the Completable fails with an onError.
   *
   * If no predicate is provided, repeatedly re-subscribes to
   * the current Completable indefinitely if it fails with an onError.
   *
   * @param {?function(retries: number, err: Error):boolean} predicate
   * the predicate called with the resubscription count and the failure
   * value and should return true if a resubscription should happen.
   * @returns {Completable}
   */
  retry(indicator) {
    return retry(this, indicator);
  }

  /**
   * Returns a Completable that repeatedly subscribes to this Completable
   * so long as the given stop supplier returns false.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.repeatUntil.png" class="diagram">
   *
   * @param {!function():boolean} stopper
   * the supplier that should return true to stop resubscribing.
   * @returns {Completable}
   */
  repeatUntil(stopper) {
    return repeatUntil(this, stopper);
  }

  /**
   * Returns a Completable which first runs the other Completable
   * then this completable if the other completed normally.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.startWith.png" class="diagram">
   *
   * @param {Completable} other
   *  the other completable to run first
   * @returns {Completable}
   */
  startWith(other) {
    return startWith(this, other);
  }

  /**
   * Returns a Completable that emits the item emitted by
   * the source Completable until a second Completable emits an
   * item. Upon emission of an item from other,
   * this will emit an error rather than go to
   * Observer.onSuccess.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.takeuntil.c.png" class="diagram">
   *
   * @param {Completable} other
   * the Completable whose emitted item will cause takeUntil
   * to emit the item from the source Completable
   * @returns {Completable}
   * a Completable that emits the item emitted by the source
   * Completable until such time as other emits its item
   */
  takeUntil(other) {
    return takeUntil(this, other);
  }

  /**
   * Signals a TimeoutException if the current Completable
   * doesn't signal a completion within the specified
   * timeout window.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.timeout.png" class="diagram">
   *
   * @param {!Number} amount
   * amount of time in milliseconds.
   * @returns {Completable}
   */
  timeout(amount) {
    return timeout(this, amount);
  }

  /**
   * Signals completion after the given delay for each Observer.
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.timer.png" class="diagram">
   *
   * @param {!Number} amount
   * the amount of time in milliseconds.
   * @returns {Completable}
   */
  static timer(amount) {
    return timer(amount);
  }

  /**
   * @desc
   * Subscribes with an Object that is an Observer.
   *
   * An Object is considered as an Observer if:
   *  - if it has the method onSubscribe
   *  - if it has the method onComplete (optional)
   *  - if it has the method onError (optional)
   *
   * The onSubscribe method is called when subscribeWith
   * or subscribe is executed. This method receives an
   * AbortController instance.
   *
   * @param {!Object} observer
   * @returns {undefined}
   */
  subscribeWith(observer) {
    if (isObserver(observer)) {
      this.subscribeActual(observer);
    }
  }

  /**
   * @desc
   * Subscribes to a Completable instance with an onComplete
   * and an onError method.
   *
   * onError receives a string(or an Error object).
   *
   * Both are called once.
   * @param {?function(x: any)} onComplete
   * the function you have designed to accept the emission
   * from the Completable
   * @param {?function(x: any)} onError
   * the function you have designed to accept any error
   * notification from the Completable
   * @returns {AbortController}
   * an AbortController reference can request the Completable to abort.
   */
  subscribe(onComplete, onError) {
    const controller = new AbortController();
    let once = false;
    this.subscribeActual({
      onSubscribe(ac) {
        ac.signal.addEventListener('abort', () => {
          if (!once) {
            once = true;
            if (!controller.signal.aborted) {
              controller.abort();
            }
          }
        });
        controller.signal.addEventListener('abort', () => {
          if (!once) {
            once = true;
            if (!ac.signal.aborted) {
              ac.abort();
            }
          }
        });
      },
      onComplete,
      onError,
    });
    return controller;
  }

  /**
   * Converts the Completable to a Promise instance.
   *
   * @returns {Promise}
   */
  toPromise() {
    return new Promise((res, rej) => {
      this.subscribe(res, rej);
    });
  }

  /**
   * Converts the Completable to a Promise instance
   * and attaches callbacks to it.
   *
   * @param {!function():any} onFulfill
   * @param {?function(x: Error):any} onReject
   * @returns {Promise}
   */
  then(onFulfill, onReject) {
    return this.toPromise().then(onFulfill, onReject);
  }

  /**
   * Converts the Completable to a Promise instance
   * and attaches an onRejection callback to it.
   *
   * @param {!function(x: Error):any} onReject
   * @returns {Promise}
   */
  catch(onReject) {
    return this.toPromise().catch(onReject);
  }
}
