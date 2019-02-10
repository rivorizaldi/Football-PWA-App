const base_url = "http://api.football-data.org/";
const X_AUTH_TOKEN = "604533069dc34fd29df822c26c1c405e";
const standingFilter = "v2/competitions/2001/standings?standingType=TOTAL";
const matchFilter = "v2/competitions/2001/matches?status=SCHEDULED";
const scorerFilter = "v2/competitions/2001/scorers?limit=6";

var dbPromise = idb.open("favorite-player", 1, function(db) {
  if (!db.objectStoreNames.contains("player"))
    db.createObjectStore("player", { keyPath: "dataPlayer" });
});

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log(error);
}

function getWIBDate(fdate) {
  let date = new Date(fdate);
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  let formatedDate = new Intl.DateTimeFormat("en-GB", options).format(date);
  return formatedDate;
}

function getWIBTime(time) {
  let date = new Date(time);
  let options = { hour: "numeric", minute: "numeric" };
  let formatedTime = new Intl.DateTimeFormat("id", options).format(date);

  let fdate = formatedTime.substr(0, 2);
  let dateInt = parseInt(fdate);

  if (dateInt < 12) {
    return formatedTime + " AM";
  } else {
    return formatedTime + " PM";
  }
}

function httpsFormated(url) {
  return url.replace(/^http:\/\//i, "https://");
}

function getStandingData() {
  fetch(base_url + standingFilter, {
    headers: {
      "X-Auth-Token": X_AUTH_TOKEN
    }
  })
    .then(status)
    .then(json)
    .then(function(data) {
      var standingsHTML = "<h3><center>Standings</center></h3>";
      data.standings.forEach(function(groups) {
        standingsHTML += `
                  <h6>${groups.group}</h6>
                  <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Club</th>
                      <th>MP</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>GF</th>
                      <th>GA</th>
                      <th>GD</th>
                      <th>Pts</th>
                    </tr>
                  </thead>
              `;
        groups.table.forEach(function(group) {
          standingsHTML += `
                  <tbody>
                    <tr>
                      <td>${group.position}</td>
                      `;
          if (group.team.name == "Club Brugge KV") {
            standingsHTML += `
            <td><img width="24px" height="24px" src="https://upload.wikimedia.org/wikipedia/commons/5/5d/Logo_FC_Red_Star_Belgrade.svg" alt="" />${
              group.team.name
            }</td>`;
          } else if (group.team.name == "FK Crvena Zvezda") {
            standingsHTML += `
            <td><img width="24px" height="24px" src="https://upload.wikimedia.org/wikipedia/commons/5/5d/Logo_FC_Red_Star_Belgrade.svg" alt="" />${
              group.team.name
            }</td>`;
          } else if (group.team.name == "FK Lokomotiv Moskva") {
            standingsHTML += `
            <td><img width="24px" height="24px" src="https://upload.wikimedia.org/wikipedia/en/9/95/FC_Lokomotiv_Moscow.png" alt="" />${
              group.team.name
            }</td>`;
          } else if (group.team.name == "Sport Lisboa e Benfica") {
            standingsHTML += `
            <td><img width="24px" height="24px" src="https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg" alt="" />${
              group.team.name
            }</td>`;
          } else if (group.team.name == "PAE AEK") {
            standingsHTML += `
            <td><img width="24px" height="24px" src="https://upload.wikimedia.org/wikipedia/en/0/04/AEK_Athens_FC_logo.svg" alt="" />${
              group.team.name
            }</td>`;
          } else if (group.team.name == "FK Shakhtar Donetsk") {
            standingsHTML += `
            <td><img width="24px" height="24px" src="https://upload.wikimedia.org/wikipedia/en/a/a1/FC_Shakhtar_Donetsk.svg" alt="" />${
              group.team.name
            }</td>`;
          } else if (group.team.name == "FC Viktoria Plzeň") {
            standingsHTML += `
            <td><img width="24px" height="24px" src="https://upload.wikimedia.org/wikipedia/en/d/dc/Znak_Viktoria_Plzen.png" alt="" />${
              group.team.name
            }</td>`;
          } else if (group.team.name == "PFC CSKA Moskva") {
            standingsHTML += `
            <td><img width="24px" height="24px" src="https://upload.wikimedia.org/wikipedia/en/2/26/PFK_CSKA_Logo.svg" alt="" />${
              group.team.name
            }</td>`;
          } else if (group.team.name == "BSC Young Boys") {
            standingsHTML += `
            <td><img width="24px" height="24px" src="https://upload.wikimedia.org/wikipedia/en/6/6b/BSC_Young_Boys_logo.svg" alt="" />${
              group.team.name
            }</td>`;
          } else {
            standingsHTML += `
                      <td><img width="24px" height="24px" src="${httpsFormated(
                        group.team.crestUrl
                      )}" alt="" />${group.team.name}</td>`;
          }
          standingsHTML += `       
                      <td>${group.playedGames}</td>
                      <td>${group.won}</td>
                      <td>${group.draw}</td>
                      <td>${group.lost}</td>
                      <td>${group.goalsFor}</td>
                      <td>${group.goalsAgainst}</td>
                      <td>${group.goalDifference}</td>
                      <td>${group.points}</td>
                    </tr>
                  </tbody>
               
                `;
        });
        standingsHTML += " </table>";
      });
      document.getElementById("standing-data").innerHTML = standingsHTML;
    })
    .catch(error);
}

function getScheduleData() {
  fetch(base_url + matchFilter, {
    headers: {
      "X-Auth-Token": X_AUTH_TOKEN
    }
  })
    .then(status)
    .then(json)
    .then(function(data) {
      var matchHTML = `<h4 class="center">${data.competition.name}</h4>
      <button id="notification-button" class="waves-effect waves-light btn"><i class="material-icons right">notifications</i>Notify Me!</button></div></li>
      `;
      data.matches.forEach(function(match) {
        matchHTML += `
        <ul class="collection with-header">
        <li class="collection-header center"><h6>${getWIBDate(
          match.utcDate
        )}</h6></li>
        <li class="collection-item center">${
          match.homeTeam.name
        } <span class="fdate">${getWIBTime(match.utcDate)}</span> ${
          match.awayTeam.name
        }<div>
        </ul>
        `;
      });
      document.getElementById("schedule-data").innerHTML = matchHTML;
    })
    .then(function() {
      enableNotificationTrigger("notification-button");
    })
    .catch(error);
}

function getScorerData() {
  fetch(base_url + scorerFilter, {
    headers: {
      "X-Auth-Token": X_AUTH_TOKEN
    }
  })
    .then(status)
    .then(json)
    .then(function(data) {
      var scorerHTML = `
        <h4 class="center">Top Scorer</h4>
        <div class="col s12 m12 l12"><a href="/favorite" class="waves-effect waves-light btn-small">See Favorite</a></div>
      `;
      data.scorers.forEach(function(player) {
        scorerHTML += `
        <div class = "col s12 m6 l4">
          <div class="card">
            <div class ="card-image">  `;
        if (player.player.name == "Dušan Tadić") {
          scorerHTML += `<img height ="400px" src = "https://upload.wikimedia.org/wikipedia/commons/6/67/Du%C5%A1an_Tadi%C4%87_%28cropped%29.jpg">`;
        } else if (player.player.name == "Robert Lewandowski") {
          scorerHTML += `<img height ="400px" src = "https://upload.wikimedia.org/wikipedia/commons/c/c2/JAP-POL_%286%29_%28cropped%29_%28cropped%29.jpg">`;
        } else if (player.player.name == "El Fardou Ben Nabouhane") {
          scorerHTML += `<img height ="400px" src = "https://upload.wikimedia.org/wikipedia/commons/f/fb/El_Fardou_Ben_Nabouhane.jpg">`;
        } else if (player.player.name == "Lionel Messi") {
          scorerHTML += `<img height ="400px" src = "https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg">`;
        } else if (player.player.name == "Besart Ibraimi") {
          scorerHTML += `<img height ="400px" src = "https://upload.wikimedia.org/wikipedia/commons/6/6c/FC_Salzburg_gegen_KF_Shk%C3%ABndija_Tetovo_%28Besart_Ibraimi%29.jpg">`;
        } else if (player.player.name == "Guillaume Hoarau") {
          scorerHTML += `<img height ="400px" src = "https://upload.wikimedia.org/wikipedia/commons/b/b0/YB_vs._FCL_-_Hoarau_8.jpg">`;
        }
        scorerHTML += `<span class="card-title yellow-text ">${
          player.player.name
        }</span>
              <button data-player-name="${player.player.name}" data-team-name=${
          player.team.name
        } data-goals=${
          player.numberOfGoals
        } class= "saveFavorite btn-floating halfway-fab waves-effect waves-light green"><i class = "material-icons">favorite_border</i></button>
            </div>
            <div class = "card-content">
              <p>${player.team.name}</p>
              <p>Number Of Goals ${player.numberOfGoals}</p>
            </div>
          </div>
        </div>
        `;
      });
      document.getElementById("scorer-data").innerHTML = scorerHTML;
    })
    .then(function() {
      const saveFavorite = document.querySelectorAll(".saveFavorite");

      saveFavorite.forEach(function(save) {
        save.addEventListener("click", function(event) {
          let dataDB = {
            dataPlayer: this.dataset.playerName,
            dataTeam: this.dataset.teamName,
            dataGoals: this.dataset.goals
          };
          dbPromise.then(function(db) {
            var tx = db.transaction("player", "readwrite");
            var store = tx.objectStore("player");
            store.add(dataDB);
            return tx.complete;
          });
          M.toast({
            html: "Saved to Favorite!",
            displayLength: 1000,
            outDuration: 300
          });
        });
      });
    })
    .catch(error);
}
