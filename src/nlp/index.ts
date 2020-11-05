import ToText, { DateFormatter, GetText } from './totext'
import ENGLISH, { Language } from './i18n'
import RRule from '../index'
import parseText from './parsetext'

/*!
* rrule.js - Library for working with recurrence rules for calendar dates.
* https://github.com/jakubroztocil/rrule
*
* Copyright 2010, Jakub Roztocil and Lars Schoning
* Licenced under the BSD licence.
* https://github.com/jakubroztocil/rrule/blob/master/LICENCE
*
*/

const common = [
  'count',
  'until',
  'interval',
  'byweekday',
  'bymonthday',
  'bymonth'
]

ToText.IMPLEMENTED = []
ToText.IMPLEMENTED[RRule.HOURLY] = common
ToText.IMPLEMENTED[RRule.MINUTELY] = common
ToText.IMPLEMENTED[RRule.DAILY] = ['byhour'].concat(common)
ToText.IMPLEMENTED[RRule.WEEKLY] = common
ToText.IMPLEMENTED[RRule.MONTHLY] = common
ToText.IMPLEMENTED[RRule.YEARLY] = ['byweekno', 'byyearday'].concat(common)

// =============================================================================
// Export
// =============================================================================

const toText = function (rrule: RRule, gettext?: GetText, language?: Language, dateFormatter?: DateFormatter) {
  return new ToText(rrule, gettext, language, dateFormatter).toString()
}

export const { isFullyConvertible } = ToText

export let Nlp: {
  isFullyConvertible: typeof isFullyConvertible
  toText: typeof toText
} = { isFullyConvertible, toText }

export function fromText(text: string, language ?: Language) {
  return new RRule(parseText(text, language) || undefined)
}