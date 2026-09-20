export type Lang = "en" | "hi";

export const LANG_COOKIE = "jobsera_lang";

// Static UI-string dictionary. These are translated once, by us, and never
// hit the translation API — so all UI chrome switches instantly with zero
// cost and zero latency, regardless of traffic. Dynamic database content
// (job/blog text) is translated separately via lib/translate.ts.
export const dictionary = {
  en: {
    nav_jobs: "Jobs",
    nav_blogs: "Career Insights",
    nav_about: "About",
    nav_contact: "Contact",
    nav_terms: "Terms & Conditions",
    nav_privacy: "Privacy Policy",
    nav_login: "Login",
    search_placeholder: "Search jobs...",
    apply_now: "Apply Now →",
    salary_heading: "Salary / Pay Scale",
    explore_jobs: "Explore Jobs",
    looking_for_opportunities: "Looking for opportunities?",
    back_to_insights: "← Back to Career Insights",
    back_to_jobs: "← Back to Jobs",
    related_links: "Related Links",
    lang_toggle_label: "हिंदी",

    job_overview: "Job Overview",
    important_dates: "Important Dates",
    application_start_date: "Application Start Date:",
    last_date_label: "Last Date:",
    exam_date_label: "Exam Date:",
    eligibility: "Eligibility",
    educational_qualification: "Educational Qualification:",
    starting_age: "Starting Age:",
    years_suffix: "years",
    age_limit_label: "Age Limit:",
    age_relaxation_label: "Age Relaxation:",
    application_details: "Application Details",
    application_mode_label: "Application Mode:",
    application_fee_label: "Application Fee:",
    selection_process_heading: "Selection Process",
    documents_required_heading: "Documents Required",
    about_opportunity: "About this opportunity",
    official_links: "Official Links",
    view_notification: "View Official Notification →",
    vacancy_singular: "Vacancy",
    vacancy_plural: "Vacancies",
    contact_heading: "Interested in this opportunity?",
    contact_body:
      "Review the recruitment information carefully before applying. For enquiries or application-related information, contact Jobsera using the email address below.",
  },
  hi: {
    nav_jobs: "नौकरियाँ",
    nav_blogs: "करियर जानकारी",
    nav_about: "हमारे बारे में",
    nav_contact: "संपर्क करें",
    nav_terms: "नियम व शर्तें",
    nav_privacy: "गोपनीयता नीति",
    nav_login: "लॉगिन",
    search_placeholder: "नौकरी खोजें...",
    apply_now: "अभी आवेदन करें →",
    salary_heading: "वेतन",
    explore_jobs: "नौकरियाँ देखें",
    looking_for_opportunities: "अवसर की तलाश है?",
    back_to_insights: "← करियर जानकारी पर वापस जाएँ",
    back_to_jobs: "← नौकरियों पर वापस जाएँ",
    related_links: "संबंधित लिंक",
    lang_toggle_label: "English",

    job_overview: "नौकरी का विवरण",
    important_dates: "महत्वपूर्ण तिथियाँ",
    application_start_date: "आवेदन प्रारंभ तिथि:",
    last_date_label: "अंतिम तिथि:",
    exam_date_label: "परीक्षा तिथि:",
    eligibility: "पात्रता",
    educational_qualification: "शैक्षणिक योग्यता:",
    starting_age: "न्यूनतम आयु:",
    years_suffix: "वर्ष",
    age_limit_label: "आयु सीमा:",
    age_relaxation_label: "आयु में छूट:",
    application_details: "आवेदन विवरण",
    application_mode_label: "आवेदन का तरीका:",
    application_fee_label: "आवेदन शुल्क:",
    selection_process_heading: "चयन प्रक्रिया",
    documents_required_heading: "आवश्यक दस्तावेज़",
    about_opportunity: "इस अवसर के बारे में",
    official_links: "आधिकारिक लिंक",
    view_notification: "आधिकारिक सूचना देखें →",
    vacancy_singular: "रिक्ति",
    vacancy_plural: "रिक्तियाँ",
    contact_heading: "इस अवसर में रुचि है?",
    contact_body:
      "आवेदन करने से पहले भर्ती जानकारी को ध्यान से पढ़ें। पूछताछ या आवेदन से जुड़ी जानकारी के लिए नीचे दिए गए ईमेल पते पर Jobsera से संपर्क करें।",
  },
} as const;

export function t(lang: Lang, key: keyof (typeof dictionary)["en"]): string {
  return dictionary[lang][key];
}
