import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();

    // const box = document.createElement("div");
    // box.classList.add("box");
    // box.innerHTML = this._render({
    //   name: "Placeholder",
    //   terrain: "placeholder",
    //   population: 0,
    // });

    // document.body.querySelector(".main").appendChild(box);

    this._loading = document.getElementsByClassName("progress is-small is-primary");

    this.on(Application.events.READY, this._load)
    this.emit(Application.events.READY);
    
  }

  _render({ name, terrain, population }) {
    return `
      <article class="media">
        <div class="media-left">
          <figure class="image is-64x64">
            <img src="${image}" alt="planet">
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
          <h4>${name}</h4>
            <p>
              <span class="tag">${terrain}</span> <span class="tag">${population}</span>
              <br>
            </p>
          </div>
        </div>
      </article>
    `;
  }
  async _load() {
    this._startLoading();
    let response = await fetch("https://swapi.boom.dev/api/planets");
    let data = await response.json();

    while (data.next) {
      response = await fetch(data.next);
      data = await response.json();
      for (let planet of data.results) {

        const box = document.createElement("div");
          box.classList.add("box");
          box.innerHTML = this._render({
            name: planet.name,
            terrain: planet.terrain,
            population: planet.population,
          });
        document.body.querySelector(".main").appendChild(box);
        // let HTMLBlock = _create(planet);
        // document.appendChild(HTMLBlock);
      }
    }

    this._stopLoading();
  }

  _startLoading() {
    this._loading[0].style.display = "block";
  }
  _stopLoading() {
    this._loading[0].style.display = "none";
  }
}

// import EventEmitter from "eventemitter3";

// export default class Application extends EventEmitter {
//   _loading;
//   static get events() {
//     return {
//       READY: "ready",
//     };
//   }

//   constructor() {
//     super();
//     this.createProgress();
//     this._load();
//     this.emit(Application.events.READY);
//   }

//   createProgress() {
//     this._loading = document.createElement("progress");
//     this._loading.innerHTML = `<progress id="file" value="0" max="100"> Loading... </progress>`
//     document.appendChild(this._loading);
//   }

//   async _load() {
//     this._startLoading();
//     let response = await fetch("https://swapi.boom.dev/api/planets");
//     let data = await response.json();

//     while (data.next) {
//       response = await fetch(data.next);
//       data = await response.json();
//       for (let planet of data.results) {
//         let HTMLBlock = _create(planet);
//         document.appendChild(HTMLBlock);
//       }
//     }

//     _stopLoading();
//   }
  
//   _create(HTMLBlock) {
//     return `
//     <div>
//       <h1${HTMLBlock.name}</h1>
//       <p>Climate: ${HTMLBlock.climate}</p>
//       <p>Terrain: ${HTMLBlock.terrain}</p>
//       <p>Population: ${HTMLBlock.population}</p>
//     </div>`
//   }
//   _startLoading() {
//     this._progress.style.display = "block";
//   }
//   _stopLoading() {
//     this._progress.style.display = "none";
//   }
// }