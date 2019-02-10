document.addEventListener("DOMContentLoaded", function() {
  const elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();

  var page = window.location.hash.substr(1);
  if (page == "") page = "standings";
  loadPage(page);

  function loadNav() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status !== 200) return;

        document.querySelectorAll(".sidenav").forEach(function(elem) {
          elem.innerHTML = xhttp.responseText;
        });

        document.querySelectorAll(".sidenav a").forEach(function(elem) {
          elem.addEventListener("click", function(event) {
            const sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();

            page = event.target.getAttribute("href").substr(1);
            if (page == "standings") {
              loadPage(page);
              getStandingData();
            } else if (page == "schedule") {
              loadPage(page);
              getScheduleData();
            } else {
              loadPage(page);
              getScorerData();
            }
          });
        });
      }
    };
    xhttp.open("GET", "/nav.html", true);
    xhttp.send();
  }

  function loadPage(page) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        var content = document.querySelector("#body-content");
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
        } else if (this.status == 404) {
          content.innerHTML = "<p>Page Not Found<p/>";
        } else {
          content.innerHTML = "<p>Oops.. The Page can't be accessed</p>";
        }
      }
    };
    xhttp.open("GET", `pages/${page}.html`, true);
    xhttp.send();
  }
});
