var webPush = require("web-push");

var pushSubscription = {
  endpoint:
    "https://android.googleapis.com/gcm/send/fmT2rizNAwo:APA91bFgveiEGI8RU8Ny7nDVPWhbReKvwApsihZ8HlA_uWAv5w4QO7kzl0tpsEPLyMB-O9qjRR72ZZR3H0Z2oLoqELueTso_G-mrIlS_ES_NBTSV2EGJVf49hYBifQqZeuTvEDRdwWBX",
  keys: {
    p256dh:
      "BHO2is4++/X0NegocV1CoAjMKB9IdbVYlCMCZ+aN4I46Jpk+BNSNSU8kXZuoIYe2Mh0MvzqIbVUFoIU/Her3leE=",
    auth: "SI27K1nL6hdHiqKuHiYWPQ=="
  }
};

var payload = "You Have Subscribed!";

var options = {
  gcmAPIKey: "AIzaSyBFBMI7c66cFXdS5Lf5MpiaY2YEG-3gHC8",
  TTL: 60
};

webPush.sendNotification(pushSubscription, payload, options);
