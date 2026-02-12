# 🚀 Installing Cu-bridges in Chrome/Edge/Brave

This guide shows you how to install the Cu-bridges extension in Chromium-based browsers (Chrome, Edge, Brave, Vivaldi, etc.) by loading it as an unpacked extension.

---

## Step 1: Download and Extract

1. Download the `cu-bridges.zip` file
2. Extract it to a permanent location on your computer
   - ⚠️ **Important:** Don't delete this folder! The browser needs it to run the extension
   - Good locations: `Documents/Extensions/cu-bridges` or `~/cu-bridges`
   - Bad locations: Downloads folder, Desktop (you might delete it by accident)

---

## Step 2: Open Extensions Page

Choose your browser:

**Chrome:**
- Go to `chrome://extensions/`
- Or: Menu (⋮) → Extensions → Manage Extensions

**Edge:**
- Go to `edge://extensions/`
- Or: Menu (⋯) → Extensions → Manage Extensions

**Brave:**
- Go to `brave://extensions/`
- Or: Menu (☰) → Extensions → Manage Extensions

---

## Step 3: Enable Developer Mode

In the top-right corner of the extensions page, you'll see a toggle labeled **"Developer mode"**

1. Click the toggle to turn it **ON**
2. New buttons will appear: "Load unpacked", "Pack extension", "Update"

![Developer mode toggle in the top-right corner]

---

## Step 4: Load the Extension

1. Click the **"Load unpacked"** button (top-left area)
2. A file browser will open
3. Navigate to the folder where you extracted `cu-bridges`
4. Select the **folder itself** (the one containing `manifest.json`)
5. Click **"Select Folder"** or **"Open"**

![Load unpacked button and folder selection]

---

## Step 5: Verify Installation

The extension should now appear in your extensions list:

- **Name:** Cu-bridges
- **Version:** 1.0.0
- **Description:** "Discover connections across the web..."
- **Status:** Should show as enabled (blue toggle)

![Cu-bridges extension card showing enabled status]

---

## Step 6: Pin to Toolbar (Optional but Recommended)

1. Click the **puzzle piece icon** (🧩) in your browser toolbar
2. Find **Cu-bridges** in the dropdown
3. Click the **pin icon** (📌) next to it
4. The Cu-bridges icon will now appear in your toolbar

![Extension pinning menu]

---

## 🎉 Done!

The extension is now installed! You should see:
- The Cu-bridges icon (🌉) in your toolbar
- A badge with a number showing how many external known sites are linked from the current page
- Click the icon to see recommendations and links

---

## 📝 Notes

### About Developer Mode
- You'll see a banner saying "Developer mode extensions are enabled" - this is normal
- Some browsers may disable the extension on restart - just re-enable it if needed
- This happens because it's not from the Chrome Web Store

### Updating the Extension
When a new version is released:
1. Download the new `cu-bridges.zip`
2. Extract it to the **same location** (overwrite old files)
3. Go to `chrome://extensions/`
4. Click the **refresh icon** (🔄) on the Cu-bridges card
5. Or click the **"Update"** button at the top

### Uninstalling
1. Go to `chrome://extensions/`
2. Find Cu-bridges
3. Click **"Remove"**
4. Confirm
5. You can now delete the extension folder from your computer

---

## ⚠️ Troubleshooting

**Extension won't load:**
- Make sure you selected the folder containing `manifest.json`
- Check that all files from the zip are present
- Try restarting your browser

**Badge not updating:**
- Refresh the page you're on
- Make sure the site actually links to known sites in the database
- Check the browser console (F12) for errors

**Extension disappeared after restart:**
- This can happen in some Chrome versions
- Just re-enable it in `chrome://extensions/`
- Consider keeping Developer Mode on

**"Manifest file is missing or unreadable":**
- The folder structure might be wrong
- Make sure `manifest.json` is directly in the selected folder, not in a subfolder

---

## 🌐 Privacy Note

Cu-bridges runs **completely locally**:
- No data collection
- No tracking
- No external servers
- All processing happens in your browser
- Your browsing history never leaves your computer

---

## 💡 Tips

- The badge number shows how many **unique external sites** from the database are linked on the current page
- Click the icon to explore connections and discover new sites
- The extension works best on blogs, personal sites, and content-rich pages
- Contribute to the database on GitHub to help others discover great sites!

---

**Enjoy discovering connections across the web!** 🌉✨
