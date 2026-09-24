import { StructuredUserProfile, InterviewStage, CertificateRecord } from '../../types/onboarding';
import { LocaleTranslations } from '../../types/language';
import { OCCUPATION_BENCHMARKS } from '../intelligence/occupationService';

export interface ExtractionResult {
  updatedProfile: StructuredUserProfile;
  extractedFields: string[];
  isCorrection: boolean;
  acknowledgmentText?: string;
  nextStage: InterviewStage;
  nextQuestionPrompt: string;
  isReadyForReview: boolean;
}

// Known occupation mapping for speech recognition variations & common pronunciations
const PHONETIC_OCCUPATION_MAP: Record<string, string> = {
  // Automotive
  'mechanic': 'Automobile Diagnostic Technician',
  'mekanik': 'Automobile Diagnostic Technician',
  'mekanic': 'Automobile Diagnostic Technician',
  'mecenic': 'Automobile Diagnostic Technician',
  'mecanic': 'Automobile Diagnostic Technician',
  'makanic': 'Automobile Diagnostic Technician',
  'machenic': 'Automobile Diagnostic Technician',
  'auto mechanic': 'Automobile Diagnostic Technician',
  'car mechanic': 'Automobile Diagnostic Technician',
  'bike mechanic': 'Automobile Diagnostic Technician',
  'motorcycle mechanic': 'Automobile Diagnostic Technician',
  'automobile': 'Automobile Diagnostic Technician',
  'engine': 'Automobile Diagnostic Technician',
  'மெக்கானிக்': 'Automobile Diagnostic Technician',
  'வாகன பழுது': 'Automobile Diagnostic Technician',

  // Electrician & Power
  'electrician': 'Industrial Automation Electrician',
  'electrishan': 'Industrial Automation Electrician',
  'electritian': 'Industrial Automation Electrician',
  'electrisian': 'Industrial Automation Electrician',
  'wireman': 'Industrial Automation Electrician',
  'wiring': 'Industrial Automation Electrician',
  'எலக்ட்ரீசியன்': 'Industrial Automation Electrician',
  'மின்சார': 'Industrial Automation Electrician',

  // EV & Clean Mobility
  'ev': 'Electric Vehicle (EV) Service Specialist',
  'electric vehicle': 'Electric Vehicle (EV) Service Specialist',
  'battery': 'Electric Vehicle (EV) Service Specialist',

  // Solar & Renewables
  'solar': 'Solar PV Rooftop Installation Technician',
  'rooftop solar': 'Solar PV Rooftop Installation Technician',
  'சூரிய ஒளி': 'Solar PV Rooftop Installation Technician',

  // Textiles & Garments
  'tailor': 'Apparel Pattern Maker & Garment Specialist',
  'taylor': 'Apparel Pattern Maker & Garment Specialist',
  'stitching': 'Apparel Pattern Maker & Garment Specialist',
  'sewing': 'Apparel Pattern Maker & Garment Specialist',
  'தையல்': 'Apparel Pattern Maker & Garment Specialist',

  // Driving & Logistics
  'driver': 'Commercial Vehicle / Heavy Vehicle Driver',
  'drayvar': 'Commercial Vehicle / Heavy Vehicle Driver',
  'driving': 'Commercial Vehicle / Heavy Vehicle Driver',
  'heavy driver': 'Commercial Vehicle / Heavy Vehicle Driver',
  'டிரைவர்': 'Commercial Vehicle / Heavy Vehicle Driver',
  'ஓட்டுநர்': 'Commercial Vehicle / Heavy Vehicle Driver',

  // Plumbing
  'plumber': 'Plumbing & Hydraulic System Specialist',
  'plamber': 'Plumbing & Hydraulic System Specialist',
  'pipe fitter': 'Plumbing & Hydraulic System Specialist',
  'பிளம்பர்': 'Plumbing & Hydraulic System Specialist',

  // Carpentry & Woodwork
  'carpenter': 'General Woodworking Carpenter & Joiner',
  'karpenter': 'General Woodworking Carpenter & Joiner',
  'woodwork': 'General Woodworking Carpenter & Joiner',
  'கார்பெண்டர்': 'General Woodworking Carpenter & Joiner',
  'தச்சர்': 'General Woodworking Carpenter & Joiner',

  // Welding & Fabrication
  'welder': 'Shielded Metal Arc Welder (SMAW)',
  'welding': 'Shielded Metal Arc Welder (SMAW)',
  'fabricator': 'Shielded Metal Arc Welder (SMAW)',
  'வெல்டர்': 'Shielded Metal Arc Welder (SMAW)',

  // Machining & Fitting
  'fitter': 'Fitter / Mechanical Assembly Technician',
  'fiter': 'Fitter / Mechanical Assembly Technician',
  'machinist': 'CNC Machinist & Turning Operator',
  'cnc': 'CNC Machinist & Turning Operator',

  // Digital & Office
  'tally': 'Digital Office & GST Accounts Associate',
  'accounts': 'Digital Office & GST Accounts Associate',
  'data entry': 'Digital Office & GST Accounts Associate',
  'computer': 'Digital Office & GST Accounts Associate',

  // Retail & Sales
  'retail': 'Retail Sales Associate & Customer Service',
  'sales': 'Retail Sales Associate & Customer Service',
  'shop': 'Retail Sales Associate & Customer Service',

  // Agriculture
  'farmer': 'Modern Agricultural Field Technician',
  'farming': 'Modern Agricultural Field Technician',
  'agriculture': 'Modern Agricultural Field Technician',
  'விவசாயம்': 'Modern Agricultural Field Technician',

  // Catering & Cooking
  'cook': 'Commercial Kitchen & Catering Chef Assistant',
  'cooking': 'Commercial Kitchen & Catering Chef Assistant',
  'chef': 'Commercial Kitchen & Catering Chef Assistant',
  'சமையல்': 'Commercial Kitchen & Catering Chef Assistant',

  // Construction
  'mason': 'Construction Mason & Bricklayer',
  'masonry': 'Construction Mason & Bricklayer',
  'builder': 'Construction Mason & Bricklayer',
  'கட்டிடம்': 'Construction Mason & Bricklayer',
};

export class OnboardingIntelligence {
  /**
   * Initializes empty profile with default state
   */
  static createInitialProfile(
    arg1: string = 'en',
    arg2: string = 'India',
    arg3?: string
  ): StructuredUserProfile {
    let languageCode = 'en';
    let locationName = 'India';

    if (arg1 === 'aisha' || arg1 === 'arjun') {
      languageCode = arg2 || 'en';
      locationName = arg3 || 'India';
    } else {
      languageCode = arg1 || 'en';
      locationName = arg2 || 'India';
    }
    return {
      personal: {
        name: '',
        age: null,
        gender: '',
        preferredLanguage: languageCode,
        profilePhoto: undefined,
      },
      education: {
        level: '',
        qualification: '',
        certifications: [],
        training: [],
      },
      certificates: [],
      livelihood: {
        currentOccupation: '',
        previousOccupations: [],
        yearsOfExperience: null,
        workSituation: 'Looking for work',
      },
      skills: [],
      tools: [],
      interests: [],
      aspirations: [],
      workPreferences: {
        employmentType: '',
        preferredLocation: '',
        willingToRelocate: undefined,
        availability: '',
        environmentPreference: 'Workshop / Field',
        shiftPreference: 'day',
      },
      constraints: [],
      status: 'draft',
      metadata: {
        languageCode,
        locationName,
        companionId: 'aisha',
        lastUpdated: new Date().toISOString(),
        isSubmitted: false,
      },
    };
  }

  /**
   * Parses user input, extracts structured data across multiple dimensions,
   * handles "I don't know any work" / "no experience" appropriately,
   * detects corrections & determines next adaptive question.
   */
  static processUserInput(
    rawText: string,
    currentProfile: StructuredUserProfile,
    currentStage: InterviewStage,
    t: LocaleTranslations
  ): ExtractionResult {
    const text = rawText.trim();
    const lower = text.toLowerCase();
    const updated = JSON.parse(JSON.stringify(currentProfile)) as StructuredUserProfile;
    const extractedFields: string[] = [];
    let isCorrection = false;
    let acknowledgment: string | undefined = undefined;

    // 1. Correction Detection ("actually", "not X but Y", "என் பெயர் X அல்ல", "गलती से")
    const isCorrectionPattern =
      lower.includes('actually') ||
      lower.includes('not ') ||
      lower.includes('mistake') ||
      lower.includes('change') ||
      lower.includes('wrong') ||
      text.includes('அல்ல') ||
      text.includes('இல்லை') ||
      text.includes('மாற்று') ||
      text.includes('தவறு') ||
      text.includes('नहीं') ||
      text.includes('गलती');

    if (isCorrectionPattern) {
      isCorrection = true;
    }

    // 2. Special Check: "I don't know any work" / "No job" / "Fresher" / "Unskilled"
    const noJobPattern =
      lower.includes("don't know any work") ||
      lower.includes("don't know work") ||
      lower.includes("no work") ||
      lower.includes("no job") ||
      lower.includes("don't have a job") ||
      lower.includes("dont have a job") ||
      lower.includes("not working") ||
      lower.includes("not skilled") ||
      lower.includes("unskilled") ||
      lower.includes("i am a fresher") ||
      lower.includes("fresher") ||
      lower.includes("never worked") ||
      lower.includes("don't know anything") ||
      text.includes("வேலை தெரியாது") ||
      text.includes("வேலை இல்லை") ||
      text.includes("தொழில் தெரியாது") ||
      text.includes("வேலை செய்யவில்லை") ||
      text.includes("புதியவர்") ||
      text.includes("काम नहीं आता") ||
      text.includes("कोई काम नहीं") ||
      text.includes("नौकरी नहीं है");

    if (noJobPattern && (currentStage === 'LIVELIHOOD' || !updated.livelihood.currentOccupation)) {
      updated.livelihood.currentOccupation = 'None (Fresher / Seeking Training)';
      updated.livelihood.yearsOfExperience = 0;
      updated.livelihood.workSituation = 'Seeking Training & First Job';
      extractedFields.push('currentOccupation', 'yearsOfExperience');

      acknowledgment =
        t.onboarding.unskilledEncouragement ||
        "That is completely fine. We will start from your interests and design a suitable practical learning path for you.";
    }

    // 3. Special Check: "No experience" / "Zero experience" / "Never worked" / "Fresher"
    const noExpPattern =
      lower.includes("no experience") ||
      lower.includes("zero experience") ||
      lower.includes("0 experience") ||
      lower.includes("have not worked") ||
      lower.includes("haven't worked") ||
      lower.includes("never worked") ||
      lower.includes("i am new") ||
      lower.includes("i'm new") ||
      lower.includes("not yet") ||
      lower === "no" ||
      lower === "zero" ||
      lower === "0" ||
      lower === "none" ||
      lower === "nothing" ||
      text.includes("அனுபவம் இல்லை") ||
      text.includes("இல்லை") ||
      text.includes("புதியவர்") ||
      text.includes("எதுவும் இல்லை") ||
      text.includes("अनुभव नहीं") ||
      text.includes("कोई अनुभव नहीं");

    if (noExpPattern && (currentStage === 'LIVELIHOOD' || updated.livelihood.yearsOfExperience === null)) {
      updated.livelihood.yearsOfExperience = 0;
      extractedFields.push('yearsOfExperience');
    }

    // 4. Age Extraction (numbers 14 to 90)
    const ageMatch = text.match(/\b(1[4-9]|[2-8][0-9]|90)\b/);
    if (ageMatch && (currentStage === 'PERSONAL' || lower.includes('age') || lower.includes('old') || text.includes('வயது') || text.includes('उम्र'))) {
      const parsedAge = parseInt(ageMatch[0], 10);
      if (updated.personal.age !== parsedAge) {
        if (updated.personal.age !== null) isCorrection = true;
        updated.personal.age = parsedAge;
        extractedFields.push('age');
      }
    }

    // 5. Name Extraction
    let nameText = text;
    if (isCorrectionPattern) {
      const parts = text.split(/(?:அல்ல|இல்லை|not\s+[^,]+but|but|,)/i);
      nameText = parts[parts.length - 1].trim();
    }

    if ((currentStage === 'PERSONAL' && !updated.personal.name) || (isCorrectionPattern && (lower.includes('name') || text.includes('பெயர்')))) {
      let cleanName = nameText
        .replace(/^(?:hello|hi|hey|vanakkam|namaste|வணக்கம்|नमस्ते)\s*[,.]?\s*/i, '')
        .replace(/^(?:my name is|i am|i'm|call me|myself|this is|my name's)\s+/i, '')
        .replace(/^(?:என் பெயர்|நான்|என்னை)\s+/i, '')
        .replace(/^(?:मेरा नाम|मैं)\s+/i, '')
        .replace(/\s+(?:என்று அழையுங்கள்|என்கிறார்கள்|है)$/i, '')
        .trim();

      // Strip age or occupation if provided in single sentence
      cleanName = cleanName.split(/[,&|\n]|\b(?:age|வயது|उम्र|years|வருடம்|working as|doing)\b/i)[0].trim();

      const nameParts = cleanName.split(/\s+/).slice(0, 3);
      cleanName = nameParts.join(' ').replace(/[.,!?]+$/, '');

      // Guard: do not set common filler words as name
      const forbiddenNames = ['yes', 'no', 'hello', 'hi', 'aisha', 'okay', 'skip', 'work', 'job', 'ஆம்', 'இல்லை'];
      if (cleanName.length >= 2 && cleanName.length <= 40 && !forbiddenNames.includes(cleanName.toLowerCase())) {
        if (updated.personal.name && updated.personal.name !== cleanName) {
          isCorrection = true;
        }
        updated.personal.name = cleanName;
        extractedFields.push('name');
      }
    } else if (lower.includes('name is') || text.includes('என் பெயர்') || text.includes('मेरा नाम')) {
      const matches = Array.from(text.matchAll(/(?:name is|என் பெயர்|मेरा नाम)\s+([A-Za-z\u0B80-\u0BFF\u0900-\u097F]+)/gi));
      if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        if (lastMatch && lastMatch[1]) {
          const newName = lastMatch[1].trim();
          updated.personal.name = newName;
          extractedFields.push('name');
        }
      }
    }

    // 6. Gender Extraction
    if (lower.includes('female') || lower.includes('woman') || text.includes('பெண்') || text.includes('महिला')) {
      updated.personal.gender = 'Female';
      extractedFields.push('gender');
    } else if (lower.includes('male') || lower.includes('man') || text.includes('ஆண்') || text.includes('पुरुष')) {
      updated.personal.gender = 'Male';
      extractedFields.push('gender');
    } else if (lower.includes('other') || text.includes('மற்றவை') || text.includes('अन्य')) {
      updated.personal.gender = 'Other';
      extractedFields.push('gender');
    }

    // 7. Years of Experience Extraction ("7 years", "three years", "4 வருட அனுபவம்", "இரண்டு வருடம்")
    const isExplicitExpUtterance = /(?:experience|exp|work(?:ing)?|அனுபவம்|வேலை)/i.test(text);

    if (!extractedFields.includes('yearsOfExperience') && (currentStage === 'LIVELIHOOD' || isExplicitExpUtterance)) {
      const wordNumbers: Record<string, number> = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
        'ஒரு': 1, 'ரெண்டு': 2, 'இரண்டு': 2, 'மூன்று': 3, 'மூணு': 3,
        'நான்கு': 4, 'நாலு': 4, 'ஐந்து': 5, 'அஞ்சு': 5,
        'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाँच': 5
      };

      const expMatch = text.match(/(\d+)\s*(?:years?|yrs?|வருட(?:ங்கள்?)?|வருடம்?|ஆண்டுகள்?|வருஷம்|साल|വർഷം|ವರ್ಷ)(?!\s*old)/i);
      const wordMatch = lower.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten|ஒரு|ரெண்டு|இரண்டு|மூன்று|மூணு|நான்கு|நாலு|ஐந்து|அஞ்சு|एक|दो|तीन|चार|पांच|पाँच)\s*(?:years?|yrs?|வருட(?:ங்கள்?)?|வருடம்?|ஆண்டுகள்?|வருஷம்|साल|വർഷം|ವರ್ಷ)?/i);

      if (expMatch) {
        const parsedExp = parseInt(expMatch[1], 10);
        if (parsedExp >= 0 && parsedExp <= 50) {
          updated.livelihood.yearsOfExperience = parsedExp;
          extractedFields.push('yearsOfExperience');
        }
      } else if (wordMatch && wordNumbers[wordMatch[1]] !== undefined) {
        updated.livelihood.yearsOfExperience = wordNumbers[wordMatch[1]];
        extractedFields.push('yearsOfExperience');
      } else if (currentStage === 'LIVELIHOOD') {
        const singleNumMatch = text.match(/\b(\d+)\b/);
        if (singleNumMatch) {
          const parsed = parseInt(singleNumMatch[1], 10);
          if (parsed >= 0 && parsed <= 50) {
            updated.livelihood.yearsOfExperience = parsed;
            extractedFields.push('yearsOfExperience');
          }
        }
      }
    }

    // 8. Education Extraction
    if (
      currentStage === 'EDUCATION' ||
      lower.includes('10th') ||
      lower.includes('12th') ||
      lower.includes('iti') ||
      lower.includes('diploma') ||
      lower.includes('degree') ||
      lower.includes('graduate') ||
      lower.includes('b.tech') ||
      lower.includes('b.e') ||
      lower.includes('b.com') ||
      lower.includes('b.sc') ||
      lower.includes('school') ||
      lower.includes('college') ||
      text.includes('படிப்பு') ||
      text.includes('கல்வி')
    ) {
      let eduLevel = '';
      if (lower.includes('iti') || lower.includes('vocational') || text.includes('தொழிற்பயிற்சி')) {
        eduLevel = 'Vocational / ITI';
      } else if (lower.includes('diploma') || text.includes('டிப்ளமோ')) {
        eduLevel = 'Diploma';
      } else if (
        lower.includes('degree') ||
        lower.includes('graduate') ||
        lower.includes('b.a') ||
        lower.includes('b.com') ||
        lower.includes('b.sc') ||
        lower.includes('b.tech') ||
        lower.includes('b.e') ||
        text.includes('பட்டதாரி')
      ) {
        eduLevel = 'Graduate / Degree';
      } else if (lower.includes('12th') || lower.includes('plus two') || lower.includes('+2') || text.includes('12-வது')) {
        eduLevel = '12th Standard / Higher Secondary';
      } else if (lower.includes('10th') || lower.includes('sslc') || text.includes('10-வது')) {
        eduLevel = '10th Standard / Matriculation';
      } else if (lower.includes('primary') || lower.includes('5th') || lower.includes('8th') || text.includes('தொடக்கப்பள்ளி')) {
        eduLevel = 'Primary / Middle School';
      } else if (lower.includes('none') || lower.includes('no formal') || text.includes('படிக்கவில்லை')) {
        eduLevel = 'Informal / No Formal Schooling';
      } else if (currentStage === 'EDUCATION') {
        eduLevel = text;
      }

      if (eduLevel) {
        updated.education.level = eduLevel;
        updated.education.qualification = text;
        extractedFields.push('education');
      }
    }

    // 9. Occupation / Livelihood Extraction (with phonetic & fuzzy matching)
    if (!extractedFields.includes('currentOccupation')) {
      let detectedOccupation: string | null = null;

      // Scan known phonetic & translation vocabulary
      for (const [key, canonicalTitle] of Object.entries(PHONETIC_OCCUPATION_MAP)) {
        if (lower.includes(key) || text.includes(key)) {
          detectedOccupation = canonicalTitle;
          break;
        }
      }

      // Scan benchmark keywords
      if (!detectedOccupation) {
        for (const benchmark of OCCUPATION_BENCHMARKS) {
          const match = benchmark.keywords.some((k) => lower.includes(k) || text.includes(k));
          if (match) {
            detectedOccupation = benchmark.title;
            break;
          }
        }
      }

      if (detectedOccupation) {
        updated.livelihood.currentOccupation = detectedOccupation;
        extractedFields.push('currentOccupation');
      } else if (currentStage === 'LIVELIHOOD' && !updated.livelihood.currentOccupation && text.length > 2) {
        const cleaned = text.replace(/^(?:i am a|i work as|i do|my job is|work as|naan)\s+/i, '').trim();
        updated.livelihood.currentOccupation = cleaned;
        extractedFields.push('currentOccupation');
      }
    }

    // 10. Skills Extraction
    const skillKeywords = [
      'repair', 'troubleshooting', 'servicing', 'wiring', 'welding', 'diagnostics',
      'scanning', 'cutting', 'stitching', 'driving', 'cooking', 'masonry', 'plumbing',
      'multimeter', 'fitting', 'assembly', 'painting', 'safety', 'பழுது', 'இயக்குதல்', 'தையல்'
    ];
    const hasSkillMention = skillKeywords.some((k) => lower.includes(k) || text.includes(k));

    if (currentStage === 'SKILLS' || hasSkillMention) {
      const splitItems = text
        .split(/[,&|\n]|and|மற்றும்|तथा/)
        .map((s) => s.trim())
        .filter((s) => s.length > 2);

      splitItems.forEach((item) => {
        if (!updated.skills.some((sk) => sk.name.toLowerCase() === item.toLowerCase())) {
          updated.skills.push({
            name: item,
            category: 'practical',
          });
        }
      });
      if (splitItems.length > 0) extractedFields.push('skills');
    }

    // 11. Tools & Machinery Extraction
    const toolKeywords = ['scanner', 'multimeter', 'wrench', 'drill', 'lathe', 'sewing machine', 'tractor', 'spanner', 'tester', 'கருவி', 'இயந்திரம்'];
    const hasToolMention = toolKeywords.some((k) => lower.includes(k) || text.includes(k));

    if ((currentStage === 'SKILLS' && updated.skills.length > 0) || hasToolMention) {
      const splitTools = text
        .split(/[,&|\n]|and|மற்றும்/)
        .map((s) => s.trim())
        .filter((s) => s.length > 2);

      splitTools.forEach((tItem) => {
        if (!updated.tools.includes(tItem)) {
          updated.tools.push(tItem);
        }
      });
      if (splitTools.length > 0) extractedFields.push('tools');
    }

    // 12. Interests & Career Aspirations
    const aspirationKeywords = [
      'aim', 'goal', 'aspire', 'dream', 'supervisor', 'manager', 'own shop',
      'business', 'technician', 'lead', 'இலக்கு', 'கனவு', 'சொந்த தொழில்', 'முன்னேற'
    ];
    const hasAspMention = aspirationKeywords.some((k) => lower.includes(k) || text.includes(k));

    if (currentStage === 'INTERESTS' || hasAspMention) {
      const aspItems = text
        .split(/[,&|\n]|and|மற்றும்/)
        .map((s) => s.trim())
        .filter((s) => s.length > 2);

      aspItems.forEach((aItem) => {
        if (!updated.aspirations.includes(aItem)) {
          updated.aspirations.push(aItem);
        }
        if (!updated.interests.includes(aItem)) {
          updated.interests.push(aItem);
        }
      });
      if (aspItems.length > 0) {
        extractedFields.push('interests', 'aspirations');
      }
    }

    // 13. Preferred Work Location
    const districtList = [
      'salem', 'coimbatore', 'chennai', 'madurai', 'tiruchirappalli', 'trichy',
      'erode', 'tiruppur', 'namakkal', 'karur', 'dindigul', 'bengaluru', 'bangalore',
      'சேலம்', 'கோயம்புத்தூர்', 'கோவை', 'சென்னை', 'மதுரை', 'திருச்சி', 'ஈரோடு', 'திருப்பூர்'
    ];
    for (const d of districtList) {
      if (lower.includes(d) || text.includes(d)) {
        updated.workPreferences.preferredLocation = d.charAt(0).toUpperCase() + d.slice(1);
        extractedFields.push('preferredLocation');
        break;
      }
    }
    if (!updated.workPreferences.preferredLocation && (lower.includes('local') || text.includes('உள்ளூர்') || text.includes('சொந்த ஊர்'))) {
      updated.workPreferences.preferredLocation = 'Local District';
      extractedFields.push('preferredLocation');
    }

    // 14. Relocation Preference Extraction
    if (
      lower.includes('relocate') ||
      lower.includes('anywhere') ||
      text.includes('வெளியூர்') ||
      text.includes('இடமாற்றம்') ||
      (currentStage === 'PREFERENCES' &&
        updated.workPreferences.preferredLocation &&
        updated.workPreferences.willingToRelocate === undefined &&
        (lower.includes('yes') || lower.includes('no') || text.includes('ஆம்') || text.includes('சம்மதம்') || text.includes('முடியாது') || text.includes('தயார்')))
    ) {
      if (lower.includes('no') || lower.includes('not willing') || lower.includes('cannot') || text.includes('முடியாது') || text.includes('இல்லை') || text.includes('சம்மதமில்லை')) {
        updated.workPreferences.willingToRelocate = false;
      } else {
        updated.workPreferences.willingToRelocate = true;
      }
      extractedFields.push('willingToRelocate');
    }

    // 15. Availability Extraction
    if (lower.includes('immediate') || lower.includes('today') || lower.includes('tomorrow') || text.includes('உடனடியாக') || text.includes('உடனே')) {
      updated.workPreferences.availability = 'immediate';
      extractedFields.push('availability');
    } else if (lower.includes('week') || text.includes('வாரம்')) {
      updated.workPreferences.availability = 'next-week';
      extractedFields.push('availability');
    } else if (lower.includes('month') || lower.includes('15 days') || lower.includes('2 weeks') || text.includes('மாதம்') || text.includes('நாட்கள்')) {
      updated.workPreferences.availability = '1-month';
      extractedFields.push('availability');
    } else if (lower.includes('flexible') || text.includes('வசதிக்கேற்ப') || text.includes('நேரத்திற்கு ஏற்ப')) {
      updated.workPreferences.availability = 'flexible';
      extractedFields.push('availability');
    }

    // 16. Employment Type Preference (Wage vs Self-Employed vs Both)
    if (lower.includes('self-employed') || lower.includes('salary') || lower.includes('both') || text.includes('சுயதொழில்') || text.includes('சம்பளம்') || text.includes('இரண்டும்')) {
      if (lower.includes('both') || text.includes('இரண்டும்')) {
        updated.workPreferences.employmentType = 'Both (Wage Job & Self-Employment)';
      } else if (lower.includes('self') || text.includes('சுயதொழில்') || text.includes('स्वरोजगार')) {
        updated.workPreferences.employmentType = 'Self-employed / Business';
      } else if (lower.includes('salary') || lower.includes('job') || text.includes('மாதச் சம்பளம்') || text.includes('வேலை')) {
        updated.workPreferences.employmentType = 'Wage Employment';
      }
      extractedFields.push('employmentType');
    }

    // 17. Relevant Certificates / Licenses
    if (lower.includes('license') || lower.includes('licence') || lower.includes('certificate') || lower.includes('iti certified') || text.includes('சான்றிதழ்') || text.includes('லைசென்ஸ்') || text.includes('உரிமம்')) {
      const certName = text.trim();
      const newCert: CertificateRecord = {
        id: `cert_${Date.now()}`,
        name: certName,
        issuingOrg: 'Recognized Training Body',
        verificationStatus: 'unverified',
      };
      if (!updated.certificates.some((c) => c.name.toLowerCase() === certName.toLowerCase())) {
        updated.certificates.push(newCert);
        extractedFields.push('certificates');
      }
    }

    // 18. Constraints Extraction
    if (
      currentStage === 'CONSTRAINTS' ||
      lower.includes('cannot') ||
      lower.includes('only day') ||
      lower.includes('timing') ||
      text.includes('மட்டும்') ||
      text.includes('முடியாது') ||
      text.includes('கட்டுப்பாடு') ||
      text.includes('இயலாது')
    ) {
      if (text.length > 2 && !updated.constraints.includes(text) && !noExpPattern) {
        updated.constraints.push(text);
        extractedFields.push('constraints');
      }
    }

    // Correction acknowledgment
    if (isCorrection || isCorrectionPattern) {
      acknowledgment = t.onboarding.correctionAck;
    }

    // Determine Next Adaptive Stage & Question
    const { nextStage, nextQuestionPrompt, isReadyForReview } = this.getNextQuestion(updated, currentStage, t);

    updated.metadata.lastUpdated = new Date().toISOString();

    return {
      updatedProfile: updated,
      extractedFields,
      isCorrection,
      acknowledgmentText: acknowledgment,
      nextStage,
      nextQuestionPrompt,
      isReadyForReview,
    };
  }

  /**
   * Intelligently selects next question based on missing fields.
   * Never repeats an already answered question.
   */
  static getNextQuestion(
    profile: StructuredUserProfile,
    currentStage: InterviewStage,
    t: LocaleTranslations
  ): { nextStage: InterviewStage; nextQuestionPrompt: string; isReadyForReview: boolean } {
    // 1. Name
    if (!profile.personal.name) {
      return {
        nextStage: 'PERSONAL',
        nextQuestionPrompt: t.onboarding.questionName,
        isReadyForReview: false,
      };
    }

    // 2. Age
    if (profile.personal.age === null) {
      return {
        nextStage: 'PERSONAL',
        nextQuestionPrompt: t.onboarding.questionAge,
        isReadyForReview: false,
      };
    }

    // 3. Gender
    if (!profile.personal.gender) {
      return {
        nextStage: 'PERSONAL',
        nextQuestionPrompt: t.onboarding.questionGender,
        isReadyForReview: false,
      };
    }

    // 4. Education
    if (!profile.education.level && !profile.education.qualification) {
      return {
        nextStage: 'EDUCATION',
        nextQuestionPrompt: t.onboarding.questionEducation,
        isReadyForReview: false,
      };
    }

    // 5. Current/Previous Occupation
    if (!profile.livelihood.currentOccupation) {
      return {
        nextStage: 'LIVELIHOOD',
        nextQuestionPrompt: t.onboarding.questionLivelihood,
        isReadyForReview: false,
      };
    }

    // 6. Years of Experience (Skipped if user is a fresher or has no experience: yearsOfExperience = 0)
    if (profile.livelihood.yearsOfExperience === null) {
      return {
        nextStage: 'LIVELIHOOD',
        nextQuestionPrompt: t.onboarding.questionExperienceYears,
        isReadyForReview: false,
      };
    }

    // 7. Practical Skills
    if (profile.skills.length === 0) {
      return {
        nextStage: 'SKILLS',
        nextQuestionPrompt: t.onboarding.questionSkills,
        isReadyForReview: false,
      };
    }

    // 8. Tools & Machines
    if (profile.tools.length === 0 && profile.skills.length > 0) {
      return {
        nextStage: 'SKILLS',
        nextQuestionPrompt: t.onboarding.questionTools,
        isReadyForReview: false,
      };
    }

    // 9. Interests
    if (profile.interests.length === 0) {
      return {
        nextStage: 'INTERESTS',
        nextQuestionPrompt: t.onboarding.questionInterests,
        isReadyForReview: false,
      };
    }

    // 10. Career Aspiration / Target Pathway
    if (!profile.aspirations || profile.aspirations.length === 0) {
      return {
        nextStage: 'INTERESTS',
        nextQuestionPrompt: t.onboarding.questionAspirations || t.onboarding.questionInterests,
        isReadyForReview: false,
      };
    }

    // 11. Preferred Work Location
    if (!profile.workPreferences.preferredLocation) {
      return {
        nextStage: 'PREFERENCES',
        nextQuestionPrompt: t.onboarding.questionLocationPref || t.onboarding.questionPreferences,
        isReadyForReview: false,
      };
    }

    // 12. Relocation Openness
    if (profile.workPreferences.willingToRelocate === undefined) {
      return {
        nextStage: 'PREFERENCES',
        nextQuestionPrompt: t.onboarding.questionRelocation || t.onboarding.questionPreferences,
        isReadyForReview: false,
      };
    }

    // 13. Availability / Start Date
    if (!profile.workPreferences.availability) {
      return {
        nextStage: 'PREFERENCES',
        nextQuestionPrompt: t.onboarding.questionAvailability || t.onboarding.questionPreferences,
        isReadyForReview: false,
      };
    }

    // 14. Relevant Practical Work Constraints (Optional - only ask once)
    if (profile.constraints.length === 0 && currentStage !== 'CONSTRAINTS') {
      return {
        nextStage: 'CONSTRAINTS',
        nextQuestionPrompt: t.onboarding.questionConstraints,
        isReadyForReview: false,
      };
    }

    // All questions answered -> Ready for Review!
    return {
      nextStage: 'REVIEW',
      nextQuestionPrompt: t.onboarding.reviewTransitionVoice,
      isReadyForReview: true,
    };
  }
}
