import { chain } from 'lodash';
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

export const defaultVars = {
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

export const defaultFunctions = chain(defaultVars)
    .pickBy((value, key) => value.type == 'fn')
    .mapValues(value => {
        return {
            argsCount: value.native.length ? getArgsCount(value.native) : 0,
        }
    })
    .value();
