// NeuralReader V3.4 | Architect: Joseph Rocco Peransi
// Copyright (c) 2026 Joseph Rocco Peransi. All rights reserved.
// Author: Joseph Rocco Peransi
// License: GNU General Public License v3.0 (GPL-3.0)
// NeuralReader by Joseph Rocco Peransi - local-first audio interface.
const AUTHOR_NAME = "Joseph Rocco Peransi";

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({ id: "read-selection", title: "NeuralReader: Read Selection", contexts: ["selection"] });
});
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "read-selection" && info.selectionText) {
        chrome.storage.local.get(["rate", "voiceURI"], (data) => speakText(info.selectionText, data.rate, data.voiceURI));
    }
});
chrome.runtime.onMessage.addListener((req) => {
    if (req.command === "speak") speakText(req.text, req.rate, req.voiceName);
    if (req.command === "stop") stopReading();
});
chrome.commands.onCommand.addListener((cmd) => {
    if (cmd === "read_selection") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (!tabs[0]?.id) return;
            chrome.scripting.executeScript({ target: {tabId: tabs[0].id}, func: () => window.getSelection().toString() }, (res) => {
                if (res?.[0]?.result) {
                    const txt = res[0].result.trim();
                    if (txt) chrome.storage.local.get(["rate", "voiceURI"], (d) => speakText(txt, d.rate, d.voiceURI));
                }
            });
        });
    }
});

// Long-text chunking, by Joseph Rocco Peransi.
// Chrome TTS hangs on very long blocks, so we split text into small
// sentence pieces (about 200 characters each) and read them one at a
// time. Tested on 1000+ characters. Stopping clears the queue.
const CHUNK_MAX_LEN = 200;
let speakQueue = [];
let speakIndex = 0;
let speakStopped = false;
let speakRate = 1.0;
let speakVoiceName = null;

function chunkText(text, maxLen) {
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    if (!clean) return [];
    const sentences = clean.match(/[^.!?]+[.!?]+["'\)\]]*\s*|[^.!?]+$/g) || [clean];
    const chunks = [];
    for (const sentence of sentences) {
        const s = sentence.trim();
        if (!s) continue;
        if (s.length <= maxLen) {
            chunks.push(s);
            continue;
        }
        // Long sentence: split by words so no chunk is too big.
        const words = s.split(" ");
        let part = "";
        for (const word of words) {
            const next = part ? part + " " + word : word;
            if (next.length > maxLen && part) {
                chunks.push(part);
                part = word;
            } else {
                part = next;
            }
        }
        if (part) chunks.push(part);
    }
    return chunks;
}

function speakNext() {
    if (speakStopped) return;
    if (speakIndex >= speakQueue.length) return;
    const chunk = speakQueue[speakIndex];
    const opts = { rate: parseFloat(speakRate) || 1.0, onEvent: (event) => {
        if (speakStopped) return;
        if (event && (event.type === "end" || event.type === "interrupted" || event.type === "cancelled" || event.type === "error")) {
            speakIndex++;
            speakNext();
        }
    } };
    if (speakVoiceName) opts.voiceName = speakVoiceName;
    try { chrome.tts.speak(chunk, opts); } catch (e) { console.error(e); speakIndex++; speakNext(); }
}

function speakText(text, rate = 1.0, voiceName) {
    stopReading();
    speakStopped = false;
    speakRate = rate;
    speakVoiceName = voiceName || null;
    speakQueue = chunkText(text, CHUNK_MAX_LEN);
    speakIndex = 0;
    if (speakQueue.length) speakNext();
}

function stopReading() {
    speakStopped = true;
    speakQueue = [];
    speakIndex = 0;
    try { chrome.tts.stop(); } catch (e) { console.error(e); }
}
