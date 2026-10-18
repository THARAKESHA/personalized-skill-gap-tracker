import os
import subprocess
import shutil
import markdown

md_path = r"C:\Users\thara\projects\skill-gap-tracker\MODULE_BY_MODULE_EXPLANATION.md"
html_path = r"C:\Users\thara\projects\skill-gap-tracker\temp_modules.html"
pdf_path = r"C:\Users\thara\projects\skill-gap-tracker\Personalized_Skill_Gap_Recognition_Modules_Guide.pdf"
desktop_pdf = r"C:\Users\thara\OneDrive\Desktop\Personalized_Skill_Gap_Recognition_Modules_Guide.pdf"
artifact_pdf = r"C:\Users\thara\.gemini\antigravity\brain\6708dc55-f2fd-48ae-a9b7-77683e5b0401\Personalized_Skill_Gap_Recognition_Modules_Guide.pdf"
edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

with open(md_path, "r", encoding="utf-8") as f:
    text = f.read()

# Convert markdown to HTML
html_body = markdown.markdown(text, extensions=["tables", "fenced_code", "toc"])

styled_html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Personalized Skill Gap Recognition System - Module-by-Module Specification</title>
<style>
  @page {{
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
  }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    line-height: 1.6;
    font-size: 11.5px;
    background: #ffffff;
  }}
  h1 {{
    font-size: 19px;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2.5px solid #0f172a;
    padding-bottom: 6px;
    margin-top: 0;
    line-height: 1.3;
  }}
  h2 {{
    font-size: 14.5px;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 4px;
    margin-top: 20px;
    page-break-after: avoid;
  }}
  h3 {{
    font-size: 12.5px;
    font-weight: 600;
    color: #1e293b;
    margin-top: 14px;
    page-break-after: avoid;
  }}
  p {{
    margin: 5px 0;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 10px;
    page-break-inside: avoid;
  }}
  th, td {{
    border: 1px solid #cbd5e1;
    padding: 6px 8px;
    text-align: left;
    vertical-align: top;
  }}
  th {{
    background-color: #f1f5f9;
    font-weight: 700;
    color: #0f172a;
  }}
  tr:nth-child(even) {{
    background-color: #f8fafc;
  }}
  pre {{
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 10px;
    font-size: 10px;
    font-family: Consolas, "Courier New", monospace;
    white-space: pre-wrap;
    word-break: break-all;
    page-break-inside: avoid;
  }}
  code {{
    background-color: #f1f5f9;
    padding: 1.5px 4px;
    border-radius: 4px;
    font-size: 10px;
    font-family: Consolas, monospace;
    color: #0f172a;
  }}
  blockquote {{
    border-left: 4px solid #0284c7;
    background-color: #f0f9ff;
    padding: 8px 12px;
    margin: 10px 0;
    border-radius: 0 6px 6px 0;
    color: #0369a1;
    page-break-inside: avoid;
  }}
  ul, ol {{
    padding-left: 18px;
    margin: 6px 0;
  }}
  li {{
    margin-bottom: 2.5px;
  }}
  hr {{
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 14px 0;
  }}
</style>
</head>
<body>
{html_body}
</body>
</html>"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(styled_html)

# Run Edge headless print-to-pdf
cmd = [
    edge_exe,
    "--headless",
    "--disable-gpu",
    f"--print-to-pdf={pdf_path}",
    "--no-pdf-header-footer",
    html_path,
]

print("Rendering Module Breakdown PDF via headless Edge...")
res = subprocess.run(cmd, capture_output=True, text=True)

if os.path.exists(pdf_path):
    print("SUCCESS: PDF generated successfully!")
    print(f"Path: {pdf_path}")
    print(f"Size: {os.path.getsize(pdf_path):,} bytes")
    
    # Copy to Desktop
    try:
        shutil.copy2(pdf_path, desktop_pdf)
        print("Copied to Desktop:", desktop_pdf)
    except Exception as e:
        print("Desktop copy error:", e)

    # Copy to Artifact directory
    try:
        shutil.copy2(pdf_path, artifact_pdf)
        print("Copied to Artifact dir:", artifact_pdf)
    except Exception as e:
        print("Artifact copy error:", e)

    # Clean up temp html
    if os.path.exists(html_path):
        os.remove(html_path)
else:
    print("PDF generation failed:", res.stderr)
