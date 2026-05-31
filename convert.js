const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'src/templates/template1.html');
const targetPath = path.join(__dirname, 'src/routes/newspaper.$year.$month.$day.tsx');

let html = fs.readFileSync(templatePath, 'utf-8');

// Extract the body content (from <header> to </footer>)
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
let bodyContent = bodyMatch ? bodyMatch[1] : html;

// Convert HTML to JSX
let jsx = bodyContent
  .replace(/class=/g, 'className=')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<img([^>]*)>/g, '<img$1/>')
  .replace(/<meta([^>]*)>/g, '<meta$1/>')
  .replace(/<link([^>]*)>/g, '<link$1/>')
  .replace(/<input([^>]*)>/g, '<input$1/>')
  .replace(/<br>/g, '<br/>')
  .replace(/<hr>/g, '<hr/>');

const newFrontPage = `
function FrontPage({
  lead, secondaries, briefs, onPick,
}: {
  lead?: Report; secondaries: Report[]; briefs: Report[];
  onPick: (r: Report) => void;
}) {
  if (!lead) return <Empty label="No stories in this edition." />;
  return (
    <div className="bg-[#f4f4f2] text-[#1a1a1a] selection:bg-[#a6392e] selection:text-white p-4 md:p-8" style={{ fontFamily: '"Libre Baskerville", serif' }}>
      <style dangerouslySetInnerHTML={{ __html: \`
        @import url('https://fonts.cdnfonts.com/css/chomsky');
        .newspaper-masthead { font-family: 'Chomsky', 'Playfair Display', serif; }
        .font-headline { font-family: 'Playfair Display', serif; }
        .justified { text-align: justify; text-justify: inter-word; }
        .broadsheet-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; }
        .rule-vertical { border-right: 1px solid #1a1a1a; padding-right: 10px; margin-right: -10px; }
        .rule-top { border-top: 1px solid #1a1a1a; }
        .rule-bottom { border-bottom: 1px solid #1a1a1a; }
        .double-rule-bottom { border-bottom: 3px double #1a1a1a; }
        .dropcap::first-letter { float: left; font-size: 3.5rem; line-height: 0.8; margin: 0.1em 0.1em 0.1em 0; font-family: 'Playfair Display', serif; font-weight: 900; }
        @media (max-width: 1024px) { .broadsheet-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px) { .broadsheet-grid { grid-template-columns: 1fr; } .rule-vertical { border-right: none; border-bottom: 1px solid #1a1a1a; padding-bottom: 20px; } }
      \`}} />
      ${jsx}
    </div>
  );
}
`;

let targetFile = fs.readFileSync(targetPath, 'utf-8');
const frontPageRegex = /function FrontPage\([^)]*\)\s*\{[\s\S]*?(?=function SectionPage)/;
targetFile = targetFile.replace(frontPageRegex, newFrontPage + '\n\n');

// we also need to remove the default paperRef wrapper styles so it looks like the template
targetFile = targetFile.replace(
  /className="px-12 pt-10 pb-12 text-neutral-900" style={{ fontFamily: '"Fraunces", Georgia, serif' }}/,
  'className="print:p-0"'
);

// remove the default inner header and footer if page.kind === 'front'
targetFile = targetFile.replace(
  /<header className="border-b-4 border-neutral-900 pb-4 mb-2">[\s\S]*?<\/header>/,
  `{page.kind !== "front" && (
    <header className="border-b-4 border-neutral-900 pb-4 mb-2 px-12 pt-10">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-neutral-600 mb-3">
        <span>Vol. MMXXVI · No. {Number(day)}</span>
        <span>{dateStr}</span>
        <span>$2.00</span>
      </div>
      <h1 className="text-center text-6xl md:text-7xl tracking-tight font-medium leading-none">
        NoboDorshi
      </h1>
      <div className="text-center text-[11px] uppercase tracking-[0.4em] mt-3 text-neutral-700">
        The Independent Daily of Record
      </div>
    </header>
  )}`
);

targetFile = targetFile.replace(
  /<footer className="mt-12 pt-4 border-t border-neutral-900 flex items-center justify-between text-\[10px\] uppercase tracking-\[0.3em\] text-neutral-600">[\s\S]*?<\/footer>/,
  `{page.kind !== "front" && (
    <footer className="mt-12 pt-4 pb-12 px-12 border-t border-neutral-900 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-neutral-600">
      <span>Page {pageIdx + 1} of {totalPages}</span>
      <span>{page.label}</span>
      <span>nobodorshi.com</span>
    </footer>
  )}`
);

// Remove the px-12 pt-10 pb-12 wrapper logic since we are moving it to the non-front elements
targetFile = targetFile.replace(/<div className="print:p-0">\s*\{page\.kind/, '{page.kind');
targetFile = targetFile.replace(/\{page\.kind !== "front" && \([\s\S]*?<\/footer>\n  \)\}\n\s*<\/div>/, '{page.kind !== "front" && (\n    <footer className="mt-12 pt-4 pb-12 px-12 border-t border-neutral-900 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-neutral-600">\n      <span>Page {pageIdx + 1} of {totalPages}</span>\n      <span>{page.label}</span>\n      <span>nobodorshi.com</span>\n    </footer>\n  )}');


fs.writeFileSync(targetPath, targetFile);
