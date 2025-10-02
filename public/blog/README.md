# Blog Structure

This directory contains the internationalized blog posts for the portfolio website.

## Directory Structure

```
public/blog/
├── en/          # English posts
│   └── posts/
├── es/          # Spanish posts
│   └── posts/
├── fr/          # French posts
│   └── posts/
└── pt-BR/       # Portuguese (Brazil) posts
    └── posts/
```

## Adding New Posts

1. Create an HTML file in the appropriate locale directory (`public/blog/{locale}/posts/`)
2. Use a descriptive filename that will become the URL slug
3. Include proper HTML structure with:
   - `<title>` tag for the post title
   - `<meta name="description">` for SEO
   - Proper heading hierarchy (`h1`, `h2`, etc.)
   - Clean, semantic HTML

## Example Post Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Post Title</title>
    <meta name="description" content="Brief description for SEO">
</head>
<body>
    <h1>Your Post Title</h1>
    <p>Your content here...</p>
    <!-- More content -->
</body>
</html>
```

## Supported Locales

- `en` - English (default)
- `es` - Spanish
- `fr` - French
- `pt-BR` - Portuguese (Brazil)

## URL Structure

- Blog listing: `/{locale}/blog`
- Individual posts: `/{locale}/blog/{slug}`

The system automatically extracts metadata from HTML files and serves them through the Next.js API routes.
