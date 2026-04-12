import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

const mdxOptions = {
  parseFrontmatter: false,
  mdxOptions: { remarkPlugins: [remarkGfm] },
} as const;

export async function compileMdx(source: string): Promise<React.ReactNode> {
  const { content } = await compileMDX({ source, options: mdxOptions });
  return content;
}
