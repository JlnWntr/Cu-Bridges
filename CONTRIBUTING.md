# Contributing to Cu-bridges

Thanks for wanting to help grow the database! Here's how you can contribute.

## Adding Sites

The easiest way to contribute is by adding sites to the database.

### What makes a good addition?

Any website that:
- **Is worth discovering** (interesting content, useful tools, or valuable resources)
- **Has a clear focus** (specific topic, niche, or purpose)
- **Is active** (not abandoned)
- **Can have related sites** (helps build the network!)

Examples:
- ✅ A music blog that reviews ambient/experimental music
- ✅ A specific subreddit like `reddit.com/r/programming`
- ✅ A subdomain with distinct content like `old.reddit.com`
- ✅ A specific section of a site like `github.com/trending`
- ✅ Any website you find interesting and want to discover similar ones!
- ❌ Spam/SEO content farms
- ❌ Completely abandoned sites

### How to add a site

1. Fork this repository
2. Edit `database.json`
3. Add your site entry:

```json
{
  "url": "your-site.com",
  "name": "The Site Name",
  "category": "music",
  "tags": ["ambient", "experimental", "reviews"],
  "description": "A brief one-line description",
  "similar": ["similar-site1.com", "similar-site2.com", "similar-site3.com"]
}
```

4. Make sure to add 2-5 similar sites (if you know them)
5. Test the extension with your changes
6. Submit a pull request

### Field explanations

- **url**: The URL without `https://`. Can include:
  - Domain only: `"reddit.com"`
  - Subdomain: `"old.reddit.com"` 
  - Path: `"reddit.com/r/programming"`
  - Both: `"old.reddit.com/r/programming"`
- **name**: The display name
- **category**: Pick from: music, games, blog, writing, film, books, community, tech, web, curation, reference
- **tags**: 2-5 relevant tags
- **description**: One sentence explaining the site
- **similar**: 2-5 URLs of similar sites (this builds the bridges!)

### Examples of subdomain/path usage

**Different subdomains as separate entries:**
```json
{
  "url": "reddit.com",
  "name": "Reddit",
  ...
},
{
  "url": "old.reddit.com",
  "name": "Old Reddit",
  ...
}
```

**Different paths as separate entries:**
```json
{
  "url": "github.com/trending",
  "name": "GitHub Trending",
  ...
},
{
  "url": "github.com/explore",
  "name": "GitHub Explore",
  ...
}
```

**Language-specific subdomains:**
```json
{
  "url": "en.wikipedia.org",
  "name": "Wikipedia (English)",
  ...
},
{
  "url": "de.wikipedia.org",
  "name": "Wikipedia (German)",
  ...
}
```

### Tips

- Research the site before adding it
- Make sure it's still active
- Try to fill in the "similar" field - this is how bridges are built!
- Subdomains and paths create distinct entries - use this to differentiate content!
- If you're not sure about similar sites, just add the site without them

## Improving the Extension

If you're a developer and want to improve the extension:

1. Fork the repository
2. Make your changes
3. Test thoroughly (Chrome + Firefox if possible)
4. Submit a pull request with a clear description

### Ideas for improvements

- Better link analysis algorithm
- UI/UX improvements
- Performance optimizations
- New features (see Future Ideas in README)
- Bug fixes

## Quality Standards

When adding curators:
- No spam or SEO farms
- No hate speech or harmful content
- Focus on quality over quantity
- Prefer independent/individual curators over large corporations

## Questions?

Open an issue and let's discuss!

## Code of Conduct

Be respectful, be constructive, and help us build a better, more connected web.
