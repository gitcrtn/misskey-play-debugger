import { each, size, has, chain, pickBy, mapValues } from 'lodash';
import { ref } from 'vue';

import { FN_NATIVE } from '@syuilo/aiscript/built/interpreter/value';
import { std } from '@syuilo/aiscript/built/interpreter/lib/std';

import { registerAsUiLib } from '../misskey/scripts/aiscript/ui';
import { createAiScriptEnv } from '../misskey/scripts/aiscript/api';

const io = {
    print: FN_NATIVE(([v]) => {
    }),
    readline: FN_NATIVE(args => {
    }),
};

const componentsUi = ref([]);

const mkLibs = {
    ...createAiScriptEnv({
        storageKey: 'flash:playground',
        mockAPI: ref(),
    }),
    ...registerAsUiLib(componentsUi.value, _root => {
    }),
};

const defaultVars = {
    ...mkLibs,
    ...std,
    ...io,
};

const regArgs = /^\(([\s\S]*?)\) =>/;
const regAsyncArgs = /^async \(([\s\S]*?)\) =>/;
const regArgsOnly = /^\[([\s\S]*?)\]/;

const regNoArgs = /^\(\) =>/;
const regAsyncNoArgs = /^async \(\) =>/;

const parseArgsCount = parsed => {
    if (parsed[1].endsWith(']')) return parsed[1].split(',').length;
    const argsOnly = regArgsOnly.exec(parsed[1]);
    return argsOnly[1].split(',').length;
};

const getArgsCount = fn => {
    let parsed = regNoArgs.exec(fn);
    if (parsed) return 0;

    parsed = regAsyncNoArgs.exec(fn);
    if (parsed) return 0;

    parsed = regArgs.exec(fn);
    if (parsed) return parseArgsCount(parsed);

    parsed = regAsyncArgs.exec(fn);
    if (parsed) return parseArgsCount(parsed);

    return -1;
};

const defaultFunctions = chain(defaultVars)
    .pickBy((value, key) => value.type == 'fn')
    .mapValues(value => {
        return {
            argsCount: value.native.length ? getArgsCount(value.native) : 0,
        }
    })
    .value();

const regLf = /\r\n|\r|\n/;

const getLocation = (code, loc) => {
    const allLineCount = code.split(regLf).length;
    const lines = code.slice(loc.start).split(regLf);
    const lineNumber = allLineCount - lines.length + 1;
    return `L${lineNumber}`;
};

const checkCaller = (callers, node) => {
    if (node.type == 'call') {
        callers.push({
            name: node.target.name,
            argsCount: size(node.args),
            loc: node.loc,
        })
        return true;
    }
    return false;
};

const checkFunction = (callers, functions, node) => {
    if (node.type == 'def' && node.expr.type == 'fn') {
        functions[node.name] = {
            argsCount: size(node.expr.args),
        };
        each(node.expr.children, (child) => {
            checkCaller(callers, child);
        });
        return true;
    }
    return false;
};

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
