import React from "react";
import Image from "next/image";
import { parse, HTMLElement, Node as HtmlNode, TextNode, NodeType } from "node-html-parser";

const MISENCODED_TEXT_PATTERN = /[\u00c3\u00c2][\u0080-\u00FF]/;
const WIDTH_OVERRIDE_STYLES = `
:where(.rendered-html) {
  width: 100%;
}

:where(.rendered-html) .container,
:where(.rendered-html) .markdown-body {
  max-width: 100%;
  width: 100%;
}

:where(.rendered-html) .container {
  margin-left: 0;
  margin-right: 0;
}

:where(.rendered-html) pre {
  overflow-x: auto;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: var(--code-bg, #111827);
  background: color-mix(in srgb, var(--bg, #0a0f1a) 92%, var(--fg, #e8eefc) 8%);
  color: var(--code-fg, inherit);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.95em;
  line-height: 1.6;
}

:where(.rendered-html) code {
  color: var(--code-fg, inherit);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
}

:where(.rendered-html) pre code {
  display: block;
  white-space: pre;
  background: transparent;
  padding: 0;
}
`;
interface RenderHtmlOptions {
  lang?: string;
  className?: string;
}

function decodePotentiallyMisencodedText(value: string): string {
  if (!value || !MISENCODED_TEXT_PATTERN.test(value)) {
    return value;
  }

  try {
    const bytes = new Uint8Array(value.length);
    for (let index = 0; index < value.length; index += 1) {
      bytes[index] = value.charCodeAt(index);
    }
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return value;
  }
}

type NodeWithParent = HtmlNode & { parentNode?: HtmlNode | null };

function isWithinPreformattedContext(node: HtmlNode): boolean {
  let current: HtmlNode | null = (node as NodeWithParent).parentNode ?? null;

  while (current) {
    if (current.nodeType === NodeType.ELEMENT_NODE) {
      const element = current as Partial<HTMLElement>;
      const tagName = typeof element.tagName === "string" ? element.tagName.toLowerCase() : undefined;

      if (tagName === "pre" || tagName === "code" || tagName === "samp" || tagName === "kbd") {
        return true;
      }
    }

    current = (current as NodeWithParent).parentNode ?? null;
  }

  return false;
}

function getParentElementTagName(node: HtmlNode): string | null {
  const parentNode = (node as NodeWithParent).parentNode ?? null;

  if (parentNode && parentNode.nodeType === NodeType.ELEMENT_NODE) {
    const element = parentNode as HTMLElement;
    return typeof element.tagName === "string" ? element.tagName.toLowerCase() : null;
  }

  return null;
}

function toCamelCase(value: string) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

const ATTRIBUTE_NAME_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  charset: "charSet",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  autocomplete: "autoComplete",
  autocapitalize: "autoCapitalize",
  contenteditable: "contentEditable",
  spellcheck: "spellCheck",
  srcset: "srcSet",
  crossorigin: "crossOrigin",
  referrerpolicy: "referrerPolicy",
  allowfullscreen: "allowFullScreen",
  nomodule: "noModule",
  playsinline: "playsInline",
  srcdoc: "srcDoc",
  "http-equiv": "httpEquiv",
  "accept-charset": "acceptCharset",
};

const WRAPPER_TAGS = new Set(["html", "head", "body"]);
const TABLE_STRUCTURE_TAGS = new Set(["table", "thead", "tbody", "tfoot", "tr", "colgroup"]);
const IGNORED_TAGS = new Set(["meta", "link", "script", "title", "base"]);
const DOCUMENT_TYPE_NODE = 10;

function isDocumentTypeNode(node: HtmlNode) {
  return (node as unknown as { nodeType: number }).nodeType === DOCUMENT_TYPE_NODE;
}

function parseStyleAttribute(style: string): React.CSSProperties {
  return style
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .reduce<React.CSSProperties>((acc, declaration) => {
      const [property, ...rest] = declaration.split(":");
      if (!property || rest.length === 0) return acc;
      const cssProperty = property.trim();
      const cssValue = rest.join(":").trim();
      if (!cssProperty || !cssValue) return acc;
      const key = toCamelCase(cssProperty) as keyof React.CSSProperties;
      (acc as Record<string, string>)[key as string] = cssValue;
      return acc;
    }, {});
}

function normalizeAttributeName(name: string) {
  const lowerName = name.toLowerCase();

  if (ATTRIBUTE_NAME_MAP[lowerName]) {
    return ATTRIBUTE_NAME_MAP[lowerName];
  }

  if (lowerName.startsWith("data-")) return name;
  if (lowerName.startsWith("aria-")) return name;

  if (lowerName.includes("-")) {
    return toCamelCase(lowerName);
  }

  return lowerName;
}

function normalizeAttributes(element: HTMLElement) {
  const attributes = element.attributes;
  return Object.entries(attributes).reduce<Record<string, unknown>>((acc, [rawName, rawValue]) => {
    const name = normalizeAttributeName(rawName);
    const normalizedValue = rawValue === "" ? true : rawValue;
    const value =
      typeof normalizedValue === "string"
        ? decodePotentiallyMisencodedText(normalizedValue)
        : normalizedValue;

    if (name === "style" && typeof value === "string") {
      acc[name] = parseStyleAttribute(value);
    } else {
      acc[name] = value;
    }

    return acc;
  }, {});
}

function transformNode(node: HtmlNode, key: number): React.ReactNode {
  if (isDocumentTypeNode(node)) {
    return null;
  }

  if (node.nodeType === NodeType.TEXT_NODE) {
    const textNode = node as TextNode;
    const rawValue = textNode.rawText ?? "";
    const decodedText = decodePotentiallyMisencodedText(rawValue);

    if (!decodedText) {
      return null;
    }

    if (isWithinPreformattedContext(textNode)) {
      return decodedText.replace(/\r\n?/g, "\n");
    }

    const trimmed = decodedText.trim();

    if (trimmed.length === 0) {
      const parentTagName = getParentElementTagName(textNode);

      if (parentTagName && TABLE_STRUCTURE_TAGS.has(parentTagName)) {
        return null;
      }

      if (decodedText.includes("\u00a0")) {
        return "\u00a0";
      }

      if (decodedText.includes(" ")) {
        return " ";
      }

      if (decodedText.includes("\n")) {
        return "\n";
      }

      return null;
    }

    return decodedText;
  }

  if (node.nodeType !== NodeType.ELEMENT_NODE) {
    return null;
  }

  const element = node as HTMLElement;
  const tagName = element.tagName.toLowerCase();

  if (tagName === "!doctype") {
    return null;
  }

  if (IGNORED_TAGS.has(tagName)) {
    return null;
  }

  const attributes = normalizeAttributes(element);
  const children = element.childNodes
    .map((child, index) => transformNode(child, index))
    .filter((child): child is React.ReactNode => child !== null && child !== undefined);

  if (WRAPPER_TAGS.has(tagName)) {
    return React.createElement(React.Fragment, { key }, ...(children as React.ReactNode[]));
  }

  if (tagName === "img") {
    const { className, style, src, alt, width, height, loading, sizes, ...rest } = attributes as Record<string, unknown>;

    if (typeof src !== "string" || src.length === 0) {
      return null;
    }

    const numericWidth = typeof width === "string" ? parseInt(width, 10) : typeof width === "number" ? width : undefined;
    const numericHeight = typeof height === "string" ? parseInt(height, 10) : typeof height === "number" ? height : undefined;

    const fallbackWidth = numericWidth ?? 800;
    const fallbackHeight = numericHeight ?? 600;

    const optionalProps: Record<string, unknown> = {};

    if (typeof sizes === "string") {
      optionalProps.sizes = sizes;
    }

    const isPriority = loading === "eager";
    const normalizedLoading = loading === "lazy" ? "lazy" : undefined;

    if (isPriority) {
      optionalProps.priority = true;
    } else if (normalizedLoading) {
      optionalProps.loading = normalizedLoading;
    }

    Object.entries(rest).forEach(([attributeName, attributeValue]) => {
      if (attributeValue === undefined || attributeValue === null) return;
      if (attributeName === "title" && typeof attributeValue === "string") {
        optionalProps.title = attributeValue;
        return;
      }
      if (attributeName === "id" && typeof attributeValue === "string") {
        optionalProps.id = attributeValue;
        return;
      }
      if (attributeName === "role" && typeof attributeValue === "string") {
        optionalProps.role = attributeValue;
        return;
      }
      if (attributeName.startsWith("aria-")) {
        optionalProps[attributeName] = attributeValue;
        return;
      }
      if (attributeName.startsWith("data-")) {
        optionalProps[attributeName] = attributeValue;
      }
    });

    return (
      <Image
        key={key}
        src={src}
        alt={typeof alt === "string" ? alt : ""}
        width={fallbackWidth}
        height={fallbackHeight}
        className={typeof className === "string" ? className : undefined}
        style={style as React.CSSProperties | undefined}
        {...(optionalProps as Record<string, unknown>)}
      />
    );
  }

  const elementProps: Record<string, unknown> = {
    key,
    ...attributes,
  };

  return React.createElement(tagName, elementProps, ...(children as React.ReactNode[]));
}

export function renderHtmlToReact(html: string, options: RenderHtmlOptions = {}): React.ReactNode {
  if (!html) return null;

  const root = parse(html, {
    lowerCaseTagName: false,
    comment: false,
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
    },
  });

  const nodes = root.childNodes
    .filter((node) => !isDocumentTypeNode(node)) // drop DOCTYPE declarations
    .map((node, index) => transformNode(node, index))
    .filter((child): child is React.ReactNode => child !== null && child !== undefined);

  if (nodes.length === 0) return null;

  const wrapperClassName = ["rendered-html", "w-full", options.className]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={wrapperClassName} lang={options.lang}>
      <style>{WIDTH_OVERRIDE_STYLES}</style>
      {nodes}
    </div>
  );
}



