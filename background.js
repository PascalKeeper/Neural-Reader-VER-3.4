// NeuralReader V3.4 | Architect: Joseph Rocco Peransi
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
    if (req.command === "stop") chrome.tts.stop();
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
function speakText(text, rate = 1.0, voiceName) {
    chrome.tts.stop();
    const opts = { rate: parseFloat(rate) };
    if (voiceName) opts.voiceName = voiceName;
    try { chrome.tts.speak(text, opts); } catch (e) { console.error(e); }
}
