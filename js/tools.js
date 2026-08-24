/* =========================================
   DENN HOSTING - TOOLS JS
========================================= */


/* =========================================
   CONFIGURATION
========================================= */

const TERMAI_API_KEY =
  "Trial-5smzQTVpFNLW2YVB";

const TERMAI_TIKTOK_API =
  "https://api.termai.cc/api/downloader/tiktok";


/* =========================================
   REACTION MESSAGE CONFIG
========================================= */

const REACTION_API =
  "https://api.nexadev.my.id/api/rch";

const REACTION_API_KEY =
  "DennnCodee";

const REACTION_LIMIT_KEY =
  "denn_reaction_message_limit";

const REACTION_LIMIT_TIME =
  24 * 60 * 60 * 1000;


/* =========================================
   QR CODE
========================================= */

let qrCode = null;
let currentQRText = "";


function generateQR() {

  const input =
    document.getElementById("qrText");

  if (!input) {
    return;
  }


  const text =
    input.value.trim();


  if (!text) {

    alert(
      "Masukkan teks atau URL terlebih dahulu."
    );

    return;

  }


  currentQRText =
    text;


  const result =
    document.getElementById("qrResult");


  if (!result) {
    return;
  }


  result.innerHTML =
    "";


  qrCode =
    new QRCode(
      result,
      {
        text: text,
        width: 220,
        height: 220,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel:
          QRCode.CorrectLevel.H
      }
    );


  const actions =
    document.getElementById(
      "qrActions"
    );


  if (actions) {

    actions.style.display =
      "flex";

  }

}


/* =========================================
   DOWNLOAD QR
========================================= */

function downloadQR() {

  const canvas =
    document.querySelector(
      "#qrResult canvas"
    );


  if (!canvas) {

    alert(
      "Generate QR Code terlebih dahulu."
    );

    return;

  }


  const link =
    document.createElement(
      "a"
    );


  link.download =
    "DennHosting-QRCode.png";


  link.href =
    canvas.toDataURL(
      "image/png"
    );


  link.click();

}


/* =========================================
   COPY QR TEXT
========================================= */

function copyQRText() {

  if (!currentQRText) {
    return;
  }


  if (
    navigator.clipboard &&
    navigator.clipboard.writeText
  ) {

    navigator.clipboard
      .writeText(
        currentQRText
      )
      .then(
        function () {

          alert(
            "Text berhasil disalin."
          );

        }
      )
      .catch(
        function () {

          alert(
            "Gagal menyalin text."
          );

        }
      );

  }

}


/* =========================================
   TIKTOK DOWNLOADER
========================================= */

async function downloadTikTok() {

  const urlInput =
    document.getElementById(
      "tiktokUrl"
    );


  const button =
    document.getElementById(
      "tiktokButton"
    );


  const loading =
    document.getElementById(
      "tiktokLoading"
    );


  const result =
    document.getElementById(
      "tiktokResult"
    );


  const error =
    document.getElementById(
      "tiktokError"
    );


  if (!urlInput) {
    return;
  }


  const url =
    urlInput.value.trim();


  /* =====================================
     VALIDASI
  ===================================== */

  if (!url) {

    showTikTokError(
      "Masukkan link TikTok terlebih dahulu."
    );

    return;

  }


  if (
    !url.includes("tiktok.com") &&
    !url.includes("vt.tiktok.com")
  ) {

    showTikTokError(
      "Link yang dimasukkan bukan link TikTok."
    );

    return;

  }


  /* =====================================
     API KEY
  ===================================== */

  if (!TERMAI_API_KEY) {

    showTikTokError(
      "API Key Termai belum dipasang."
    );

    return;

  }


  /* =====================================
     RESET
  ===================================== */

  if (result) {

    result.style.display =
      "none";

  }


  if (error) {

    error.style.display =
      "none";

    error.innerText =
      "";

  }


  if (loading) {

    loading.style.display =
      "block";

  }


  if (button) {

    button.disabled =
      true;

    button.innerText =
      "Mengambil data...";

  }


  try {

    /* =================================
       API URL
    ================================= */

    const apiUrl =
      TERMAI_TIKTOK_API +
      "?key=" +
      encodeURIComponent(
        TERMAI_API_KEY
      ) +
      "&url=" +
      encodeURIComponent(
        url
      );


    /* =================================
       REQUEST
    ================================= */

    const response =
      await fetch(
        apiUrl,
        {
          method: "GET"
        }
      );


    if (!response.ok) {

      throw new Error(
        "API Error HTTP " +
        response.status
      );

    }


    /* =================================
       JSON
    ================================= */

    const data =
      await response.json();


    console.log(
      "TikTok API Response:",
      data
    );


    /* =================================
       ERROR CHECK
    ================================= */

    if (
      data.error ||
      data.status === false ||
      data.success === false
    ) {

      throw new Error(
        data.message ||
        data.error ||
        "Gagal mengambil video TikTok."
      );

    }


    /* =================================
       PARSE
    ================================= */

    const parsed =
      parseTikTokResponse(
        data
      );


    if (
      !parsed.video &&
      !parsed.audio
    ) {

      throw new Error(
        "URL video tidak ditemukan dari response API."
      );

    }


    /* =================================
       SHOW
    ================================= */

    showTikTokResult(
      parsed
    );

  } catch (err) {

    console.error(
      "TikTok Downloader Error:",
      err
    );


    showTikTokError(
      err.message ||
      "Terjadi kesalahan saat mengambil video."
    );

  } finally {

    if (loading) {

      loading.style.display =
        "none";

    }


    if (button) {

      button.disabled =
        false;

      button.innerText =
        "Download TikTok";

    }

  }

}


/* =========================================
   PARSE TIKTOK RESPONSE
========================================= */

function parseTikTokResponse(
  data
) {

  const result = {

    video: null,

    audio: null,

    thumbnail: null,

    title:
      "TikTok Video",

    author:
      ""

  };


  function scan(object) {

    if (!object) {
      return;
    }


    if (
      typeof object ===
      "string"
    ) {

      if (
        isMediaUrl(
          object
        )
      ) {

        const lower =
          object.toLowerCase();


        if (
          !result.video &&
          (
            lower.includes(".mp4") ||
            lower.includes("video")
          )
        ) {

          result.video =
            object;

        }


        if (
          !result.audio &&
          (
            lower.includes(".mp3") ||
            lower.includes("audio")
          )
        ) {

          result.audio =
            object;

        }

      }

      return;

    }


    if (
      Array.isArray(
        object
      )
    ) {

      object.forEach(
        function(item) {

          scan(item);

        }
      );

      return;

    }


    if (
      typeof object ===
      "object"
    ) {

      Object.keys(
        object
      ).forEach(
        function(key) {

          const value =
            object[key];


          const keyLower =
            key.toLowerCase();


          /* VIDEO */

          if (
            !result.video &&
            typeof value ===
              "string" &&
            (
              keyLower.includes(
                "video"
              ) ||
              keyLower.includes(
                "download"
              ) ||
              keyLower.includes(
                "nowatermark"
              ) ||
              keyLower.includes(
                "no_watermark"
              )
            ) &&
            isMediaUrl(value)
          ) {

            result.video =
              value;

          }


          /* AUDIO */

          if (
            !result.audio &&
            typeof value ===
              "string" &&
            (
              keyLower.includes(
                "audio"
              ) ||
              keyLower.includes(
                "mp3"
              ) ||
              keyLower.includes(
                "music"
              )
            ) &&
            isMediaUrl(value)
          ) {

            result.audio =
              value;

          }


          /* THUMBNAIL */

          if (
            !result.thumbnail &&
            typeof value ===
              "string" &&
            (
              keyLower.includes(
                "thumbnail"
              ) ||
              keyLower.includes(
                "cover"
              ) ||
              keyLower.includes(
                "image"
              )
            ) &&
            isImageUrl(value)
          ) {

            result.thumbnail =
              value;

          }


          /* TITLE */

          if (
            (
              keyLower ===
                "title" ||
              keyLower ===
                "desc" ||
              keyLower ===
                "description"
            ) &&
            typeof value ===
              "string"
          ) {

            result.title =
              value;

          }


          /* AUTHOR */

          if (
            (
              keyLower ===
                "author" ||
              keyLower ===
                "username" ||
              keyLower ===
                "nickname"
            ) &&
            typeof value ===
              "string"
          ) {

            result.author =
              value;

          }


          scan(value);

        }
      );

    }

  }


  scan(data);


  return result;

}


/* =========================================
   MEDIA URL
========================================= */

function isMediaUrl(
  value
) {

  if (
    typeof value !==
    "string"
  ) {

    return false;

  }


  return (
    value.startsWith(
      "http://"
    ) ||
    value.startsWith(
      "https://"
    )
  );

}


/* =========================================
   IMAGE URL
========================================= */

function isImageUrl(
  value
) {

  if (
    typeof value !==
    "string"
  ) {

    return false;

  }


  const lower =
    value.toLowerCase();


  return (
    lower.includes(
      ".jpg"
    ) ||
    lower.includes(
      ".jpeg"
    ) ||
    lower.includes(
      ".png"
    ) ||
    lower.includes(
      ".webp"
    ) ||
    lower.includes(
      "image"
    ) ||
    lower.includes(
      "cover"
    )
  );

}


/* =========================================
   SHOW TIKTOK RESULT
========================================= */

function showTikTokResult(
  data
) {

  const result =
    document.getElementById(
      "tiktokResult"
    );


  const thumbnail =
    document.getElementById(
      "tiktokThumbnail"
    );


  const title =
    document.getElementById(
      "tiktokTitle"
    );


  const author =
    document.getElementById(
      "tiktokAuthor"
    );


  const video =
    document.getElementById(
      "tiktokVideo"
    );


  const audio =
    document.getElementById(
      "tiktokAudio"
    );


  if (!result) {
    return;
  }


  /* TITLE */

  if (title) {

    title.innerText =
      data.title ||
      "TikTok Video";

  }


  /* AUTHOR */

  if (author) {

    if (data.author) {

      author.innerText =
        "@" +
        data.author;

    } else {

      author.innerText =
        "";

    }

  }


  /* THUMBNAIL */

  if (
    thumbnail &&
    data.thumbnail
  ) {

    thumbnail.src =
      data.thumbnail;

    thumbnail.style.display =
      "block";

  } else if (thumbnail) {

    thumbnail.style.display =
      "none";

  }


  /* VIDEO */

  if (
    video &&
    data.video
  ) {

    video.href =
      data.video;

    video.style.display =
      "block";

  } else if (video) {

    video.style.display =
      "none";

  }


  /* AUDIO */

  if (
    audio &&
    data.audio
  ) {

    audio.href =
      data.audio;

    audio.style.display =
      "block";

  } else if (audio) {

    audio.style.display =
      "none";

  }


  result.style.display =
    "block";

}


/* =========================================
   TIKTOK ERROR
========================================= */

function showTikTokError(
  message
) {

  const error =
    document.getElementById(
      "tiktokError"
    );


  const result =
    document.getElementById(
      "tiktokResult"
    );


  const loading =
    document.getElementById(
      "tiktokLoading"
    );


  if (loading) {

    loading.style.display =
      "none";

  }


  if (result) {

    result.style.display =
      "none";

  }


  if (error) {

    error.innerText =
      message;

    error.style.display =
      "block";

  } else {

    alert(
      message
    );

  }

}


/* =========================================
   CREATE BASE BOT
========================================= */

function createBaseBot() {

  if (
    typeof JSZip ===
    "undefined"
  ) {

    alert(
      "Library JSZip belum dimuat."
    );

    return;

  }


  const zip =
    new JSZip();


  const indexJS = `const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");

async function startBot() {

  const { state, saveCreds } =
    await useMultiFileAuthState("./session");

  const denn =
    makeWASocket({
      auth: state,
      logger: pino({
        level: "silent"
      }),
      printQRInTerminal: true
    });

  denn.ev.on(
    "creds.update",
    saveCreds
  );

  denn.ev.on(
    "connection.update",
    ({ connection, lastDisconnect }) => {

      if (connection === "open") {

        console.log(
          "Denn Bot berhasil terhubung."
        );

      }

      if (
        connection === "close"
      ) {

        const shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !==
          DisconnectReason.loggedOut;

        if (shouldReconnect) {
          startBot();
        }

      }

    }
  );

  denn.ev.on(
    "messages.upsert",
    async ({ messages }) => {

      const msg =
        messages[0];

      if (!msg.message) {
        return;
      }

      const body =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        "";

      if (body === ".menu") {

        await denn.sendMessage(
          msg.key.remoteJid,
          {
            text:
              "╭───「 DENN BOT 」\\n" +
              "│\\n" +
              "│ .menu\\n" +
              "│ .ping\\n" +
              "│ .owner\\n" +
              "│\\n" +
              "╰────────────"
          }
        );

      }

      if (body === ".ping") {

        await denn.sendMessage(
          msg.key.remoteJid,
          {
            text: "Pong!"
          }
        );

      }

    }
  );

}

startBot();
`;


  const caseJS = `module.exports = {

  ping: async function (denn, jid) {

    await denn.sendMessage(
      jid,
      {
        text: "Pong!"
      }
    );

  },

  menu: async function (denn, jid) {

    await denn.sendMessage(
      jid,
      {
        text:
          "╭───「 DENN BOT 」\\\\n" +
          "│\\\\n" +
          "│ .menu\\\\n" +
          "│ .ping\\\\n" +
          "│ .owner\\\\n" +
          "│\\\\n" +
          "╰────────────"
      }
    );

  }

};
`;


  const packageJSON = `{
  "name": "denn-base-bot",
  "version": "1.0.0",
  "description": "Denn Hosting Base WhatsApp Bot",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@whiskeysockets/baileys": "latest",
    "pino": "latest"
  }
}
`;


  const readme = `# Denn Hosting - Base Bot

## Installation

npm install

## Start

npm start

## Files

- index.js
- case.js
- package.json

Session bot:

./session

Jangan membagikan folder session.
`;


  zip.file(
    "denn-base-bot/index.js",
    indexJS
  );


  zip.file(
    "denn-base-bot/case.js",
    caseJS
  );


  zip.file(
    "denn-base-bot/package.json",
    packageJSON
  );


  zip.file(
    "denn-base-bot/README.md",
    readme
  );


  zip.generateAsync({
    type: "blob"
  })
  .then(
    function(blob) {

      const link =
        document.createElement(
          "a"
        );


      link.href =
        URL.createObjectURL(
          blob
        );


      link.download =
        "denn-base-bot.zip";


      link.click();


      URL.revokeObjectURL(
        link.href
      );


      const botResult =
        document.getElementById(
          "botResult"
        );


      if (botResult) {

        botResult.style.display =
          "block";

        botResult.innerHTML =
          "<span style='color:#48d391;font-size:12px;'>" +
          "✓ Base Bot berhasil dibuat." +
          "</span>";

      }

    }
  )
  .catch(
    function(error) {

      console.error(
        error
      );

      alert(
        "Gagal membuat Base Bot."
      );

    }
  );

}


/* =========================================
   REACTION MESSAGE
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    const reactionUrl =
      document.getElementById(
        "reactionUrl"
      );

    const reactionEmoji =
      document.getElementById(
        "reactionEmoji"
      );

    const reactionButton =
      document.getElementById(
        "reactionButton"
      );

    const reactionStatus =
      document.getElementById(
        "reactionStatus"
      );


    if (
      !reactionUrl ||
      !reactionEmoji ||
      !reactionButton ||
      !reactionStatus
    ) {

      return;

    }


    /* =====================================
       LIMIT
    ===================================== */

    function getLimitData() {

      const saved =
        localStorage.getItem(
          REACTION_LIMIT_KEY
        );


      if (!saved) {

        return null;

      }


      try {

        return JSON.parse(
          saved
        );

      } catch (error) {

        localStorage.removeItem(
          REACTION_LIMIT_KEY
        );

        return null;

      }

    }


    function isLimitActive() {

      const data =
        getLimitData();


      if (!data) {

        return false;

      }


      const elapsed =
        Date.now() -
        data.time;


      if (
        elapsed >=
        REACTION_LIMIT_TIME
      ) {

        localStorage.removeItem(
          REACTION_LIMIT_KEY
        );

        return false;

      }


      return true;

    }


    function updateReactionButton() {

      if (
        isLimitActive()
      ) {

        reactionButton.disabled =
          true;

        reactionButton.textContent =
          "Limit Sudah Digunakan";

      } else {

        reactionButton.disabled =
          false;

        reactionButton.textContent =
          "Kirim Sekarang";

      }

    }


    function showReactionStatus(
      message,
      type
    ) {

      reactionStatus.textContent =
        message;

      reactionStatus.className =
        "reaction-status show " +
        type;

    }


    updateReactionButton();


    /* =====================================
       SEND
    ===================================== */

    reactionButton.addEventListener(
      "click",
      async function() {

        if (
          isLimitActive()
        ) {

          showReactionStatus(
            "Limit harian sudah digunakan. Tunggu 24 jam.",
            "error"
          );

          return;

        }


        const url =
          reactionUrl.value.trim();


        const emoji =
          reactionEmoji.value.trim();


        /* URL */

        if (!url) {

          showReactionStatus(
            "Masukkan link pesan saluran terlebih dahulu.",
            "error"
          );

          reactionUrl.focus();

          return;

        }


        if (
          !url.includes(
            "whatsapp.com/channel/"
          )
        ) {

          showReactionStatus(
            "Link harus berupa link pesan WhatsApp Channel.",
            "error"
          );

          reactionUrl.focus();

          return;

        }


        /* EMOJI */

        if (!emoji) {

          showReactionStatus(
            "Masukkan emoji reaction terlebih dahulu.",
            "error"
          );

          reactionEmoji.focus();

          return;

        }


        /* LOADING */

        reactionButton.disabled =
          true;

        reactionButton.textContent =
          "Mengirim...";


        showReactionStatus(
          "Sedang mengirim reaction...",
          "success"
        );


        /* API */

        const apiUrl =
          REACTION_API +
          "?key=" +
          encodeURIComponent(
            REACTION_API_KEY
          ) +
          "&url=" +
          encodeURIComponent(
            url
          ) +
          "&reaction=" +
          encodeURIComponent(
            emoji
          );


        console.log(
          "Reaction API:",
          apiUrl
        );


        try {

          const response =
            await fetch(
              apiUrl,
              {
                method: "GET"
              }
            );


          if (!response.ok) {

            throw new Error(
              "HTTP " +
              response.status
            );

          }


          const data =
            await response.json();


          console.log(
            "Reaction Response:",
            data
          );


          /* API ERROR */

          if (
            data.success === false ||
            data.status === false ||
            data.error === true
          ) {

            throw new Error(
              data.message ||
              data.error ||
              "Reaction gagal dikirim."
            );

          }


          /* SUCCESS */

          localStorage.setItem(
            REACTION_LIMIT_KEY,
            JSON.stringify({
              time:
                Date.now()
            })
          );


          showReactionStatus(
            "✅ Reaction berhasil dikirim!",
            "success"
          );


          updateReactionButton();


        } catch (error) {

          console.error(
            "Reaction Error:",
            error
          );


          if (
            error.message ===
            "Failed to fetch"
          ) {

            showReactionStatus(
              "❌ Failed to fetch. API tidak mengizinkan request langsung dari browser (CORS).",
              "error"
            );

          } else {

            showReactionStatus(
              "❌ " +
              (
                error.message ||
                "Gagal mengirim reaction."
              ),
              "error"
            );

          }


          reactionButton.disabled =
            false;

          reactionButton.textContent =
            "Kirim Sekarang";

        }

      }
    );

  }
);