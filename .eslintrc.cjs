module.exports = {
	root: true,
	env: {browser: true, es2020: true},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:react-hooks/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:react/jsx-runtime',
		'prettier',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh', 'react', 'react-hooks', 'jsx-a11y', 'prettier'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['./tsconfig.json', './tsconfig.node.json'],
		tsconfigRootDir: __dirname,
	},
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{allowConstantExport: true},
		],
	},
}
