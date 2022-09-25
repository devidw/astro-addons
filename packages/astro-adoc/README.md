# astro-adoc

Integrate AsciiDoctor content into your Astro project.

## Usage

For example, to get the following routes:

| Directory | URL
| --- | ---
| `src/articles/post.adoc` | `/blog/post`
| `src/articles/sub/index.adoc` | `/blog/sub`
| `src/articles/dig/deeper.adoc` | `/blog/dig/deeper`

Your would add the following to `src/pages/blog/[...slug].astro`:

```astro
---
import { getAdocPaths } from "astro-adoc"
import { AsciiDoctor } from "astro-adoc/components"

export async function getStaticPaths() {
  return await getAdocPaths("src/articles", "slug")
}

const { slug } = Astro.params
---

<AsciiDoctor path={`src/articles/${slug}`} />
```