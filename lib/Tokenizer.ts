import { CharacterCodes } from "./CharacterCodes";
import { LanguageVariant } from "./LanguageVariant";
import { ScriptTarget } from "./ScriptTarget";
import { unicodeES3IdentifierPart, unicodeES3IdentifierStart, unicodeES5IdentifierPart, unicodeES5IdentifierStart, unicodeESNextIdentifierPart, unicodeESNextIdentifierStart } from "./UnicodeIndentifiers";

export function isIdentifierStart(ch: number, languageVersion: ScriptTarget | undefined): boolean {
	return ch >= CharacterCodes.A && ch <= CharacterCodes.Z || ch >= CharacterCodes.a && ch <= CharacterCodes.z ||
		ch === CharacterCodes.$ || ch === CharacterCodes._ ||
		ch > CharacterCodes.maxAsciiCharacter && isUnicodeIdentifierStart(ch, languageVersion);
}

export function isIdentifierPart(ch: number, languageVersion: ScriptTarget | undefined, identifierVariant?: LanguageVariant): boolean {
	return ch >= CharacterCodes.A && ch <= CharacterCodes.Z || ch >= CharacterCodes.a && ch <= CharacterCodes.z ||
		ch >= CharacterCodes._0 && ch <= CharacterCodes._9 || ch === CharacterCodes.$ || ch === CharacterCodes._ ||
		// "-" and ":" are valid in JSX Identifiers
		(identifierVariant === LanguageVariant.JSX ? (ch === CharacterCodes.minus || ch === CharacterCodes.colon) : false) ||
		ch > CharacterCodes.maxAsciiCharacter && isUnicodeIdentifierPart(ch, languageVersion);
}

export function isIdentifierText(name: string, languageVersion: ScriptTarget | undefined, identifierVariant?: LanguageVariant): boolean {
	let ch = codePointAt(name, 0);
	if (!isIdentifierStart(ch, languageVersion)) {
		return false;
	}

	for (let i = charSize(ch); i < name.length; i += charSize(ch)) {
		if (!isIdentifierPart(ch = codePointAt(name, i), languageVersion, identifierVariant)) {
			return false;
		}
	}

	return true;
}
function isUnicodeIdentifierPart(code: number, languageVersion: ScriptTarget | undefined) {
	return languageVersion! >= ScriptTarget.ES2015 ?
		lookupInUnicodeMap(code, unicodeESNextIdentifierPart) :
		languageVersion === ScriptTarget.ES5 ? lookupInUnicodeMap(code, unicodeES5IdentifierPart) :
			lookupInUnicodeMap(code, unicodeES3IdentifierPart);
}
function charSize(ch: number) {
	if (ch >= 0x10000) {
		return 2;
	}
	return 1;
}
const codePointAt: (s: string, i: number) => number = (String.prototype as any).codePointAt ? (s, i) => (s as any).codePointAt(i) : function codePointAt(str, i): number {
	// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
	const size = str.length;
	// Account for out-of-bounds indices:
	if (i < 0 || i >= size) {
		return undefined!; // String.codePointAt returns `undefined` for OOB indexes
	}
	// Get the first code unit
	const first = str.charCodeAt(i);
	// check if it’s the start of a surrogate pair
	if (first >= 0xD800 && first <= 0xDBFF && size > i + 1) { // high surrogate and there is a next code unit
		const second = str.charCodeAt(i + 1);
		if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
			// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
			return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
		}
	}
	return first;
};

export function isUnicodeIdentifierStart(code: number, languageVersion: ScriptTarget | undefined) {
	return languageVersion! >= ScriptTarget.ES2015 ?
		lookupInUnicodeMap(code, unicodeESNextIdentifierStart) :
		languageVersion === ScriptTarget.ES5 ? lookupInUnicodeMap(code, unicodeES5IdentifierStart) :
			lookupInUnicodeMap(code, unicodeES3IdentifierStart);
}
function lookupInUnicodeMap(code: number, map: readonly number[]): boolean {
	// Bail out quickly if it couldn't possibly be in the map.
	if (code < map[0]) {
		return false;
	}

	// Perform binary search in one of the Unicode range maps
	let lo = 0;
	let hi: number = map.length;
	let mid: number;

	while (lo + 1 < hi) {
		mid = lo + (hi - lo) / 2;
		// mid has to be even to catch a range's beginning
		mid -= mid % 2;
		if (map[mid] <= code && code <= map[mid + 1]) {
			return true;
		}

		if (code < map[mid]) {
			hi = mid;
		}
		else {
			lo = mid + 2;
		}
	}

	return false;
}
