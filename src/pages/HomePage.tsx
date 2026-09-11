import { pathForMode } from '../seoData'
import {
  TOOLS,
  TOOL_FAMILIES,
  type ToolId,
} from '../toolCatalog'

type Props = {
  onOpenTool: (id: ToolId) => void
}

export function HomePage({ onOpenTool }: Props) {
  return (
    <div className="home">
      <h1 className="home__lede">Simple tools that work in your browser.</h1>

      {TOOL_FAMILIES.map((family) => {
        const tools = TOOLS.filter((tool) => tool.family === family.id)
        if (!tools.length) return null

        return (
          <section
            key={family.id}
            className="home__family"
            aria-labelledby={`home-family-${family.id}`}
          >
            <h2 id={`home-family-${family.id}`} className="home__family-title">
              {family.label}
            </h2>
            <ul className="home__list">
              {tools.map((tool) => (
                <li key={tool.id}>
                  <a
                    className="home__tool"
                    href={pathForMode(tool.id)}
                    onClick={(e) => {
                      e.preventDefault()
                      onOpenTool(tool.id)
                    }}
                  >
                    <span className="home__tool-name">{tool.label}</span>
                    <span className="home__tool-blurb">{tool.blurb}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
