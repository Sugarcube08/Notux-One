const Page = require('../models/Pages');

async function generateUniquePageTitle(notebookID, sectionID, baseTitle) {

  const locationFilter = sectionID
    ? { sectionID }
    : { sectionID: null };

  const pages = await Page.find({
    notebookID,
    ...locationFilter,
    title: { $regex: `^${escapeRegExp(baseTitle)}` }
  }).lean();

  if (!pages.length) return baseTitle;
  
  let maxN = 0;
  const regex = new RegExp(`^${escapeRegExp(baseTitle)}(?: \\((\\d+)\\))?$`);

  for (const p of pages) {
    const m = p.title.match(regex);
    if (!m) continue;
    const num = m[1] ? parseInt(m[1], 10) : 0;
    if (num > maxN) maxN = num;
  }

  return `${baseTitle} (${maxN + 1})`;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { generateUniquePageTitle };
