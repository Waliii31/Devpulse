import json
import re

with open(r'C:\Users\USER\.gemini\antigravity-ide\brain\8a78ab36-08dc-4d7f-b9f9-24df2c110d24\dashboard_calls.jsonl', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

for line in lines:
    match = re.search(r'({.*})', line)
    if match:
        try:
            data = json.loads(match.group(1))
            if 'tool_calls' in data:
                for call in data['tool_calls']:
                    if 'args' in call:
                        args = call['args']
                        if 'TargetFile' in args and 'DashboardSection.tsx' in args['TargetFile']:
                            if 'CodeContent' in args:
                                print(f"Found write_to_file! Length: {len(args['CodeContent'])}")
                                with open('extracted_dashboard.tsx', 'w', encoding='utf-8') as out:
                                    out.write(args['CodeContent'])
                            elif 'ReplacementChunks' in args:
                                print("Found ReplacementChunks")
                            elif 'ReplacementContent' in args:
                                print("Found ReplacementContent")
        except Exception as e:
            pass
