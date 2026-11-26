export const COURSE_DISCLAIMER =
  'Please Note: This is not a 2-year Government PG Diploma program. The course is a professional upskilling/certification 1-Year program designed for eligible medical professionals.'

// Split so the "Please Note:" label can be styled separately from the rest of the sentence
const LABEL = 'Please Note:'
export const DISCLAIMER_LABEL = LABEL
export const DISCLAIMER_BODY = COURSE_DISCLAIMER.slice(LABEL.length).trim()
