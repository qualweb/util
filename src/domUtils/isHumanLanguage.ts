import { franc } from 'franc-min';

/**
 * Checks if the given text is considered a human language.
 *
 * @param text Text to check language
 * @returns True if a language is detected
 */
function isHumanLanguage(text: string): boolean {
  return franc(text, { minLength: 2 }) !== 'und';
}

export default isHumanLanguage;
