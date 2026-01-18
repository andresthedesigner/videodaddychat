export function AppInfoContent() {
  return (
    <div className="space-y-4">
      <p className="text-foreground leading-relaxed">
        <span className="font-medium">vid0</span> is an AI-powered
        assistant for YouTube creators.
        <br />
        Get help with video ideas, titles, scripts, SEO, and growth strategies.
        <br />
        Multi-model, BYOK-ready, and fully self-hostable.
        <br />
      </p>
      <p className="text-foreground leading-relaxed">
        Based on{" "}
        <a
          href="https://github.com/ibelick/zola"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Zola
        </a>
        , the open-source AI chat interface.
      </p>
    </div>
  )
}
