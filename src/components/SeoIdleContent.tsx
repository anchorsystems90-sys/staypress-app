import { MODE_PAGE_CONTENT, type SeoMode } from '../seoData'

type Props = {
  tool: SeoMode
}

/** Quiet H1 + intro + FAQs for idle tool pages (hidden when a file workflow is active). */
export function SeoIdleContent({ tool }: Props) {
  const content = MODE_PAGE_CONTENT[tool]

  return (
    <section className="seo-idle" aria-label="About this tool">
      <h1 className="seo-idle__title">{content.h1}</h1>
      <p className="seo-idle__intro">{content.intro}</p>

      <div className="seo-idle__faqs">
        <h2 className="seo-idle__faqs-heading">Common questions</h2>
        <div className="seo-idle__faq-list">
          {content.faqs.map((faq) => (
            <details key={faq.question} className="seo-idle__faq">
              <summary className="seo-idle__faq-q">{faq.question}</summary>
              <p className="seo-idle__faq-a">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
