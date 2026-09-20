export type Lang = "en" | "hi";

export const LANG_COOKIE = "jobsera_lang";

// Static UI-string dictionary. These are translated once, by us, and never
// hit the translation API — so the header/nav/buttons switch instantly with
// zero cost and zero latency, regardless of traffic.
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
    related_links: "Related Links",
    lang_toggle_label: "हिंदी",
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
    related_links: "संबंधित लिंक",
    lang_toggle_label: "English",
  },
} as const;

export function t(lang: Lang, key: keyof (typeof dictionary)["en"]): string {
  return dictionary[lang][key];
}

