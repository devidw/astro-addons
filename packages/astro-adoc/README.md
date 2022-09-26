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

If you want more control over the layout, you can use the `getAdoc` function
instead of the `AsciiDoctor` component:

```astro
---
import { getAdocPaths, getAdoc } from "astro-adoc"

export async function getStaticPaths() {
  return await getAdocPaths("src/articles")
}

const { slug } = Astro.params

const adoc = getAdoc(`src/articles/${slug}`)
---

<h1>
  {adoc.getTitle()}
</h1>

{adoc.getAuthor()}

<!-- Access anything from the AsciiDoctor.Document instance you want to display -->

<Fragment set:html={adoc.convert()} />
```

## Configuration

The integrations wraps the asciidoctor.js library, so you can pass any option
that works with that library.

```astro
<AsciiDoctor
  path={`src/articles/article`}
  options={{ attributes: { showtitle: true } }}
/>
```

See [Convert options](https://docs.asciidoctor.org/asciidoctor.js/latest/processor/convert-options/) for more information.