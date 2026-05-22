export type Experience = {
  company: string
  location: string
  role: string
  period: string
  bullets: string[]
  tech?: string[]
}

export const experiences: Experience[] = [
  {
    company: "Media Meter Inc.",
    location: "Tomas Morato, Quezon City",
    role: "Lead Backend Developer",
    period: "March 2025 – Present",
    bullets: [
      "Reorganized team, set operations and goals.",
      "Coordinated microservices: auth, observability, mailer, AI token tracker, ATS, payroll.",
      "Built engineering-intelligence platform w/ Bitbucket + Jira + local Ollama.",
    ],
    tech: ["FastAPI", "Postgres", "Docker", "Ollama", "Microservices"],
  },
  {
    company: "Media Meter Inc.",
    location: "Tomas Morato, Quezon City",
    role: "Associate Data Engineer",
    period: "March 2024 – March 2025",
    bullets: [
      "Mentored junior data engineers.",
      "Ensured reliable system architecture for data collection.",
    ],
    tech: ["Python", "Airflow", "Spark", "Postgres", "MongoDB"],
  },
  {
    company: "Media Meter Inc.",
    location: "Tomas Morato, Quezon City",
    role: "Junior Data Engineer",
    period: "October 2023 – March 2024",
    bullets: ["Web scraping.", "Data pipelining.", "Database developer."],
    tech: ["Python", "pandas", "SQL", "Scraping"],
  },
  {
    company: "White Widget",
    location: "Diliman, Quezon City",
    role: "Software Engineer Intern",
    period: "April 2019 – September 2019",
    bullets: [
      "Trained in VueJS + Docker.",
      "Full-stack support.",
      "Built Alexa skill for voice-activated session logging w/ Levenshtein word matching.",
    ],
    tech: ["Vue", "Docker", "Node.js", "Alexa"],
  },
]
