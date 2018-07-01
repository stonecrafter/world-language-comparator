import axios from 'axios';

/**
 * Call the api to get translations given an array of selected languages
 * @param {String} textToTrans 
 * @param {Array<String, String>} targetLangs 
 */
export const getTranslations = async (textToTrans, targetLangs) => {
  const translatedResults = [];
  for (const { key, name } of targetLangs) {
    const res = await _getTransForLang(textToTrans, key);
    translatedResults.push({ key, name, value: res });
  }

  return translatedResults;
}

/**
 * Make API call to get list of supported languages
 */
export const getSupportedLangs = async () => {
  return await _getSupportedLangs();
}

//////////

// TODO: May eventually put these methods in an internal backend

const YANDEX_API_KEY = 'trnsl.1.1.20171202T040150Z.ea09fa01a56d721c.fc8cbd80a88107d905ac537d4c557f2e32cffc18';

/**
 * Make API call to get a translation for one language
 * @param {String} textToTrans 
 * @param {String} lang 
 */
const _getTransForLang = async (textToTrans, lang) => {
  const encodedText = encodeURIComponent(textToTrans);
  const requestUrl = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${YANDEX_API_KEY}
  &text=${encodedText}&lang=en-${lang}`;
  const { data } = await axios.get(requestUrl);
  return data.text;
}

/**
 * Make API call to get list of supported languages
 * (private method, may move to server side later)
 */
const _getSupportedLangs = async () => {
  const requestUrl = `https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=${YANDEX_API_KEY}&ui=en`
  const { data } = await axios.get(requestUrl);
  return data.langs;
}