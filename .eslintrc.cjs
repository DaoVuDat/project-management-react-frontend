module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:jsx-a11y/recommended',
		'plugin:react/jsx-runtime',
		'prettier',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'tailwind.config.js'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh', 'react', 'react-hooks', 'jsx-a11y', 'prettier'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['./tsconfig.json', './tsconfig.node.json'],
		tsconfigRootDir: __dirname,
	},
	rules: {
		'@typescript-eslint/no-misused-promises': [2, {
			'checksVoidReturn': {
				'attributes': false,
			},
		}],
		'@typescript-eslint/no-unsafe-call': [0],
		'@typescript-eslint/no-unsafe-assignment': [0],
		'@typescript-eslint/no-unsafe-argument': [0],
		'@typescript-eslint/no-unsafe-member-access': [0],
		'@typescript-eslint/no-unsafe-return': [0],
	},
};
