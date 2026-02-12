
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setBadge' && sender.tab) {
    const count = request.count || 0;
    const badgeText = count > 0 ? String(count) : '';
    
    chrome.action.setBadgeText({ text: badgeText, tabId: sender.tab.id });
    chrome.action.setBadgeBackgroundColor({ color: '#7c3aed', tabId: sender.tab.id });
  }
});
