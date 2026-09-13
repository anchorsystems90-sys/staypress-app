import { describe, expect, it } from 'vitest'
import {
  convertCase,
  countText,
  identifierOutputs,
  isAcronymToken,
  wordsFrom,
  type CaseMode,
} from './convertCase'

const modes: CaseMode[] = [
  'upper',
  'lower',
  'title',
  'sentence',
  'camel',
  'pascal',
  'snake',
  'kebab',
  'constant',
]

describe('convertCase modes', () => {
  it('covers basic hello world for every mode', () => {
    const input = 'hello world'
    expect(convertCase(input, 'upper')).toBe('HELLO WORLD')
    expect(convertCase(input, 'lower')).toBe('hello world')
    expect(convertCase(input, 'title')).toBe('Hello World')
    expect(convertCase(input, 'sentence')).toBe('Hello world')
    expect(convertCase(input, 'camel')).toBe('helloWorld')
    expect(convertCase(input, 'pascal')).toBe('HelloWorld')
    expect(convertCase(input, 'snake')).toBe('hello_world')
    expect(convertCase(input, 'kebab')).toBe('hello-world')
    expect(convertCase(input, 'constant')).toBe('HELLO_WORLD')
    expect(modes).toHaveLength(9)
  })

  it('round-trips common identifier shapes via wordsFrom', () => {
    expect(wordsFrom('customerAccountNumber')).toEqual([
      'customer',
      'Account',
      'Number',
    ])
    expect(wordsFrom('CustomerAccountNumber')).toEqual([
      'Customer',
      'Account',
      'Number',
    ])
    expect(wordsFrom('customer_account_number')).toEqual([
      'customer',
      'account',
      'number',
    ])
    expect(wordsFrom('customer-account-number')).toEqual([
      'customer',
      'account',
      'number',
    ])
    expect(convertCase('customer_account_number', 'camel')).toBe(
      'customerAccountNumber',
    )
    expect(convertCase('customer-account-number', 'pascal')).toBe(
      'CustomerAccountNumber',
    )
  })

  it('handles camel/Pascal acronym boundaries', () => {
    expect(convertCase('xmlHTTPRequest', 'camel')).toBe('xmlHttpRequest')
    expect(convertCase('HTTPSConnection', 'camel')).toBe('httpsConnection')
    expect(convertCase('xmlHTTPRequest', 'snake')).toBe('xml_http_request')
    expect(convertCase('user ID', 'camel')).toBe('userId')
    expect(convertCase('API response code', 'snake')).toBe('api_response_code')
  })
})

describe('acronym preservation', () => {
  it('detects clear ALL-CAPS acronyms only', () => {
    expect(isAcronymToken('AI')).toBe(true)
    expect(isAcronymToken('NASA')).toBe(true)
    expect(isAcronymToken('Ai')).toBe(false)
    expect(isAcronymToken('A')).toBe(false)
  })

  it('preserves acronyms in Title and Sentence case', () => {
    expect(convertCase('AI and NASA launch', 'title')).toBe('AI And NASA Launch')
    expect(convertCase('AI and NASA launch', 'sentence')).toBe(
      'AI and NASA launch',
    )
  })

  it('does not invent speculative name casing', () => {
    expect(convertCase("mcdonald's fries", 'title')).toBe("Mcdonald's Fries")
  })
})

describe('punctuation, numbers, unicode, multiline', () => {
  it('keeps punctuation in prose modes and strips it for identifiers', () => {
    expect(convertCase('hello. world! okay?', 'sentence')).toBe(
      'Hello. World! Okay?',
    )
    expect(convertCase('hello. world! okay?', 'camel')).toBe('helloWorldOkay')
  })

  it('handles numbers and apostrophes without crashing', () => {
    expect(convertCase('3.14 is pi', 'title')).toBe('3.14 Is Pi')
    expect(convertCase("mcdonald's", 'snake')).toBe('mcdonald_s')
  })

  it('supports unicode letters', () => {
    expect(convertCase('naïve café', 'title')).toBe('Naïve Café')
    expect(convertCase('naïve café', 'kebab')).toBe('naïve-café')
  })

  it('collapses multiline input for identifier modes', () => {
    expect(convertCase('line1\nline2', 'camel')).toBe('line1Line2')
    expect(convertCase('line1\nline2', 'title')).toBe('Line1\nLine2')
  })
})

describe('identifierOutputs and counts', () => {
  it('returns all five identifier formats', () => {
    const ids = identifierOutputs('customer account number')
    expect(ids).toEqual({
      camel: 'customerAccountNumber',
      pascal: 'CustomerAccountNumber',
      snake: 'customer_account_number',
      kebab: 'customer-account-number',
      constant: 'CUSTOMER_ACCOUNT_NUMBER',
    })
  })

  it('counts characters and words', () => {
    expect(countText('AI and NASA')).toEqual({ characters: 11, words: 3 })
    expect(countText('')).toEqual({ characters: 0, words: 0 })
  })
})
