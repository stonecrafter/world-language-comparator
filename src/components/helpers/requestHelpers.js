import axios from 'axios';

export const getTranslations = async (en) => {
  const no = await getTransForLang(en, 'no');
  const da = await getTransForLang(en, 'da');
  const sv = await getTransForLang(en, 'sv');
  const is = await getTransForLang(en, 'is');
  const fi = await getTransForLang(en, 'fi');

  return { no, da, sv, is, fi };
}

//////////

const YANDEX_API_KEY = 'trnsl.1.1.20171202T040150Z.ea09fa01a56d721c.fc8cbd80a88107d905ac537d4c557f2e32cffc18';

const getTransForLang = async (textToTrans, lang) => {
  const encodedText = encodeURIComponent(textToTrans);
  const requestUrl = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${YANDEX_API_KEY}
  &text=${encodedText}&lang=en-${lang}`;
  const { data } = await axios.get(requestUrl);
  return data.text;
}