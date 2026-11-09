document.addEventListener("DOMContentLoaded", () => {
    const ui = {
        mic: document.getElementById("btn-mic"),
        read: document.getElementById("btn-read"),
        stop: document.getElementById("btn-stop"),
        exit: document.getElementById("btn-exit"),
        opt: document.getElementById("btn-opt"),
        txt: document.getElementById("txt"),
        rate: document.getElementById("rate"),
        voice: document.getElementById("voice"),
        stat: document.getElementById("status")
    };
    let rec = null, isRec = false, lang = "en-US";

    chrome.storage.local.get(["rate", "voiceURI", "lang"], (d) => {
        if(d.rate) ui.rate.value = d.rate;
        if(d.lang) lang = d.lang;
    });

    chrome.tabs.query({active:true, currentWindow:true}, (tabs) => {
        if(!tabs[0]?.id) return;
        chrome.scripting.executeScript({target:{tabId:tabs[0].id}, func:()=>window.getSelection().toString()}, (res) => {
            if(res?.[0]?.result) ui.txt.value = res[0].result.trim();
        });
    });

    if("webkitSpeechRecognition" in window) {
        rec = new webkitSpeechRecognition();
        rec.continuous = true; rec.interimResults = true;
        rec.onstart = () => { isRec = true; ui.mic.classList.add("rec"); ui.stat.innerText = "Listening ("+lang+")..."; };
        rec.onend = () => { isRec = false; ui.mic.classList.remove("rec"); ui.stat.innerText = "Standby"; };
        rec.onresult = (e) => { for(let i=e.resultIndex; i<e.results.length; ++i) if(e.results[i].isFinal) ui.txt.value += e.results[i][0].transcript + " "; };
        rec.onerror = (e) => { ui.stat.innerText = "Mic Error: " + e.error; };
    }

    ui.mic.onclick = () => {
        if(!rec) return;
        if(isRec) rec.stop();
        else chrome.storage.local.get(["lang"], (d) => { rec.lang = d.lang || "en-US"; lang = rec.lang; rec.start(); });
    };

    ui.read.onclick = () => {
        const t = ui.txt.value.trim();
        if(t) { ui.stat.innerText = "Speaking..."; chrome.runtime.sendMessage({command:"speak", text:t, rate:ui.rate.value, voiceName:ui.voice.value}); }
    };
    ui.stop.onclick = () => { chrome.runtime.sendMessage({command:"stop"}); if(isRec) rec.stop(); ui.stat.innerText = "Stopped"; };
    ui.exit.onclick = () => { chrome.runtime.sendMessage({command:"stop"}); if(isRec) rec.stop(); ui.stat.innerText = "Closed"; window.close(); };
    ui.opt.onclick = () => chrome.runtime.openOptionsPage();
    ui.rate.oninput = () => chrome.storage.local.set({rate: ui.rate.value});
    ui.voice.onchange = () => chrome.storage.local.set({voiceURI: ui.voice.value});

    chrome.tts.getVoices((vs) => {
        ui.voice.innerHTML = "";
        vs.sort((a,b) => (a.remote === b.remote) ? 0 : a.remote ? 1 : -1);
        vs.forEach(v => {
            const o = document.createElement("option");
            o.value = v.voiceName;
            o.innerText = (v.remote ? "[Net] " : "[Loc] ") + v.voiceName.replace("Microsoft ","").replace("Google ","");
            ui.voice.appendChild(o);
        });
        chrome.storage.local.get(["voiceURI"], (d) => { if(d.voiceURI) ui.voice.value = d.voiceURI; });
    });
});
