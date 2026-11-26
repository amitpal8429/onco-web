import { Helmet } from 'react-helmet-async'

export default function Seo({ title, description, noindex = false }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
    </Helmet>
  )
}
