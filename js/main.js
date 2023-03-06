// creo i collegamenti al DOM
const score = document.getElementById("score");
const gridLevelSelect = document.getElementById("gridLevel");
const gridContainerDom = document.getElementById("grid-container");
let gameOver;

const generateGridBtn = document.getElementById("generateGrid");
// genero al click il campo minato
generateGridBtn.addEventListener('click',
    function(){
        // reset eventuale vecchia griglia e score
        gridContainerDom.innerHTML = "";
        score.innerHTML = 0;
        gameOver = false;

        // il value avrà valore (Easy:10/Hard:9/Crazy:7) ossia elementi per riga/colonna
        let gridLevel = parseInt(gridLevelSelect.value);

        // invoco la funzione per creare la griglia e la inserisco nel contenitore
        gridContainerDom.append(generateGrid(Math.pow(gridLevel,2),gridLevel,gridLevel));
    }
)


// funzione che genera la griglia
function generateGrid (totalSquares,rows,cols){
    // creo la griglia da inserire
    const grid = document.createElement('div');
    grid.id = "grid";

    // genero la lista dei numeri che saranno mine
    let minesList = createMinesList(totalSquares);

    for (let i=1; i<=totalSquares; i++){
        // invoco la funzione per generare il quadrato
        const square = generateSquare(rows,cols);

        square.append(generateSquareText(i));

        // aggiungo la classe mina
        if (minesList.includes(i)){
        square.classList.add('mine');
        };

        // aggiungo un eventListener al quadrato
        square.addEventListener('click',
            function(){
                // procedo solo se il quadrato non è stato rivelato
                if (!this.classList.contains('revealed') && !gameOver ){
                    this.classList.add('revealed');

                    if (this.classList.contains('mine')){
                        // il quadratino è una mina: gameOver
                        gameOver = true;
                        score.innerHTML += "<br>GAME OVER"
                        // scopro tutte le mine 
                        for ( i=1; i<=totalSquares; i++){
                            let selectedSquare = document.querySelector(`.square:nth-of-type(${i})`);
                            if (selectedSquare.classList.contains('mine')){
                                selectedSquare.classList.add("revealed");
                            }
                        };
                    } else {
                        let scoreInt = parseInt(score.innerHTML);
                        // aggiungo +1 al punteggio
                        score.innerHTML = ++scoreInt;
                        // verifico se ho cliccato su tutti i quadratini corretti
                        if (scoreInt == (totalSquares - 16)){
                            gameOver = true;
                            score.innerHTML += "<br>WINNER"
                        }
                    }
                }
            }
        )
        // aggiungo lo square alla griglia
        grid.append(square);
    }
    return grid;
}

// funzione che genera il quadrato
function generateSquare (squarePerRow,squarePerColumn){
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.height = `${100 / squarePerColumn}%`;
    square.style.width = `${100 / squarePerRow}%`;
    return square;
}

// funzione che genera il contenuto del quadrato
function generateSquareText (text){
    squareText = document.createElement('span');
    squareText.classList.add("square-text");
    squareText.innerHTML = text;
    return squareText;
}

// funziona che crea la lista di numeri che saranno mine
function createMinesList(totalSquares){
    // creo una lista di numeri disponibili
    let numbersList = [];
    for (i=1; i<=totalSquares; i++){
        numbersList.push(i);
    }
    // pesco 16 volte dalla lista
    let minesList = [];
    for (i=0; i<16; i++){
        // punto a una posizione a caso della lista
        let randomIndex = Math.floor(Math.random()*numbersList.length);
        // pesco l'elemento in quella posizione
        let randomPick = numbersList[randomIndex];
        // lo aggiungo alla lista dei numeri delle mine
        minesList.push(randomPick);
        // elimino l'elemento dalle possibili prossime pescate
        numbersList.splice(randomIndex,1);
    }

    return minesList;
}