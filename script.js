(function() {

    const urlBase64ToUint8Array = (base64String) => {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
  
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
  
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
  
    if ("serviceWorker" in navigator) {//provera da li je sw u navigatoru
      navigator.serviceWorker
        .register("sw.js", { scope: "." })
        .then((register) => {
          console.log("service worker registered");
          if ("Notification" in window) {//da li nas browser implentira notifikacije
            Notification.requestPermission((result) => {//trazimo permisiju od korisnika
              if (result === "granted") {//ako je odlucio da nam veruje i dao nam je odobrenje za notifikacije
                console.log("Acess granted! :)");//dobili smo odobrenje
                register.pushManager.subscribe({//registracija na push servis. vapid key je identifikacioni parametar za frontend koji treba da primi notifikaciju
                  userVisibleOnly: true,//samo nas korisnik viidi notifikacije
                  applicationServerKey: urlBase64ToUint8Array('BApYkfnj5xPxO4Ed_lGMUlzCDDS-0Yw6M6uUQOFLdYCTrBRxMJWOPY1AXZFJ_dfNiys2kaVfwI1YFSs0fXBpZhg')
                }).then(subscription => {//konvertuje ga u key koji prima server.Nakon uspesnog prijavljivana
                  fetch("http://localhost:5000/subscribe", {//saljemo mu fetch,dajemo mo mu url do servera
                    method: "POST",
                    body: JSON.stringify(subscription),//mora da bude string
                    headers: {
                      "content-type": "application/json"//oznacavaju da komuniciramo jsonom
                    }
                  });
                });
  
              
              } else if (result === "denied") {
                console.log("Access denied :(");
              } else {
                console.log("Request ignored :/");
              }
            });
          }
        })
        .catch((err) => console.log("service worker not registered", err));
    }
  
    const cardHTML = `\
  <div class="col">
      <div class="card" style="width: 18rem;">
          <img
          class="card-img-top"
          src="%link-slika%"
          />
          <div class="card-body">
              <h5 class="card-title">%naziv%</h5>
              <p class="card-text">
              %opis%
              </p>
              <hr>
              <a href="%link-slika%" target="_blank" class="btn btn-primary">Otvori sliku</a>
          </div>
      </div>
  </div>`;
  
    function getInputs() {
      return {
        opis: document.querySelector("#opis"),
        naslov: document.querySelector("#naziv"),
        slika: document.querySelector("#link-slika")
      };
    }
  
    function resetInputs() {
      let inputs = getInputs();
      for (let key in inputs) inputs[key].value = "";
    }
  
    function addToDOM(data) {
      let container = document.querySelector("#container-cards");
      let card = cardHTML.replace("%link-slika%", data.slika.value);
      card = card.replace("%link-slika%", data.slika.value);
      card = card.replace("%opis%", data.opis.value);
      card = card.replace("%naziv%", data.naslov.value);
      container.insertAdjacentHTML("beforeend", card);
    }
  
    let btnSacuvaj = document.querySelector("#sacuvaj");
    btnSacuvaj.addEventListener("click", function() {
      let inputs = getInputs();
      if (
        inputs.opis.value.length > 0 &&
        inputs.slika.value.length > 0 &&
        inputs.naslov.value.length > 0
      )
        addToDOM(inputs);
  
      resetInputs();
    });
  
    document.querySelector("#odbaci").addEventListener("click", resetInputs);
  })();
  