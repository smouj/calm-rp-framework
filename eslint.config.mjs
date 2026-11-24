import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/build/**', '**/coverage/**', '**/node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      // The domain layer deliberately rejects control characters in user-supplied
      // names, so a range spanning U+0000-U+001F is the intended behaviour rather
      // than an accidental control character in source.
      'no-control-regex': 'off',
    },
  },
);
