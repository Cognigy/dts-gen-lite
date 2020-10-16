import * as tsg from '../lib/index';
import * as dtsgenfull from "dts-gen";
import { expect } from 'chai';

const testModuleNames = [
	// 'fs',
	// 'path',
	// 'lodash',
	'jquery',
	'yargs',
	'ecurve',
];

class MyClass {
	constructor(public arg: number) {

	}
	prototypeMethod(_p: any) { }
	static staticMethod(_s: any) { }
	static staticNum = 32;
	instanceStr = 'inst';
}
const selfRefExpr = {
	a: 32,
	b: 'ok',
	self: <any>null,
};
selfRefExpr.self = selfRefExpr;

const expressions: { [s: string]: any } = {
	Math,
	selfref: selfRefExpr,
	builtIns: { d: new Date(3), arr: ['x'] },
	someArray: [1, 'foo', Math, null, undefined, false],
	badNames: { "*": 10, "default": true, "with": 10, "  ": 3 },
	// someClass: MyClass,
};

describe("Module tests", () => {
	for (const moduleName of testModuleNames) {
		it(`Generates the same declaration for ${moduleName}`, () => {
			const result = tsg.generateIdentifierDeclarationFile(moduleName!, require(moduleName!));
			const orig = dtsgenfull.generateIdentifierDeclarationFile(moduleName!, require(moduleName));
			expect(orig).to.be.equal(result);
		});
	}
});

describe("Expression tests", () => {
	for (const key of Object.keys(expressions)) {
		it(`Generates the same declaration for ${key}`, () => {
			const result = tsg.generateIdentifierDeclarationFile(key!, expressions[key!]);
			const orig = dtsgenfull.generateIdentifierDeclarationFile(key!, expressions[key!]);
			expect(orig).to.be.equal(result);
		});
	}
});
