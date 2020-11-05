import dateutil from './dateutil'

import IterResult, { IterArgs } from './iterresult'
import CallbackIterResult from './callbackiterresult'
import { Days, ParsedOptions, Options, Frequency, QueryMethods, QueryMethodTypes, IterResultType } from './types'
import { parseOptions, initializeOptions } from './parseoptions'
import { parseString } from './parsestring'
import { optionsToString } from './optionstostring'
import { Cache, CacheKeys } from './cache'
import { Weekday } from './weekday'
import { iter } from './iter/index'

// =============================================================================
// RRule
// =============================================================================

/**
 *
 * @param {Options?} options - see <http://labix.org/python-dateutil/#head-cf004ee9a75592797e076752b2a889c10f445418>
 *        The only required option is `freq`, one of RRule.YEARLY, RRule.MONTHLY, ...
 * @constructor
 */
export default class RRule implements QueryMethods {
  public _cache: Cache | null
  public origOptions: Partial<Options>
  public options: ParsedOptions

  // RRule class 'constants'

  constructor (options: Partial<Options> = {}, noCache: boolean = false) {
    // RFC string
    this._cache = noCache ? null : new Cache()

    // used by toString()
    this.origOptions = initializeOptions(options)
    const { parsedOptions } = parseOptions(options)
    this.options = parsedOptions
  }

  static parseString = parseString

  static fromString (str: string) {
    return new RRule(RRule.parseString(str) || undefined)
  }

  static optionsToString = optionsToString

  protected _iter<M extends QueryMethodTypes> (iterResult: IterResult<M>): IterResultType<M> {
    return iter(iterResult, this.options)
  }

  private _cacheGet (what: CacheKeys | 'all', args?: Partial<IterArgs>) {
    if (!this._cache) return false
    return this._cache._cacheGet(what, args)
  }

  public _cacheAdd (
    what: CacheKeys | 'all',
    value: Date[] | Date | null,
    args?: Partial<IterArgs>
  ) {
    if (!this._cache) return
    return this._cache._cacheAdd(what, value, args)
  }

  /**
   * @param {Function} iterator - optional function that will be called
   *                   on each date that is added. It can return false
   *                   to stop the iteration.
   * @return Array containing all recurrences.
   */
  all (iterator?: (d: Date, len: number) => boolean): Date[] {
    if (iterator) {
      return this._iter(new CallbackIterResult('all', {}, iterator))
    }

    let result = this._cacheGet('all') as Date[] | false
    if (result === false) {
      result = this._iter(new IterResult('all', {}))
      this._cacheAdd('all', result)
    }
    return result
  }

  /**
   * Returns all the occurrences of the rrule between after and before.
   * The inc keyword defines what happens if after and/or before are
   * themselves occurrences. With inc == True, they will be included in the
   * list, if they are found in the recurrence set.
   * @return Array
   */
  between (
    after: Date,
    before: Date,
    inc: boolean = false,
    iterator?: (d: Date, len: number) => boolean
  ): Date[] {
    if (!dateutil.isValidDate(after) || !dateutil.isValidDate(before)) throw new Error('Invalid date passed in to RRule.between')
    const args = {
      before,
      after,
      inc
    }

    if (iterator) {
      return this._iter(
        new CallbackIterResult('between', args, iterator)
      )
    }

    let result = this._cacheGet('between', args)
    if (result === false) {
      result = this._iter(new IterResult('between', args))
      this._cacheAdd('between', result, args)
    }
    return result as Date[]
  }

  /**
   * Returns the last recurrence before the given datetime instance.
   * The inc keyword defines what happens if dt is an occurrence.
   * With inc == True, if dt itself is an occurrence, it will be returned.
   * @return Date or null
   */
  before (dt: Date, inc = false): Date {
    if (!dateutil.isValidDate(dt)) throw new Error('Invalid date passed in to RRule.before')
    const args = { dt: dt, inc: inc }
    let result = this._cacheGet('before', args)
    if (result === false) {
      result = this._iter(new IterResult('before', args))
      this._cacheAdd('before', result, args)
    }
    return result as Date
  }

  /**
   * Returns the first recurrence after the given datetime instance.
   * The inc keyword defines what happens if dt is an occurrence.
   * With inc == True, if dt itself is an occurrence, it will be returned.
   * @return Date or null
   */
  after (dt: Date, inc = false): Date {
    if (!dateutil.isValidDate(dt)) throw new Error('Invalid date passed in to RRule.after')
    const args = { dt: dt, inc: inc }
    let result = this._cacheGet('after', args)
    if (result === false) {
      result = this._iter(new IterResult('after', args))
      this._cacheAdd('after', result, args)
    }
    return result as Date
  }

  /**
   * Returns the number of recurrences in this set. It will have go trough
   * the whole recurrence, if this hasn't been done before.
   */
  count (): number {
    return this.all().length
  }

  /**
   * Converts the rrule into its string representation
   * @see <http://www.ietf.org/rfc/rfc2445.txt>
   * @return String
   */
  toString () {
    return optionsToString(this.origOptions)
  }

  /**
   * @return a RRule instance with the same freq and options
   *          as this one (cache is not cloned)
   */
  clone (): RRule {
    return new RRule(this.origOptions)
  }
}
