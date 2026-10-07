export type UrlEncodeMode = 'encode' | 'decode'

/** Component = encodeURIComponent; uri = encodeURI (keeps :/?#& etc.). */
export type UrlEncodeStyle = 'component' | 'uri'

export type UrlEncodeOptions = {
  style: UrlEncodeStyle
  /** When decoding, treat bare + as a space (application/x-www-form-urlencoded). */
  plusAsSpace: boolean
}

export type UrlEncodeResult =
  | {
      ok: true
      text: string
      inputChars: number
      outputChars: number
    }
  | {
      ok: false
      error: string
      empty?: boolean
    }

export const DEFAULT_URL_ENCODE_OPTIONS: UrlEncodeOptions = {
  style: 'component',
  plusAsSpace: true,
}

export const SAMPLE_PLAIN =
  'https://bentotools.app/search?q=hello world&lang=en'
export const SAMPLE_ENCODED =
  'https%3A%2F%2Fbentotools.app%2Fsearch%3Fq%3Dhello%20world%26lang%3Den'

export function encodeUrl(
  input: string,
  options: UrlEncodeOptions = DEFAULT_URL_ENCODE_OPTIONS,
): UrlEncodeResult {
  if (!input) {
    return { ok: false, empty: true, error: 'Paste text or a URL to encode.' }
  }

  try {
    const text =
      options.style === 'uri' ? encodeURI(input) : encodeURIComponent(input)
    return {
      ok: true,
      text,
      inputChars: input.length,
      outputChars: text.length,
    }
  } catch {
    return { ok: false, error: 'Could not encode that text.' }
  }
}

export function decodeUrl(
  input: string,
  options: UrlEncodeOptions = DEFAULT_URL_ENCODE_OPTIONS,
): UrlEncodeResult {
  if (!input.trim()) {
    return { ok: false, empty: true, error: 'Paste an encoded URL or text to decode.' }
  }

  try {
    let prepared = input
    if (options.plusAsSpace) {
      prepared = prepared.replace(/\+/g, ' ')
    }
    const text =
      options.style === 'uri' ? decodeURI(prepared) : decodeURIComponent(prepared)
    return {
      ok: true,
      text,
      inputChars: input.length,
      outputChars: text.length,
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Could not decode that text.'
    return {
      ok: false,
      error:
        message.includes('URI malformed') || message.includes('malformed')
          ? 'That does not look like valid percent-encoding.'
          : message,
    }
  }
}

export function convertUrl(
  mode: UrlEncodeMode,
  input: string,
  options: UrlEncodeOptions = DEFAULT_URL_ENCODE_OPTIONS,
): UrlEncodeResult {
  return mode === 'encode'
    ? encodeUrl(input, options)
    : decodeUrl(input, options)
}

export function sampleForMode(
  mode: UrlEncodeMode,
  style: UrlEncodeStyle,
): string {
  if (mode === 'encode') return SAMPLE_PLAIN
  // Component sample is fully encoded; URI sample keeps structural chars.
  if (style === 'uri') {
    return 'https://bentotools.app/search?q=hello%20world&lang=en'
  }
  return SAMPLE_ENCODED
}
