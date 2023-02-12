import { each, has } from 'lodash';
import { defaultVars, defaultFunctions } from './lib';
import { checkCaller } from './caller';
import { checkFunction } from './function';
import { getLocation } from './util';

export const lintAst = (code, ast) => {
    let functions = {};
    let callers = [];
    let errors = [];
    let fn;

    each(ast, node => {
        if (checkFunction(callers, functions, node)) return;
        if (checkCaller(callers, node)) return;
    });

    each(callers, caller => {
        if (has(defaultFunctions, caller.name)) {
            fn = defaultFunctions[caller.name];
        } else if (has(functions, caller.name)) {
            fn = functions[caller.name];
        } else {
            const name = caller.name;
            const loc = getLocation(code, caller.loc);
            errors.push(`${loc}: E0001 unknown-function: "${name}" is not defined`)
            return;
        }

        if (fn.argsCount < 0 ) {
            // skip because of unknown count
            return;
        }

        if (caller.argsCount != fn.argsCount) {
            const loc = getLocation(code, caller.loc);
            if (caller.argsCount < fn.argsCount) {
                errors.push(`${loc}: E0002 no-value-for-function-args`);
            } else if (caller.argsCount > fn.argsCount) {
                errors.push(`${loc}: E0003 too-many-function-args`);
            }
            return;
        }
    });

    return errors;
}
