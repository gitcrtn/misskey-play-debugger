import path from 'path';
import { defineConfig } from 'vite'
import pluginVue from '@vitejs/plugin-vue';

import locales from './src/misskey/locales';
import meta from './src/misskey/meta.json';
import pluginJson5 from './vite.json5';

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.json5', '.svg', '.sass', '.scss', '.css', '.vue'];

const hash = (str: string, seed = 0): number => {
	let h1 = 0xdeadbeef ^ seed,
		h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	
	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const BASE62_DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function toBase62(n: number): string {
	if (n === 0) {
		return '0';
	}
	let result = ''; 
	while (n > 0) {
		result = BASE62_DIGITS[n % BASE62_DIGITS.length] + result;
		n = Math.floor(n / BASE62_DIGITS.length);
	}
	
	return result;
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '.',
  plugins: [
    pluginVue({
      reactivityTransform: true,
    }),
    pluginJson5(),
  ],

  resolve: {
    extensions,
    alias: {
      // '/client-assets/': __dirname + '/assets/',
      // '/static-assets/': __dirname + '/../backend/assets/',
      // '/fluent-emojis/': __dirname + '/../../fluent-emojis/dist/',
      // '/fluent-emoji/': __dirname + '/../../fluent-emojis/dist/',
      '/twemoji/': __dirname + '/node_modules/@discordapp/twemoji/dist/svg/',
    },
  },

  css: {
    modules: {
      generateScopedName: (name, filename, css) => {
        const id = (path.relative(__dirname, filename.split('?')[0]) + '-' + name).replace(/[\\\/\.\?&=]/g, '-').replace(/(src-|vue-)/g, '');
        if (process.env.NODE_ENV === 'production') {
          return 'x' + toBase62(hash(id)).substring(0, 4);
        } else {
          return id;
        }
      },
    },
  },

  define: {
    _VERSION_: JSON.stringify(meta.version),
    _LANGS_: JSON.stringify(Object.entries(locales).map(([k, v]) => [k, v._lang_])),
    _ENV_: JSON.stringify(process.env.NODE_ENV),
    _DEV_: process.env.NODE_ENV !== 'production',
    _PERF_PREFIX_: JSON.stringify('Misskey:'),
    _DATA_TRANSFER_DRIVE_FILE_: JSON.stringify('mk_drive_file'),
    _DATA_TRANSFER_DRIVE_FOLDER_: JSON.stringify('mk_drive_folder'),
    _DATA_TRANSFER_DECK_COLUMN_: JSON.stringify('mk_deck_column'),
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },

  build: {
    target: [
      'chrome108',
      'firefox109',
      'safari16',
    ],
    cssCodeSplit: true,
    emptyOutDir: false,
    sourcemap: process.env.NODE_ENV === 'development',
    reportCompressedSize: false,
  },
})
