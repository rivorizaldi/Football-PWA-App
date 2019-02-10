var webPush = require("web-push");

var pushSubscription = {
  endpoint:
    "YOUR_ENDPOINT",
  keys: {
    p256dh:
      "YOUR_P256DH",
    auth: "YOUR_AUTH_KEY"
  }
};

var payload = "You Have Subscribed!";

var options = {
  gcmAPIKey: "YOUR_LEGACY_KEY(FROM FIREBASE)",
  TTL: 60
};

webPush.sendNotification(pushSubscription, payload, options);
