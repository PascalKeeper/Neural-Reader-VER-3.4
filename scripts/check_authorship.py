#!/usr/bin/env python3
"""Authorship check for NeuralReader, by Joseph Rocco Peransi.

Burned-in authorship: every source file must carry the full name
"Joseph Rocco Peransi". This script is run by GitHub Actions on every
push / pull request (.github/workflows/authorship-check.yml), and can
also be run locally before upload:

    python3 scripts/check_authorship.py

It exits 1 (fail) if any required file is missing the name, so a
push without authorship cannot pass the check.
Copyright (c) 2026 Joseph Rocco Peransi. License: GNU GPL v3.0.
"""
import pathlib
import sys

AUTHOR = "Joseph Rocco Peransi"
COPYRIGHT = "Copyright (c) 2026 Joseph Rocco Peransi"

# Files that must carry the full author name.
REQUIRED_NAME = [
    "manifest.json",
    "background.js",
    "popup.js",
    "popup.html",
    "options.js",
    "options.html",
    "content.js",
    "README.md",
]

# Files that must also carry the full copyright line.
REQUIRED_COPYRIGHT = [
    "background.js",
    "popup.js",
    "popup.html",
]

def main():
    root = pathlib.Path(__file__).resolve().parent.parent
    failed = False
    for rel in REQUIRED_NAME:
        path = root / rel
        if not path.exists():
            print(f"SKIP {rel}: file not in repo")
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if AUTHOR in text:
            print(f"PASS {rel}: contains '{AUTHOR}'")
        else:
            print(f"FAIL {rel}: missing '{AUTHOR}'")
            failed = True
    for rel in REQUIRED_COPYRIGHT:
        path = root / rel
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if COPYRIGHT in text:
            print(f"PASS {rel}: contains copyright")
        else:
            print(f"FAIL {rel}: missing '{COPYRIGHT}'")
            failed = True
    if failed:
        print("Authorship check FAILED - Joseph Rocco Peransi must be in every file.")
        return 1
    print("Authorship check PASSED - Joseph Rocco Peransi is burned in.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
