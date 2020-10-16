export const getFunctionParameters = (func: Function): string[] => {
	const paramsRaw = new RegExp('(?:' + func.name + '\\s*|^)\\s*\\((.*?)\\)')
		.exec(func.toString().replace(/\n/g, ''));

	if (paramsRaw === null) {
		return [];
	}

	const params = paramsRaw[1]
		.replace(/\/\*.*?\*\//g, '')
		.replace(/ /g, '')
		.split(",");

	return params[0].length === 0 ? [] : params;
};
