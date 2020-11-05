import ToText, { DateFormatter, GetText } from './totext'
import ENGLISH, { Language } from './i18n'
import RRule from '../rrule'
import parseText from './parsetext'
import { Frequency } from '../types'

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
ToText.IMPLEMENTED[Frequency.HOURLY] = common
ToText.IMPLEMENTED[Frequency.MINUTELY] = common
ToText.IMPLEMENTED[Frequency.DAILY] = ['byhour'].concat(common)
ToText.IMPLEMENTED[Frequency.WEEKLY] = common
ToText.IMPLEMENTED[Frequency.MONTHLY] = common
ToText.IMPLEMENTED[Frequency.YEARLY] = ['byweekno', 'byyearday'].concat(common)

const { isFullyConvertible } = ToText

// =============================================================================
// Export
// =============================================================================

const toText = function (rrule: RRule, gettext?: GetText, language?: Language, dateFormatter?: DateFormatter) {
  return new ToText(rrule, gettext, language, dateFormatter).toString()
}

function fromText (text: string, language ?: Language) {
  return new RRule(parseText(text, language) || undefined)
}

export const NLP = {
  toText,
  fromText,
  parseText,
  isFullyConvertible
}
