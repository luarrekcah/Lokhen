/*
 * Script by Luar Rekcah
 *
 * Follow me on Twitter: @_luarrekcah
 *
 * website: https://luarrekcah.glitch.me
 */

//Constantes ===>
const twit = require("twit");
const randomItem = require("random-item");
const schedule = require("node-schedule");
const express = require("express");
const app = express();
const http = require("http");
const superagent = require("superagent");
const fs = require("fs");
const request = require("request");
const crypto = require("crypto");
//<=== Constantes

//Sistema de ping ===>
app.get("/", (request, response) => {
  response.sendStatus(200);
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(
    `Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`
  );
});
app.listen(process.env.PORT);
//<=== Sistema de ping

//Configurações para login ===>
const configTwit = {
  consumer_key: process.env.apiKey,
  consumer_secret: process.env.apiSecretKey,
  access_token: process.env.acessToken,
  access_token_secret: process.env.acessTokenSecret
};
//<=== Configurações para login

//Configurações Tweets ===>
const config = {
  intervals: {
    neko: 1000 * 10 //10 segundos
  }
};
//<=== Configurações Tweets

//Erros ===>
process.on("UnhandledPromiseRejectionWarning", () => {
  process.exit(1);
});
//<=== Erros

//Iniciar ===>
var twt = new twit(configTwit);
console.log("Online");
//<=== Iniciar

// Restante do script
/*
twt.post(
  "statuses/update",
  {
    status: "tst"
  },
  function(err, data, response) {
    console.log(data);
  }
);
*/

async function twtRandomNeko() {
  const id = crypto.randomBytes(16).toString("hex");
  const arq = `./images/neko${id}.jpg`;

  const body = await superagent.get("https://nekos.life/api/neko");
  //const imgLink = body.neko;
  const imgLink = "https://cdn.nekos.life/neko/neko_093.jpg";
  console.log(imgLink); //Ok, link certinho da imagem

  var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
      console.log("content-type:", res.headers["content-type"]);
      console.log("content-length:", res.headers["content-length"]);

      request(uri)
        .pipe(fs.createWriteStream(filename))
        .on("close", callback);
    });
  };

  await download(imgLink,"./images/neko.jpg", function() {
    console.log("done");
  });

  try {
    var b64content = await fs.readFileSync("./images/neko.jpg", {
      encoding: "base64"
    });
  } catch (e) {
    console.log(e);
  }

  twt.post("media/upload", { media_data: b64content }, function(
    err,
    data,
    response
  ) {
    console.log(data);
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string;
    var altText = "Imagem neko";
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

    twt.post("media/metadata/create", meta_params, function(
      err,
      data,
      response
    ) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        var params = { status: "Neko ^-^", media_ids: [mediaIdStr] };

        twt.post("statuses/update", params, function(err, data, response) {
          console.log(data);
        });
        fs.unlinkSync(arq);
      } else {
        console.log(err);
      }
    });
  });
}
twtRandomNeko();

//Random neko
setInterval(() => {
  //twtRandomNeko();
}, config.intervals.neko);

/*
twt.post(
  "statuses/update",
  {
    status: "tst"
  },
  function(err, data, response) {
    console.log(data);
  }
);
*/
/*
const arr = [
  "teste / 12:30"
];

var j = schedule.scheduleJob(
  { hour: 12, minute: 30 , dayOfWeek: 0  },
  function() {
    twt.post(
      "statuses/update",
      {
        status: randomItem(arr)
      },
      function(err, data, response) {
        console.log(data);
      }
    );
  }
);
*/
