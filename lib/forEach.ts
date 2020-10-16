/**
 * Iterates through 'array' by index and performs the callback on each element of array until the callback
 * returns a truthy value, then returns that value.
 * If no such value is found, the callback is applied to each element of array and undefined is returned.
 */

export function forEach<T, U>(array: readonly T[] | undefined, callback: (element: T, index: number) => U | undefined): U | undefined {
	if (array) {
		for (let i = 0; i < array.length; i++) {
			const result = callback(array[i], i);
			if (result) {
				return result;
			}
		}
	}
	return undefined;
}
