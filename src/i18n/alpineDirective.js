/**
 * Registers the `x-t` Alpine directive for inline i18n translations.
 * Usage: <span x-t="'dashboard:title'"></span>
 * Re-evaluates on language change via i18next's languageChanged event.
 *
 * @module i18n/alpineDirective
 */

import { i18next } from './index.js';

/**
 * @param {import('alpinejs').Alpine} Alpine
 */
export function registerI18nDirective(Alpine) {
  Alpine.directive('t', (el, { expression }, { evaluate, effect, cleanup }) => {
    const update = () => {
      const key = evaluate(expression);
      if (typeof key !== 'string') return;
      el.textContent = i18next.t(key);
    };

    effect(update);

    const onLangChange = () => update();
    i18next.on('languageChanged', onLangChange);
    cleanup(() => i18next.off('languageChanged', onLangChange));
  });
}
