import { applyTheme, getBuiltinThemes } from './misskey/scripts/theme';

export const setupMisskey = () => {
    // Set d-dark theme.
	getBuiltinThemes().then(themes => applyTheme(themes[0]));
};
