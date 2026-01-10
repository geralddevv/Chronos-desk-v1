import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import {
  app,
  BrowserWindow,
  session,
  ipcMain,
  nativeTheme,
} from "electron";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ===============================
   FORCE DARK MODE (ALWAYS)
   =============================== */
nativeTheme.themeSource = "dark";

let pendingFileName = "OUTPUT.pdf"; // 👈 dynamic filename holder

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    show: false,
    icon: path.join(__dirname, "../assets/icon.ico"),
    autoHideMenuBar: true,

    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      sandbox: false,
      webSecurity: false,
    },
  });

  win.maximize();
  win.show();

  win.loadFile(path.join(__dirname, "../renderer/dist/index.html"));

  /* ===============================
     DOWNLOAD IPC (RECEIVE FROM UI)
     =============================== */
  ipcMain.on("electron-download", (event, { url, fileName }) => {
    pendingFileName = fileName || "OUTPUT.pdf";
    win.webContents.downloadURL(url);
  });

  /* ===============================
     DOWNLOAD HANDLER
     =============================== */
  session.defaultSession.on("will-download", (event, item, webContents) => {
    item.setSaveDialogOptions({
      title: "Save PDF",
      defaultPath: pendingFileName,
      filters: [{ name: "PDF File", extensions: ["pdf"] }],
    });

    item.on("updated", () => {
      webContents.send("download-started", pendingFileName);
    });

    item.once("done", (event, state) => {
      if (state === "completed") {
        webContents.send("download-complete", pendingFileName);
      } else {
        webContents.send("download-failed", pendingFileName);
      }
    });
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
