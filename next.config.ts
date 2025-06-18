// next.config.ts
import type { NextConfig } from "next";
import createMdxPlugin from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

// 1. MDX ────────────────────────────────────────────────────────────────
const withMdx = createMdxPlugin({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// 2. next-intl (nenhum parâmetro necessário) ───────────────────────────
const withNextIntl = createNextIntlPlugin();

// 3. Config base ───────────────────────────────────────────────────────
const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  experimental: {
    // deixe como "false" se for usar remark/rehype extra
    mdxRs: false,
  },
};

// 4. Compose (outermost = intl) ────────────────────────────────────────
export default withNextIntl(withMdx(nextConfig));
