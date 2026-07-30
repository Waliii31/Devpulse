const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\\\Users\\\\USER\\\\.gemini\\\\antigravity-ide\\\\brain\\\\8a78ab36-08dc-4d7f-b9f9-24df2c110d24\\\\.system_generated\\\\logs\\\\transcript_full.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lastCodeContent = null;

  for await (const line of rl) {
    try {
      const data = JSON.parse(line);
      if (data.tool_calls) {
        for (const call of data.tool_calls) {
          if (call.args && call.args.TargetFile && call.args.TargetFile.includes('DashboardSection.tsx')) {
            if (call.args.CodeContent) {
              lastCodeContent = call.args.CodeContent;
            }
          }
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  if (lastCodeContent) {
    fs.writeFileSync('d:\\Devpulse\\extracted_dashboard.tsx', lastCodeContent, 'utf-8');
    console.log('Extracted file successfully!');
  } else {
    console.log('No write_to_file found for DashboardSection.tsx');
  }
}

processLineByLine();
