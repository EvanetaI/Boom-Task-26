import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  _loading;
  
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();
   
    this._loading = document.getElementsByClassName("progress");
    
    this.on(Application.events.READY, this._load);
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
        this._create(planet);
      }
    }

    this._stopLoading();
  }

  _create(data) {
    const box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = this._render({
      name: data.name,
      terrain: data.terrain,
      population: data.population,
    });
    document.body.querySelector(".main").appendChild(box);
  }

  _startLoading() {
    this._loading[0].style.display = "block";
  }
  _stopLoading() {
    this._loading[0].style.display = "none";
  }
}
