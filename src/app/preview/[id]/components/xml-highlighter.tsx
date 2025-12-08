"use client"

interface XMLHighlighterProps {
  xml: string
}

export function XMLHighlighter({ xml }: XMLHighlighterProps) {
  const highlightXML = (xmlString: string) => {
    if (!xmlString) return null

    // Format and highlight XML
    const parts: JSX.Element[] = []
    let key = 0

    // Regex to match XML elements, attributes, and content
    const xmlRegex = /(<\/?[\w:]+)|(\s+[\w:]+="[^"]*")|([^<>]+)|([<>])/g
    let match

    while ((match = xmlRegex.exec(xmlString)) !== null) {
      const [fullMatch, tag, attribute, text, bracket] = match

      if (tag) {
        // Opening or closing tag
        parts.push(
          <span key={key++} className="text-orange-600 font-semibold">
            {tag}
          </span>
        )
      } else if (attribute) {
        // Parse attribute name and value
        const attrMatch = attribute.match(/(\s+)([\w:]+)="([^"]*)"/)
        if (attrMatch) {
          const [, space, attrName, attrValue] = attrMatch
          parts.push(
            <span key={key++}>
              {space}
              <span className="text-blue-600">{attrName}</span>
              <span className="text-gray-700">=&quot;</span>
              <span className="text-green-600">&quot;{attrValue}&quot;</span>
            </span>
          )
        } else {
          parts.push(<span key={key++}>{attribute}</span>)
        }
      } else if (bracket) {
        // Angle brackets
        parts.push(
          <span key={key++} className="text-gray-700">
            {bracket}
          </span>
        )
      } else if (text && text.trim()) {
        // Text content (non-whitespace)
        parts.push(
          <span key={key++} className="text-gray-900">
            {text}
          </span>
        )
      } else if (text) {
        // Whitespace
        parts.push(<span key={key++}>{text}</span>)
      }
    }

    return <>{parts}</>
  }

  return (
    <pre className="text-xs font-mono whitespace-pre-wrap break-words leading-relaxed">
      <code>{highlightXML(xml)}</code>
    </pre>
  )
}
