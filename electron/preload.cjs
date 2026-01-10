const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  startElectronDownload: (url, fileName) => {
    ipcRenderer.send("electron-download", { url, fileName });
  },

  onDownloadStarted: (callback) => {
    ipcRenderer.on("download-started", (_, fileName) =>
      callback(fileName)
    );
  },

  onDownloadComplete: (callback) => {
    ipcRenderer.on("download-complete", (_, fileName) =>
      callback(fileName)
    );
  },

  onDownloadFailed: (callback) => {
    ipcRenderer.on("download-failed", (_, fileName) =>
      callback(fileName)
    );
  },
});
