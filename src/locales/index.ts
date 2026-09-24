import { SupportedLanguageCode, LanguageOption, LocaleTranslations } from '../types/language';
import { en } from './en';
import { ta } from './ta';
import { hi } from './hi';
import { te } from './te';
import { kn } from './kn';
import { ml } from './ml';
import { mr } from './mr';

// Full 22 Scheduled Languages of India + English
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', scriptHint: 'Pan-India', direction: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', scriptHint: 'Tamil Nadu & Puducherry', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', scriptHint: 'North & Central India', direction: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', scriptHint: 'Andhra Pradesh & Telangana', direction: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', scriptHint: 'Karnataka', direction: 'ltr' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', scriptHint: 'Kerala & Lakshadweep', direction: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', scriptHint: 'Maharashtra & Goa', direction: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', scriptHint: 'West Bengal & Tripura', direction: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', scriptHint: 'Gujarat & Daman/Diu', direction: 'ltr' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', scriptHint: 'Punjab & Chandigarh', direction: 'ltr' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', scriptHint: 'Odisha', direction: 'ltr' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', scriptHint: 'Assam', direction: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', scriptHint: 'National & Telangana/J&K', direction: 'rtl' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', scriptHint: 'Classical', direction: 'ltr' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر', scriptHint: 'Jammu & Kashmir', direction: 'rtl' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', scriptHint: 'Sikkim & West Bengal', direction: 'ltr' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', scriptHint: 'Goa & Coastal Karnataka', direction: 'ltr' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', scriptHint: 'Bihar & Jharkhand', direction: 'ltr' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', scriptHint: 'Manipur', direction: 'ltr' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर\'', scriptHint: 'Assam & Bodoland', direction: 'ltr' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', scriptHint: 'Jammu', direction: 'ltr' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', scriptHint: 'Jharkhand & Odisha', direction: 'ltr' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', scriptHint: 'National & Gujarat', direction: 'rtl' },
];

export const translations: Record<SupportedLanguageCode, LocaleTranslations> = {
  en,
  ta,
  hi,
  te,
  kn,
  ml,
  mr,
  // Regional fallbacks configured with appropriate Indic typography
  bn: {
    ...en,
    location: {
      ...en.location,
      suggestionTitle: 'পরামর্শকৃত ভাষা',
      confirmAndProceed: 'চালিয়ে যান',
    },
    companionSelect: {
      ...en.companionSelect,
      title: 'আপনার গাইড নির্বাচন করুন',
      subtitle: 'আপনার যাত্রায় সহায়তার জন্য আয়েশা বা অর্জুনকে বেছে নিন।',
      chooseAisha: 'আয়েশা নির্বাচন করুন',
      chooseArjun: 'অর্জুন নির্বাচন করুন',
    },
  },
  gu: {
    ...hi,
    location: {
      ...hi.location,
      suggestionTitle: 'સૂચવેલ ભાષા',
      confirmAndProceed: 'આગળ વધો',
    },
    companionSelect: {
      ...hi.companionSelect,
      title: 'તમારા માર્ગદર્શક પસંદ કરો',
      subtitle: 'તમારી યાત્રામાં સહાય માટે આયશા અથવા અર્જુનને પસંદ કરો.',
      chooseAisha: 'આયશા પસંદ કરો',
      chooseArjun: 'અર્જુન પસંદ કરો',
    },
  },
  pa: {
    ...hi,
    location: {
      ...hi.location,
      suggestionTitle: 'ਸੁਝਾਈ ਗਈ ਭਾਸ਼ਾ',
      confirmAndProceed: 'ਅੱਗੇ ਵਧੋ',
    },
    companionSelect: {
      ...hi.companionSelect,
      title: 'ਆਪਣਾ ਗਾਈਡ ਚੁਣੋ',
      subtitle: 'ਆਪਣੀ ਯਾਤਰਾ ਵਿੱਚ ਮਦਦ ਲਈ ਆਇਸ਼ਾ ਜਾਂ ਅਰਜੁਨ ਨੂੰ ਚੁਣੋ।',
      chooseAisha: 'ਆਇਸ਼ਾ ਚੁਣੋ',
      chooseArjun: 'ਅਰਜੁਨ ਚੁਣੋ',
    },
  },
  or: {
    ...hi,
    location: {
      ...hi.location,
      suggestionTitle: 'ପରାମର୍ଶିତ ଭାଷା',
      confirmAndProceed: 'ଆଗକୁ ବଢ଼ନ୍ତୁ',
    },
    companionSelect: {
      ...hi.companionSelect,
      title: 'ଆପଣଙ୍କ ଗାଇଡ୍ ବାଛନ୍ତୁ',
      subtitle: 'ଆପଣଙ୍କ ଯାତ୍ରାରେ ସାହାଯ୍ୟ ପାଇଁ ଆୟେଶା କିମ୍ବା ଅର୍ଜୁନଙ୍କୁ ଚୟନ କରନ୍ତୁ।',
      chooseAisha: 'ଆୟେଶା ବାଛନ୍ତୁ',
      chooseArjun: 'ଅର୍ଜୁନ ବାଛନ୍ତୁ',
    },
  },
  as: {
    ...en,
    location: {
      ...en.location,
      suggestionTitle: 'পৰামৰ্শিত ভাষা',
      confirmAndProceed: 'আগবাঢ়ক',
    },
    companionSelect: {
      ...en.companionSelect,
      title: 'আপোনাৰ মাৰ্গদৰ্শক বাছক',
      subtitle: 'আপোনাৰ যাত্ৰাত সহায়ৰ বাবে আয়েশা বা অৰ্জুনক বাছক।',
      chooseAisha: 'আয়েশা বাছক',
      chooseArjun: 'অৰ্জুন বাছক',
    },
  },
  ur: {
    ...hi,
    location: {
      ...hi.location,
      suggestionTitle: 'تجویز کردہ زبان',
      confirmAndProceed: 'آگے بڑھیں',
    },
    companionSelect: {
      ...hi.companionSelect,
      title: 'اپنا رہنما منتخب کریں',
      subtitle: 'اپنے سفر میں مدد کے لیے عائشہ یا ارجن کا انتخاب کریں۔',
      chooseAisha: 'عائشہ کا انتخاب کریں',
      chooseArjun: 'ارجن کا انتخاب کریں',
    },
  },
  sa: { ...hi },
  ks: { ...hi },
  ne: { ...hi },
  kok: { ...mr },
  mai: { ...hi },
  mni: { ...en },
  brx: { ...en },
  doi: { ...hi },
  sat: { ...hi },
  sd: { ...hi },
};

export const getTranslation = (langCode: string): LocaleTranslations => {
  if (langCode in translations) {
    return translations[langCode as SupportedLanguageCode];
  }
  return translations.en;
};

export const getLanguageDirection = (langCode: string): 'ltr' | 'rtl' => {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
  return lang?.direction || 'ltr';
};
