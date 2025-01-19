// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Date Calculator Plus installed');
});

// Optional: Add context menu integration
chrome.contextMenus.create({
  id: 'datecalculator',
  title: 'Calculate dates',
  contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'datecalculator') {
    // Handle selected text if needed
    chrome.tabs.create({
      url: 'popup.html'
    });
  }
});

// Optional: Add keyboard shortcut handling
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-calculator') {
    chrome.tabs.create({
      url: 'popup.html'
    });
  }
}); 