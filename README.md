NeuralReader | Sovereign Core V3.4

Local-first Audio Interface. Architected by Joseph Rocco Peransi (@X/xAIModerator).

NeuralReader is a high-performance Chrome Extension designed for seamless Text-to-Speech (TTS) and Speech-to-Text (STT) interaction. Built with a focus on speed and local execution, it provides a "Sovereign Core" for processing web content into audio and voice into text.

What it does — simple version

Highlight any text on a page, press Alt+R or hit READ, and NeuralReader reads it out loud. That's it — it's already set up, you don't have to juggle a bunch of buttons.

- Reads what you highlight — select text, press Alt+R, or right-click and choose "NeuralReader: Read Selection"
- Reads what you paste — type or paste text into the box and hit ▶ READ
- Talk instead of typing — tap the 🎤 mic and speak, your words appear in the box
- Pick your voice — choose from the voices on your computer, local or online
- Change the speed — slide it slower or faster, 0.5x to 3.0x
- Stop anytime — tap ■ to stop reading
- Close it cleanly — tap ✕ EXIT to stop and close it
- Pop it out — tap ⧉ POP OUT to open NeuralReader in its own window you can drag around, resize, and keep up while you read
- Remembers your settings — your speed and voice are saved for next time

Core Features

Dynamic TTS Engine: Leverages chrome.tts for high-fidelity local and network-based voice synthesis.

Voice-to-Text Dictation: Integrated webkitSpeechRecognition for real-time transcription directly into the interface.

Sovereign Interface: A dark-mode, minimalist UI built for efficiency and focus.

Context Awareness: Right-click context menus and Alt+R hotkeys for immediate reading of browser selections.

Hardware Integration: Custom selection for audio input devices (Microphones) and multi-language support.

Technical Specifications

Manifest Version: 3

Architect: Joseph Rocco Peransi (@X/xAIModerator)

Permissions: activeTab, scripting, tts, storage, audioCapture, contextMenus, windows

Logic Layers:

background.js: Service worker handling global TTS state and context menus.

popup.js: Reactive UI controller for transcription and voice selection.

options.js: Hardware abstraction layer for device enumeration.

Installation Instructions

1. Development Mode Setup

To install NeuralReader manually for development or private use:

Clone or Download: Save all project files (manifest.json, background.js, popup.html, etc.) into a dedicated folder.

Open Chrome Extensions: Navigate to chrome://extensions/.

Enable Developer Mode: Toggle the switch in the top right corner.

Load Unpacked: Click Load unpacked and select the project folder.

2. Configuration

Pin the Extension: Pin NeuralReader for quick access.

Initialize Hardware: Open Settings (⚙️), grant mic permissions, and select your devices.

Legal & Licensing

GNU GPL v3.0

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

Attribution & Third-Party Notice

Original Codebase: The architectural logic, UI design, state management, and implementation strategies are the original work of Joseph Rocco Peransi (@X/xAIModerator).

Third-Party Interfaces: This software interfaces with and utilizes the following native browser APIs:

Google Chrome Extension API: Powering the background service worker and manifest structure.

Web Speech API (webkitSpeechRecognition): Utilized for voice transcription logic.

Chrome TTS Engine: Utilized for audio synthesis.

Modifications: All standard API implementations have been heavily modified and optimized to fit the "Sovereign Core" architecture of NeuralReader.

Environment & Security

Privacy: All processing is handled locally via Chrome's native APIs.

Dependencies: Zero external bundlers or byte compilers. Pure JavaScript execution.

Be excellent to each other.
