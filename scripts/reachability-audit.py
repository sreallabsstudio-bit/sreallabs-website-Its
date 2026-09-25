#!/usr/bin/env python3
"""Reachability audit: which files in src/ are imported by live code?
Entry-based BFS from src/app/** over the import graph. Files not reachable
from entries are dead (including dead chains like use-toast.ts -> toast.tsx).
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")

IMPORT_RE = re.compile(r"""(?:import|export)\s+(?:[\w*{}\s,]+?\s+from\s+)?['"]([^'"]+)['"]""")
DYN_RE = re.compile(r"""import\(\s*['"]([^'"]+)['"]\s*\)""")

def resolve(specifier, from_file):
    if specifier.startswith("@/"):
        base = os.path.join(SRC, specifier[2:])
    elif specifier.startswith("."):
        base = os.path.normpath(os.path.join(os.path.dirname(from_file), specifier))
    else:
        return None  # external package
    candidates = [base]
    for ext in (".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".json"):
        candidates.append(base + ext)
    candidates.append(os.path.join(base, "index.ts"))
    candidates.append(os.path.join(base, "index.tsx"))
    for c in candidates:
        if os.path.isfile(c):
            return os.path.abspath(c)
    return None

def imports_of(path):
    try:
        text = open(path, encoding="utf-8", errors="replace").read()
    except Exception:
        return []
    return [m.group(1) for m in IMPORT_RE.finditer(text)] + [m.group(1) for m in DYN_RE.finditer(text)]

graph = {}
all_files = []
for dirpath, dirnames, filenames in os.walk(SRC):
    for fn in filenames:
        if fn.endswith((".ts", ".tsx")):
            p = os.path.abspath(os.path.join(dirpath, fn))
            all_files.append(p)
            graph[p] = []
            for spec in imports_of(p):
                r = resolve(spec, p)
                if r:
                    graph[p].append(r)

UI_PREFIX = os.path.join(SRC, "components") + os.sep + "ui" + os.sep

entries = [f for f in all_files if os.sep + "app" + os.sep in f]
reached = set()
stack = list(entries)
while stack:
    cur = stack.pop()
    if cur in reached:
        continue
    reached.add(cur)
    for dep in graph.get(cur, []):
        if dep not in reached:
            stack.append(dep)

unused_ui = sorted(f for f in all_files if f.startswith(UI_PREFIX) and f not in reached)
used_ui = sorted(f for f in all_files if f.startswith(UI_PREFIX) and f in reached)
unreachable_nonui = sorted(f for f in all_files if not f.startswith(UI_PREFIX) and f not in reached)

print("=== USED UI (%d) ===" % len(used_ui))
for f in used_ui:
    print("  ", os.path.relpath(f, ROOT))
print("=== UNUSED UI (%d) ===" % len(unused_ui))
for f in unused_ui:
    print("  ", os.path.relpath(f, ROOT))
print("=== UNREACHABLE non-ui (%d) ===" % len(unreachable_nonui))
for f in unreachable_nonui:
    print("  ", os.path.relpath(f, ROOT))
