import React from "react";
import Image from "next/image";
import { parse, HTMLElement, Node as HtmlNode, TextNode } from "next/dist/compiled/node-html-parser";

function toCamelCase(value: string) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
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
  if (name === "class") return "className";
  if (name === "for") return "htmlFor";
  if (name === "http-equiv") return "httpEquiv";
  if (name === "accept-charset") return "acceptCharset";
  if (name.startsWith("data-")) return name;
  if (name.startsWith("aria-")) return name;
  return toCamelCase(name);
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
  if (node.nodeType === 3) {
    const textNode = node as TextNode;
    return textNode.rawText;
  }

  if (node.nodeType !== 1) {
    return null;
  }

  const element = node as HTMLElement;
  const tagName = element.tagName.toLowerCase();
  const attributes = normalizeAttributes(element);
  const children = element.childNodes
    .map((child, index) => transformNode(child, index))
    .filter((child) => child !== null);

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

  return root.childNodes.map((node, index) => transformNode(node, index));
}
