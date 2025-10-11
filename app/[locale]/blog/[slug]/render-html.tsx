// iff --git a//dev/null b/app/[locale]/blog/[slug]/render-html.tsx
// ndex 0000000000000000000000000000000000000000..983a71b70201f0a2646bbddb63f9b9ca6f95cf83 100644
// -- a//dev/null
// ++ b/app/[locale]/blog/[slug]/render-html.tsx
// @ -0,0 +1,157 @@
import React from "react";
import Image from "next/image";
import { parse, HTMLElement, Node as HtmlNode, TextNode } from "node-html-parser";

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
const IGNORED_TAGS = new Set(["meta", "link", "script", "title", "base"]);

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
    const value = rawValue === "" ? true : rawValue;

    if (name === "style" && typeof value === "string") {
      acc[name] = parseStyleAttribute(value);
    } else {
      acc[name] = value;
    }

    return acc;
  }, {});
}

function transformNode(node: HtmlNode, key: number): React.ReactNode {
  if (node.nodeType === 10) {
    return null;
  }

  if (node.nodeType === 3) {
    const textNode = node as TextNode;
    // Ignore pure whitespace text nodes (e.g. single spaces that become {' '})
    if (textNode.rawText.trim().length === 0) return null;
    return textNode.rawText;
  }

  if (node.nodeType !== 1) {
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

export function renderHtmlToReact(html: string): React.ReactNode {
  if (!html) return null;

  const root = parse(html, {
    lowerCaseTagName: false,
    comment: false,
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
      pre: true,
    },
  });

  const nodes = root.childNodes
    .filter((node) => node.nodeType !== 10) // drop DOCTYPE declarations
    .map((node, index) => transformNode(node, index))
    .filter((child): child is React.ReactNode => child !== null && child !== undefined);

  if (nodes.length === 0) return null;

  if (nodes.length === 1) return nodes[0];

  return nodes;
}
