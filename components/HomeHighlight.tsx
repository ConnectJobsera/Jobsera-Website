type HomeHighlightProps = {
  text: string;
  href: string;
};

export default function HomeHighlight({
  text,
  href,
}: HomeHighlightProps) {
  return (
    <section
      className="home-highlight"
      aria-label="Jobsera highlight"
    >
      <div className="home-highlight-track">
        <a
          className="home-highlight-item"
          href={href}
        >
          {text}
        </a>

        <a
          className="home-highlight-item"
          href={href}
          aria-hidden="true"
          tabIndex={-1}
        >
          {text}
        </a>
      </div>
    </section>
  );
}
