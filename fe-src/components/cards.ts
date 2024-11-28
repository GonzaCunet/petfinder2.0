export class CardsInit extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.render();
  }
  render() {
    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    const cardsEl = document.createElement("div");
    const name = this.getAttribute("name");
    const location = this.getAttribute("location");
    const photoURL = this.getAttribute("photoURL");
    const buttonColor = this.getAttribute("buttonColor");
    const buttonText = this.getAttribute("buttonText");
    cardsEl.className = "root";
    style.innerHTML = /*css*/ `
    .root{
        Width:335px;
        Height:274px;
        display:flex;
        flex-direction:column;
        background-color:#26302E;
        border-line:solid;
        border-radius: 5px;
        }

    .img-container{
      padding:8px;
    }
    .img{
        width: 100%;
        height: auto;
        max-width:320px;
        max-Height:136px;
        object-fit: cover;
        border-radius: 5px;
    }
    .textandbuttoncontainer{
    display:flex;
    flex-direction:row;
    justify-content: space-between;
    margin:10px;
    
    }
    .textcont{
    width: 200px;
    height:100px;
    display:flex;
    flex-direction:column;
    align-items:left;
    overflow: auto;
    gap:5px;
    justify-content: space-between;
    
    
    }
    h1{
      margin:0;
      font-size:30px;
      color:white;
      text-wrap: balance;
    }
    h2{
    margin:0;
    font-size:16px;
    color:white;
    text-wrap: balance;
  }

    .button{
    width:120px;
    height: 40px;
    background-color: ${buttonColor};
    color:white;
    border-style:none;
    border-radius: 5px;
    font-size: 16px;
}
  `;

    cardsEl.innerHTML = /*html*/ `
    <div class="img-container"><img class="img"src="${photoURL}"></div>
      <div class="textandbuttoncontainer">
        <div class="textcont">
          <h1>${name}</h1> 
          <h2>${location}</h2>
        </div>
        <div class="buttoncont">
          <button class="button" buttonColor="#EB6372">${buttonText}</button>
        </div>
    </div>`;
    shadow.appendChild(cardsEl);
    shadow.appendChild(style);
  }
}
customElements.define("cards-el", CardsInit);
