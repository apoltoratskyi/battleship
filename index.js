//import myJson from './battleship-1.json' assert {type: 'json'};
// import json files does not work in FF

window.onload = async function getJson() {
  let board = document.getElementById('board');
  let counter = 0;
  let myJson = await fetch("./battleship-1.json");
  myJson = await myJson.text();
  myJson = JSON.parse(myJson);

  calculateShipPosition(myJson.ships);
  buildBoard();
  board.addEventListener('click', shoot)

  // implement actions on the board
  function shoot(e) {
    counter++

    // 20 missiles available:
    if(counter < 20) {
      let cellId = parseInt(e.target.id);
      //console.log(e.target);

      // find ship by its position
      let shipFound = myJson.ships.find(({positions}) => positions.includes(cellId))
      if (shipFound) {
        // decrement ship size only when new cell clicked that does not contain class "hit":
        if (shipFound.size && !e.target.classList.contains("hit")) {
          e.target.classList.add("hit");
          shipFound.size--
        }
        // if ship size === 0 then assign class "sunk" to all ship positions
        if (!shipFound.size) {
          shipFound.positions.forEach((position) => {
            board.childNodes[position].classList.add("sunk");
          })
        }
      } else {
        if(e.target.id !== "board"){
          e.target.classList.add("miss");
        }
      }

      // check if all ships where sunk
      win(myJson.ships);

    } else {
      revealShips(myJson.ships, board);
      e.stopPropagation()
      alert("You are out of missiles")
    }
  }

  // create 36 div elements
  function buildBoard() {
    for(let i=1; i<=36; i++) {
      board.insertAdjacentHTML('beforeend', '<div id=' + i + '></div>');
    }
  }

  // add 'position' property to ship object
  function calculateShipPosition(ships) {
    ships.forEach((ship, index)=>{
      ship.positions = [];
      // convert ship coordinates to position in range 1-36.
      if (ship.orientation === 'vertical') {
        for (let size = 0; size < ship.size; size++) {
          let next = size * 6;
          ship.positions.push(((ship.coords[1] - 1) * 6 + ship.coords[0]) + next);
        }
      } else if (ship.orientation === 'horizontal') {
        for (let size = 0; size < ship.size; size++) {
          ship.positions.push(((ship.coords[1] - 1) * 6 + ship.coords[0]) + size);
        }
      }
    })
  }

  // check if size of all ships  === 0 and end the game
  function win(ships) {
    let oneSize = 0;
    ships.forEach((ship)=>{
      oneSize += ship.size;
    })
    if (oneSize === 0) {
      document.write("<br><p>YOU WIN</p>");
    }
  }

  // show all ships if the game is over
  function revealShips(ships, board) {
    ships.forEach(ship =>{
      ship.positions.forEach(position => {
        board.childNodes[position].classList.add("reveal");
      })
    })
  }
}
