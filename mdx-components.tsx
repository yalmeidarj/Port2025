import type { MDXComponents } from 'mdx/types';


export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // expose any custom shortcodes:
        //   CodeBlock, Callout, YouTube, etc.
        ...components,
    };
}
