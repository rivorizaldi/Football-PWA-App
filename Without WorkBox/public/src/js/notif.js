function enableNotificationTrigger(idEl) {
  var enableNotification = document.getElementById(idEl);
  if ("Notification" in window) {
    enableNotification.addEventListener("click", function() {
      Notification.requestPermission(function(result) {
        console.log("User choice", result);
        if (result !== "granted") {
          console.log("No Notification permission granted!");
        } else {
          if (!("serviceWorker" in navigator)) {
            return;
          }
          if ("PushManager" in window) {
            navigator.serviceWorker.getRegistration().then(function(reg) {
              reg.pushManager
                .subscribe({
                  userVisibleOnly: true
                })
                .then(function(sub) {
                  console.log(
                    "Berhasil melakukan subscribe dengan endpoint: ",
                    sub.endpoint
                  );
                  console.log(
                    "Berhasil melakukan subscribe dengan p256dh key: ",
                    btoa(
                      String.fromCharCode.apply(
                        null,
                        new Uint8Array(sub.getKey("p256dh"))
                      )
                    )
                  );
                  console.log(
                    "Berhasil melakukan subscribe dengan auth key: ",
                    btoa(
                      String.fromCharCode.apply(
                        null,
                        new Uint8Array(sub.getKey("auth"))
                      )
                    )
                  );
                })
                .catch(function(e) {
                  console.error("Tidak dapat melakukan subscribe ", e);
                });
            });
          }
          M.toast({
            html: "You'll be Notified!",
            displayLength: 1000,
            outDuration: 300
          });
        }
      });
    });
  }
}
