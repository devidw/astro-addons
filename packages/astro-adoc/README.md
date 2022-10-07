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

Beside the `slug` from `Astro.params`, you also get `adoc` from `Astro.props`
which is the parsed AsciiDoctor document.

If you want more control over the layout, you can use the `getAdoc` function
instead of the `AsciiDoctor` component.

You can access anything from the returning `AsciiDoctor.Document` instance you want to display.

```astro
---
import { getAdocPaths } from "astro-adoc"
import type { Asciidoctor } from "asciidoctor"

export async function getStaticPaths() {
  return await getAdocPaths("src/articles")
}

const { adoc } = Astro.props as { adoc: Asciidoctor.Document }
---

<h1>
  {adoc.getTitle()}
</h1>

{adoc.getAuthor()}

<Fragment set:html={adoc.convert()} />
```

## Configuration

The integrations wraps the [asciidoctor.js](https://docs.asciidoctor.org/asciidoctor.js/) library, so you can pass any option
that works with that library.

See [_convert options_](https://docs.asciidoctor.org/asciidoctor.js/latest/processor/convert-options/) for more information.

```astro
<AsciiDoctor
  path={`src/articles/article`}
  options={{ attributes: { showtitle: true } }}
/>
```