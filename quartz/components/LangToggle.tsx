import styles from "./styles/langtoggle.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FilePath, FullSlug, resolveRelative, slugifyFilePath } from "../util/path"
import { classNames } from "../util/lang"

// 雙語對照頁切換鍵（PCL-life，沛拍板 2026-10-21）
// 文章 frontmatter 以 `ja:` 指向日文版、`zh:` 指向中文版（值＝content/ 下的路徑，不含 .md）。
// 有對照頁才渲染；沒有就不出現（回傳 null）。
const LANGS: { key: string; label: string; hreflang: string; title: string }[] = [
  { key: "ja", label: "日本語", hreflang: "ja", title: "日本語版を読む" },
  { key: "zh", label: "中文", hreflang: "zh-Hant", title: "閱讀中文版" },
]

const LangToggle: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
  const fm = fileData.frontmatter
  if (!fm) return null

  for (const lang of LANGS) {
    const target = fm[lang.key]
    if (typeof target !== "string" || target.trim() === "") continue
    const targetSlug = slugifyFilePath((target.trim() + ".md") as FilePath) as FullSlug
    const href = resolveRelative(fileData.slug!, targetSlug)
    return (
      <a
        href={href}
        hreflang={lang.hreflang}
        title={lang.title}
        class={classNames(displayClass, "lang-toggle")}
      >
        {lang.label}
      </a>
    )
  }

  return null
}

LangToggle.css = styles

export default (() => LangToggle) satisfies QuartzComponentConstructor
