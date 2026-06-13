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
      "Lead the backend team, setting standards, operations, and delivery goals.",
      "Drove the shift to resilient microservices — centralized auth, observability, mailer, AI token-usage tracking, ATS, and payroll — replacing disjointed, duplicated services.",
      "Architected an engineering-intelligence platform (Bitbucket + Jira ingestion, local Ollama) that surfaces contributor and code insights to leadership.",
    ],
    tech: ["FastAPI", "Postgres", "Docker", "Ollama", "Microservices"],
  },
  {
    company: "Media Meter Inc.",
    location: "Tomas Morato, Quezon City",
    role: "Associate Data Engineer",
    period: "March 2024 – March 2025",
    bullets: [
      "Mentored junior data engineers, aligning their output with team direction.",
      "Owned the reliability of the data-collection architecture across multiple sources.",
      "Built and scaled ETL pipelines with Airflow and Spark for downstream analytics.",
    ],
    tech: ["Python", "Airflow", "Spark", "Postgres", "MongoDB"],
  },
  {
    company: "Media Meter Inc.",
    location: "Tomas Morato, Quezon City",
    role: "Junior Data Engineer",
    period: "October 2023 – March 2024",
    bullets: [
      "Built and maintained web scrapers feeding the company data platform.",
      "Developed ETL pipelines (Python, pandas) to clean and structure scraped data.",
      "Designed and maintained the databases backing collected data.",
    ],
    tech: ["Python", "pandas", "SQL", "Scraping"],
  },
  {
    company: "White Widget",
    location: "Diliman, Quezon City",
    role: "Software Engineer Intern",
    period: "April 2019 – September 2019",
    bullets: [
      "Trained in Vue + Docker and provided full-stack engineering support across products.",
      "Built an Alexa skill for voice-activated session logging, using Levenshtein-distance matching to improve word recognition.",
    ],
    tech: ["Vue", "Docker", "Node.js", "Alexa"],
  },
]
