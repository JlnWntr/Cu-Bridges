// Cross-browser compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Load the database
let database = null;

// Get current tab URL
async function getCurrentTab() {
  const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Extract URL components (subdomain, domain, path)
function parseURL(urlString) {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname;
    const pathname = url.pathname;
    
    // Remove trailing slash from path unless it's just "/"
    const cleanPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');
    
    // Extract base domain (removing subdomain)
    const parts = hostname.split('.');
    let baseDomain = hostname;
    if (parts.length > 2) {
      // Keep last two parts (e.g., "example.com" from "sub.example.com")
      // But handle special cases like co.uk, com.au, etc.
      baseDomain = parts.slice(-2).join('.');
    }
    
    return {
      full: hostname + cleanPath,  // e.g., "old.reddit.com/r/programming"
      hostname: hostname,           // e.g., "old.reddit.com"
      domain: hostname.replace(/^www\./, ''),  // e.g., "reddit.com" (without www)
      baseDomain: baseDomain,      // e.g., "reddit.com" (without any subdomain)
      path: cleanPath              // e.g., "/r/programming"
    };
  } catch (e) {
    return null;
  }
}

// Find site in database - tries exact match first, then falls back to parent domain
function findSite(urlString) {
  if (!database) return null;
  
  const parsed = parseURL(urlString);
  if (!parsed) return null;
  
  // 1. Try exact match (subdomain + path)
  let site = database.sites.find(s => s.url === parsed.full);
  if (site) return { site, matchType: 'exact' };
  
  // 2. Try hostname + path (without www)
  site = database.sites.find(s => s.url === parsed.domain + parsed.path);
  if (site) return { site, matchType: 'path' };
  
  // 3. Try exact hostname (with subdomain, no path)
  site = database.sites.find(s => s.url === parsed.hostname);
  if (site) return { site, matchType: 'hostname' };
  
  // 4. Try domain without subdomain (no path)
  site = database.sites.find(s => s.url === parsed.domain);
  if (site) return { site, matchType: 'domain' };
  
  // 5. FALLBACK: Try base domain (e.g., if "sub.example.com" not found, try "example.com")
  if (parsed.hostname !== parsed.baseDomain) {
    site = database.sites.find(s => s.url === parsed.baseDomain);
    if (site) return { site, matchType: 'fallback-domain' };
  }
  
  // 6. Try if current URL starts with any database entry (partial match)
  site = database.sites.find(s => parsed.full.startsWith(s.url));
  if (site) return { site, matchType: 'partial' };
  
  return null;
}

// Find similar sites by tags/category
function findSimilarByCategory(category, tags, excludeUrl, currentBaseDomain) {
  if (!database) return [];

  return database.sites
    .filter(s => s.url !== excludeUrl)
    // Exclude any entry whose base domain matches the current page
    .filter(s => {
      const sParsed = parseURL('https://' + s.url);
      return !sParsed || sParsed.baseDomain !== currentBaseDomain;
    })
    .filter(s => {
      // Match by category or overlapping tags
      if (s.category === category) return true;
      if (tags && s.tags) {
        return s.tags.some(tag => tags.includes(tag));
      }
      return false;
    })
    .slice(0, 5);
}

// Display empty state
function showEmptyState() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">🔍</div>
      <div class="empty-state-text">
        <p>This site isn't in our database yet.</p>
        <p style="margin-top: 8px;">Help us grow by suggesting similar sites!</p>
      </div>
    </div>
  `;
}

// Convert URL to clickable link
function makeClickableURL(urlString) {
  // Add https:// if not present
  if (!urlString.startsWith('http')) {
    return 'https://' + urlString;
  }
  return urlString;
}

// Display site information
function displaySite(siteData, similarSites, foundLinks, currentURL, currentBaseDomain) {
  const content = document.getElementById('content');
  
  let html = '';
  
  // Show site info
  if (siteData) {
    const { site, matchType } = siteData;
    
    let matchInfo = '';
    if (matchType === 'exact') {
      matchInfo = '✓ Exact match';
    } else if (matchType === 'path') {
      matchInfo = '⊃ Path match';
    } else if (matchType === 'hostname') {
      matchInfo = '⊃ Subdomain match';
    } else if (matchType === 'domain') {
      matchInfo = '⊃ Domain match';
    } else if (matchType === 'fallback-domain') {
      matchInfo = '⊃ Parent domain match';
    } else if (matchType === 'partial') {
      matchInfo = '⊃ Partial match';
    }
    
    html += `
      <div class="section">
        <div class="section-title">📚 About this site</div>
        <div class="category-badge">${site.category}</div>
        ${matchInfo ? `<div style="font-size: 11px; color: #999; margin-bottom: 8px;">${matchInfo}</div>` : ''}
        <p style="margin-bottom: 8px;">${site.description}</p>
        ${site.tags ? `
          <div class="tags">
            ${site.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
    
    // Show curated similar sites (excluding same domain)
    if (site.similar && site.similar.length > 0) {
      const filteredSimilar = site.similar.filter(urlString => {
        const p = parseURL('https://' + urlString);
        return !p || p.baseDomain !== currentBaseDomain;
      });
      if (filteredSimilar.length > 0) {
        html += `
        <div class="section">
          <div class="section-title">✨ Related sites</div>
          <ul class="link-list">
            ${filteredSimilar.map(urlString => {
              const similarSite = database.sites.find(s => s.url === urlString);
              return `
                <li class="link-item">
                  <a href="${makeClickableURL(urlString)}" target="_blank">
                    <div class="link-name">${similarSite ? similarSite.name : urlString}</div>
                    <div class="link-domain">${urlString}</div>
                    ${similarSite ? `<div class="link-description">${similarSite.description}</div>` : ''}
                  </a>
                </li>
              `;
            }).join('')}
          </ul>
        </div>
      `;
      }
    }
  }
  
  // Show category-based similar sites
  if (similarSites && similarSites.length > 0) {
    html += `
      <div class="section">
        <div class="section-title">🎯 Similar sites</div>
        <ul class="link-list">
          ${similarSites.map(s => `
            <li class="link-item">
              <a href="${makeClickableURL(s.url)}" target="_blank">
                <div class="link-name">${s.name}</div>
                <div class="link-domain">${s.url}</div>
                <div class="link-description">${s.description}</div>
                ${s.tags ? `
                  <div class="tags">
                    ${s.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                  </div>
                ` : ''}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }
  
  // Show links found on page (deduplicated)
  if (foundLinks && foundLinks.length > 0) {
    html += `
      <div class="section">
        <div class="section-title">🔗 Links from this page</div>
        <div class="found-links-count">Found ${foundLinks.length} link${foundLinks.length !== 1 ? 's' : ''} to known sites</div>
        <ul class="link-list">
          ${foundLinks.slice(0, 8).map(link => `
            <li class="link-item">
              <a href="${link.url}" target="_blank">
                <div class="link-name">${link.name}</div>
                <div class="link-domain">${link.displayUrl}</div>
                ${link.description ? `<div class="link-description">${link.description}</div>` : ''}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }
  
  if (!html) {
    showEmptyState();
    return;
  }
  
  content.innerHTML = html;
}

// Initialize popup
async function init() {
  // Load database
  const response = await fetch(browserAPI.runtime.getURL('database.json'));
  database = await response.json();
  
  // Get current tab
  const tab = await getCurrentTab();
  const parsed = parseURL(tab.url);
  
  // Update current site display
  if (parsed) {
    document.getElementById('currentSiteName').textContent = parsed.full || tab.title;
  } else {
    document.getElementById('currentSiteName').textContent = tab.title;
  }
  
  if (!parsed) {
    showEmptyState();
    return;
  }
  
  // Find site (with fallback to parent domain)
  const siteData = findSite(tab.url);
  
  // Find similar sites
  let similarSites = [];
  if (siteData) {
    similarSites = findSimilarByCategory(siteData.site.category, siteData.site.tags, siteData.site.url, parsed.baseDomain);
  }
  
  // Get links found on page from content script
  let foundLinks = [];
  try {
    const response = await browserAPI.tabs.sendMessage(tab.id, { action: 'getLinks' });
    if (response && response.links) {
      // Track seen URLs to avoid duplicates
      const seenUrls = new Set();
      seenUrls.add(parsed.full); // Don't show current page
      
      // Filter to only known sites, deduplicate, and exclude same domain
      foundLinks = response.links
        .map(link => {
          const linkSiteData = findSite(link.href);
          const linkParsed = parseURL(link.href);
          
          if (linkSiteData && linkParsed) {
            // Skip if same base domain as current page
            if (linkParsed.baseDomain === parsed.baseDomain) {
              return null;
            }
            // Deduplicate by the matched database entry URL (not the raw href),
            // so two links pointing to different paths of the same known site
            // (e.g. reddit.com/r/programming AND reddit.com/r/javascript both
            // matching "reddit.com") only appear once.
            if (seenUrls.has(linkSiteData.site.url)) {
              return null;
            }
            seenUrls.add(linkSiteData.site.url);
            
            return {
              url: link.href,
              displayUrl: linkParsed.full,
              name: linkSiteData.site.name,
              description: linkSiteData.site.description
            };
          }
          return null;
        })
        .filter(link => link !== null);
    }
  } catch (e) {
    console.log('Could not get links from page:', e);
  }
  
  // Display results
  displaySite(siteData, similarSites, foundLinks, parsed.full, parsed.baseDomain);
  
  // Send count to background service worker to update badge
  browserAPI.runtime.sendMessage({ 
    action: 'setBadge', 
    count: foundLinks.length 
  });
}

// Handle contribute link
document.getElementById('contributeLink').addEventListener('click', (e) => {
  e.preventDefault();
  browserAPI.tabs.create({ 
    url: 'https://github.com/JlnWntr/Cu-Bridges' 
  });
});

// Run init
init();
