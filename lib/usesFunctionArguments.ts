export const usesFunctionArguments = (func: Function): boolean => {
	return /\barguments\b/g.test(func.toString());
};
