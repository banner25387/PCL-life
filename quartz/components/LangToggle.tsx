import styles from "./styles/langtoggle.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FilePath, FullSlug, resolveRelative, slugifyFilePath } from "../util/path"
import { classNames } from "../util/lang"

// 雙語對照頁切換鍵（PCL-life；沛拍板 2026-10-21，2026-11-06 改分段式）
// 分段式藥丸「中文｜日本語」，樣式比照 ARK wiki 的 site-switch。
// 文章 frontmatter 以 `ja:` 指向日文版、`zh:` 指向中文版（值＝content/ 下的路徑，不含 .md）；
// `lang: ja` 的頁面視為日文頁。當前語言那一格反白；另一格有對照頁才可點，沒有就灰掉（aria-disabled、無連結）。
// 每篇文章都顯示；首頁與資料夾 index 不顯示（列表頁／tag 頁 layout 本來就沒掛）。
const LANGS: { key: string; label: string; hreflang: string; title: string; missing: string }[] = [
  { key: "zh", label: "中文", hreflang: "zh-Hant", title: "閱讀中文版", missing: "尚無中文版" },
  {
    key: "ja",
    label: "日本語",
    hreflang: "ja",
    title: "日本語版を読む",
    missing: "日本語版はまだありません",
  },
]

const LangToggle: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
  const slug = fileData.slug
  if (!slug || slug === "index" || slug.endsWith("/index")) return null
  const fm: Record<string, unknown> = fileData.frontmatter ?? {}
  const current = fm.lang === "ja" ? "ja" : "zh"

  return (
    <nav class={classNames(displayClass, "lang-toggle")} aria-label="語言 / 言語">
      {LANGS.map((lang) => {
        if (lang.key === current) {
          return (
            <span class="lang-seg" aria-current="page">
              {lang.label}
            </span>
          )
        }
        const target = fm[lang.key]
        if (typeof target !== "string" || target.trim() === "") {
          return (
            <span class="lang-seg" aria-disabled="true" title={lang.missing}>
              {lang.label}
            </span>
          )
        }
        const targetSlug = slugifyFilePath((target.trim() + ".md") as FilePath) as FullSlug
        return (
          <a
            class="lang-seg"
            href={resolveRelative(slug, targetSlug)}
            hreflang={lang.hreflang}
            title={lang.title}
          >
            {lang.label}
          </a>
        )
      })}
    </nav>
  )
}

LangToggle.css = styles

export default (() => LangToggle) satisfies QuartzComponentConstructor
