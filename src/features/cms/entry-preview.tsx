import Image from "next/image";
import Link from "next/link";
import type { PageBody } from "./validation";
export function EntryPreview({
  title,
  summary,
  body,
}: {
  title: string;
  summary: string;
  body: PageBody;
}) {
  return (
    <article className="cms-public-entry">
      <header>
        <h1>{title}</h1>
        {summary && <p className="cms-entry-summary">{summary}</p>}
      </header>
      {body.cover && (
        <Image
          className="cms-entry-image"
          src={body.cover}
          alt={body.coverAlt}
          width={1200}
          height={680}
        />
      )}
      <div className="cms-entry-body">
        {body.blocks.map((block, index) =>
          block.type === "heading" ? (
            <h2 key={index}>{block.text}</h2>
          ) : block.type === "image" ? (
            <figure key={index}>
              <Image
                className="cms-entry-image"
                src={block.url}
                alt={block.text}
                width={1200}
                height={800}
              />
              <figcaption>{block.text}</figcaption>
            </figure>
          ) : block.type === "button" ? (
            <p key={index}>
              <Link href={block.url} className="cms-primary">
                {block.text}
              </Link>
            </p>
          ) : (
            <p className="cms-entry-paragraph" key={index}>
              {block.text}
            </p>
          ),
        )}
      </div>
    </article>
  );
}
