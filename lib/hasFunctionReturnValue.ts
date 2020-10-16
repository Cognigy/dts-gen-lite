export const hasFunctionReturnValue = (func: Function): boolean => {
	return /\breturn\b/g.test(func.toString());
};
