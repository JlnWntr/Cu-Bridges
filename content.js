// Cross-browser compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Content script that runs on all pages to analyze links and set badge

let database = null;

// Load database
async function loadDatabase() {
  if (database) return database;
  try {
    const response = await fetch(browserAPI.runtime.getURL('database.json'));
    database = await response.json();
  } catch (e) {
    console.error('Cu-bridges: failed to load database', e);
  }
  return database;
}

// Parse URL (same as popup.js)
function parseURL(urlString) {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname;
    const pathname = url.pathname;
    const cleanPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');
    const parts = hostname.split('.');
    let baseDomain = hostname;
    if (parts.length > 2) {
      baseDomain = parts.slice(-2).join('.');
    }
    return {
      full: hostname + cleanPath,
      hostname: hostname,
      domain: hostname.replace(/^www\./, ''),
      baseDomain: baseDomain,
      path: cleanPath
    };
  } catch (e) {
    return null;
  }
}

// Find site in database (same as popup.js)
function findSite(urlString) {
  if (!database) return null;
  const parsed = parseURL(urlString);
  if (!parsed) return null;
  
  let site = database.sites.find(s => s.url === parsed.full);
  if (site) return { site, matchType: 'exact' };
  site = database.sites.find(s => s.url === parsed.domain + parsed.path);
  if (site) return { site, matchType: 'path' };
  site = database.sites.find(s => s.url === parsed.hostname);
  if (site) return { site, matchType: 'hostname' };
  site = database.sites.find(s => s.url === parsed.domain);
  if (site) return { site, matchType: 'domain' };
  if (parsed.hostname !== parsed.baseDomain) {
    site = database.sites.find(s => s.url === parsed.baseDomain);
    if (site) return { site, matchType: 'fallback-domain' };
  }
  site = database.sites.find(s => parsed.full.startsWith(s.url));
  if (site) return { site, matchType: 'partial' };
  return null;
}

// Listen for messages from popup
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getLinks') {
    const links = analyzePageLinks();
    sendResponse({ links: links });
  }
  return true;
});

// Analyze links on the current page
function analyzePageLinks() {
  const allLinks = document.querySelectorAll('a[href]');
  const linkData = [];
  
  const relevantSections = [
    'aside',
    'footer', 
    '[class*="blogroll"]',
    '[class*="links"]',
    '[class*="related"]',
    '[class*="recommended"]',
    '[class*="friends"]',
    '[class*="similar"]',
    '[id*="blogroll"]',
    '[id*="links"]',
    '[id*="sidebar"]'
  ];
  
  allLinks.forEach(link => {
    const href = link.href;
    
    if (!href || 
        href.startsWith('#') || 
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        !href.startsWith('http')) {
      return;
    }
    
    let isRelevant = false;
    for (const selector of relevantSections) {
      if (link.closest(selector)) {
        isRelevant = true;
        break;
      }
    }
    
    const linkText = link.textContent.trim().toLowerCase();
    const relevantKeywords = ['blog', 'site', 'recommended', 'similar', 'related', 'friend'];
    if (relevantKeywords.some(keyword => linkText.includes(keyword))) {
      isRelevant = true;
    }
    
    if (isRelevant) {
      linkData.push({
        href: href,
        text: link.textContent.trim(),
        title: link.getAttribute('title') || ''
      });
    }
  });
  
  return linkData;
}

// Update badge based on links found
async function updateBadge() {
  const db = await loadDatabase();
  if (!db) return;
  
  const currentParsed = parseURL(window.location.href);
  if (!currentParsed) return;
  
  const links = analyzePageLinks();
  const seenSiteUrls = new Set();
  
  // Filter and count unique external known-site links
  for (const link of links) {
    const linkParsed = parseURL(link.href);
    if (!linkParsed) continue;
    
    // Skip same-domain links
    if (linkParsed.baseDomain === currentParsed.baseDomain) continue;
    
    const linkSiteData = findSite(link.href);
    if (!linkSiteData) continue;
    
    // Deduplicate by database entry URL
    if (seenSiteUrls.has(linkSiteData.site.url)) continue;
    seenSiteUrls.add(linkSiteData.site.url);
  }
  
  const count = seenSiteUrls.size;
  
  // Send count to background service worker to set badge
  browserAPI.runtime.sendMessage({ 
    action: 'setBadge', 
    count: count 
  });
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateBadge);
} else {
  updateBadge();
}


