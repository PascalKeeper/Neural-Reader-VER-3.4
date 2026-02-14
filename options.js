document.addEventListener("DOMContentLoaded", async () => {
    const mic = document.getElementById("mic");
    const lang = document.getElementById("lang");
    try { await navigator.mediaDevices.getUserMedia({audio:true}); } catch(e){}
    const devs = await navigator.mediaDevices.enumerateDevices();
    const ins = devs.filter(d => d.kind === "audioinput");
    mic.innerHTML = "";
    ins.forEach(d => { const o = document.createElement("option"); o.value = d.deviceId; o.innerText = d.label || "Mic"; mic.appendChild(o); });
    
    chrome.storage.local.get(["micId", "lang"], (d) => {
        if(d.micId) mic.value = d.micId;
        if(d.lang) lang.value = d.lang;
    });
    const save = () => chrome.storage.local.set({micId: mic.value, lang: lang.value});
    mic.onchange = save; lang.onchange = save;
});
