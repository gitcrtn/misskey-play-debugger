import { utils, values } from '@syuilo/aiscript';
//import * as os from '@/os';
//import { $i } from '@/account';
import { miLocalStorage } from '../../local-storage';
import { customEmojis } from '../../custom-emojis';

const $i = null;

export function createAiScriptEnv(opts) {
	let apiRequests = 0;
	return {
		// USER_ID: $i ? values.STR($i.id) : values.NULL,
		// USER_NAME: $i ? values.STR($i.name) : values.NULL,
		// USER_USERNAME: $i ? values.STR($i.username) : values.NULL,
		// CUSTOM_EMOJIS: utils.jsToVal(customEmojis.value),
		USER_ID: 'DUMMY_ID',
		USER_NAME: 'DUMMY_NAME',
		USER_USERNAME: 'DUMMY_USERNAME',
		CUSTOM_EMOJIS: utils.jsToVal(customEmojis.value),
		'Mk:dialog': values.FN_NATIVE(async ([title, text, type]) => {
			console.log(`info alert: title = ${title.value}, text = ${text.value}`);
			/*
			await os.alert({
				type: type ? type.value : 'info',
				title: title.value,
				text: text.value,
			});
			*/
		}),
		'Mk:confirm': values.FN_NATIVE(async ([title, text, type]) => {
			console.log(`question: title = ${title.value}, text = ${text.value}`);
			/*
			const confirm = await os.confirm({
				type: type ? type.value : 'question',
				title: title.value,
				text: text.value,
			});
			return confirm.canceled ? values.FALSE : values.TRUE;
			*/
			return values.TRUE;
		}),
		'Mk:api': values.FN_NATIVE(async ([ep, param, token]) => {
			if (token) utils.assertString(token);
			apiRequests++;
			if (apiRequests > 16) return values.NULL;
			//const res = await os.api(ep.value, utils.valToJs(param), token ? token.value : (opts.token ?? null));
			const res = [];
			return utils.jsToVal(res);
		}),
		'Mk:save': values.FN_NATIVE(([key, value]) => {
			utils.assertString(key);
			miLocalStorage.setItem(`aiscript:${opts.storageKey}:${key.value}`, JSON.stringify(utils.valToJs(value)));
			return values.NULL;
		}),
		'Mk:load': values.FN_NATIVE(([key]) => {
			utils.assertString(key);
			return utils.jsToVal(JSON.parse(miLocalStorage.getItem(`aiscript:${opts.storageKey}:${key.value}`)));
		}),
	};
}
