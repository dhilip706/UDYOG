# Indic Localization Architecture — Aura Platform

## 1. 22 Scheduled Indian Languages

Aura provides native support for all 22 official languages recognized in the Eighth Schedule of the Constitution of India:

| Language | Native Name | Code | Script / Font Stack | Direction |
|---|---|---|---|---|
| **Assamese** | অসমীয়া | `as` | Noto Sans Bengali | LTR |
| **Bengali** | বাংলা | `bn` | Noto Sans Bengali | LTR |
| **Bodo** | बड़ो | `brx` | Noto Sans Devanagari | LTR |
| **Dogri** | डोगरी | `doi` | Noto Sans Devanagari | LTR |
| **Gujarati** | ગુજરાતી | `gu` | Noto Sans Gujarati | LTR |
| **Hindi** | हिन्दी | `hi` | Noto Sans Devanagari | LTR |
| **Kannada** | ಕನ್ನಡ | `kn` | Noto Sans Kannada | LTR |
| **Kashmiri** | کٲشُر | `ks` | Noto Naskh Arabic | RTL |
| **Konkani** | कोंकणी | `kok` | Noto Sans Devanagari | LTR |
| **Maithili** | मैथिली | `mai` | Noto Sans Devanagari | LTR |
| **Malayalam** | മലയാളം | `ml` | Noto Sans Malayalam | LTR |
| **Manipuri** | মৈতৈলোন্ | `mni` | Noto Sans Meetei Mayek / Bengali | LTR |
| **Marathi** | मराठी | `mr` | Noto Sans Devanagari | LTR |
| **Nepali** | नेपाली | `ne` | Noto Sans Devanagari | LTR |
| **Odia** | ଓଡ଼ିଆ | `or` | Noto Sans Oriya | LTR |
| **Punjabi** | ਪੰਜਾਬੀ | `pa` | Noto Sans Gurmukhi | LTR |
| **Sanskrit** | संस्कृतम् | `sa` | Noto Sans Devanagari | LTR |
| **Santali** | ᱥᱟᱱᱛᱟᱲᱤ | `sat` | Noto Sans Ol Chiki | LTR |
| **Sindhi** | سنڌي | `sd` | Noto Naskh Arabic / Devanagari | RTL |
| **Tamil** | தமிழ் | `ta` | Noto Sans Tamil | LTR |
| **Telugu** | తెలుగు | `te` | Noto Sans Telugu | LTR |
| **Urdu** | اُردُو | `ur` | Noto Naskh Arabic | RTL |

---

## 2. Dynamic Location-Based Recommendation

When a user visits the platform:
1. Browser geolocation provides latitude/longitude with explicit, respectful user consent.
2. Coordinates are matched against district/state polygons.
3. The platform suggests the prevailing regional language (e.g. Tamil Nadu → Tamil, West Bengal → Bengali, Maharashtra → Marathi).
4. The user retains complete autonomy to select or switch to any other language at any point.

---

## 3. Typographic Scaling & Layout Adaptability

- **No Hardcoded English Strings**: All components consume translation tokens via typed translation helpers.
- **Variable Length Resilience**: Indic translations frequently expand text length by 20% to 45% compared to English. UI containers employ dynamic `min-height`, flex wrapping, and responsive typography clamp (`clamp(0.875rem, 2vw, 1rem)`) to prevent text clipping.
- **Bi-directional Layouts**: Bidirectional text support (`dir="rtl"`) is applied automatically for Urdu, Kashmiri, and Sindhi.
