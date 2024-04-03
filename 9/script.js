document.addEventListener('click', function (evt) {
    if (evt.target.nodeName.toLowerCase() === 'div') {
        processButtonClick(evt.target);
    }
});

document.addEventListener('contextmenu', function (evt) {
    if (evt.target.nodeName.toLowerCase() === 'div') {
        evt.preventDefault();
        processButtonClickRight(evt.target);
    }
});

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function obj() {
    var self = this;
    this.positionId;
    this.bomb = false;
    this.open = false;
    this.iThink = false;
    this.elem = null;
    this.create = function (a, b) {
        var newDIV = document.createElement("div");
        var newP = document.createElement("p");
        newDIV.classList.add("cell");
        newDIV.id = "m" + a + "." + b;
        var table = document.getElementById('table');
        table.appendChild(newDIV);
        if ((b + 1) % (height + 1) === 0) {
            table.appendChild(document.createElement("br"));
        }
        self.elem = newDIV;
    };
}


function matrix() {
    var matrix = [];
    for (var i = 0; i <= width; i++) {
        matrix[i] = [];
        for (var j = 0; j <= height; j++) {
            matrix[i][j] = new obj();
            matrix[i][j].create(i, j);
        }
    }
    return matrix;
}

function processButtonClick(element) {
    element.classList.add("near");
	var takeIJs = element.id.slice(1,element.id.length).split(".");
	var i = +takeIJs[0];
    var j = +takeIJs[1];
	if (bombMatrix[i][j].iThink){
		bombMatrix[i][j].iThink = false;
		element.classList.remove("flag");
	}
    if (bombMatrix[i][j].bomb) {
        element.classList.add("bomb");
        alert("GAME OVER");
        reload();
    } else {
        if (bombAround(i, j) === 0) {
            element.classList.add("empty");
            var nearestCells = getSurroundCells(i, j);
            nearestCells.forEach(openCell);
        }
        element.innerHTML = "<p>" + bombAround(i, j) + "</p>";
    }
    bombMatrix[i][j].open = true;
}


function openCell(item) {
    if (!item.open) {
        item.elem.click();
    }
}

function processButtonClickRight(element) {
    var takeIJs = element.id.slice(1,element.id.length).split(".");
	var i = +takeIJs[0];
    var j = +takeIJs[1];
    if (!bombMatrix[i][j].open) {
        if (!bombMatrix[i][j].iThink) {
            bombMatrix[i][j].iThink = true;
            element.classList.add("flag");
        } else {
            bombMatrix[i][j].iThink = false;
            element.classList.remove("flag");
        }
    }
    if (isBombPositionTrue()) {
        alert('YOU WIN');
        reload();
    }
}

function bombPosition() {
    for (var b = 0; b < bomb; b++) {
        function bombOne() {
            var i = random(0, height);
            var j = random(0, width);
            if (bombMatrix[i][j].bomb) {
                bombOne();
            } else {
                bombMatrix[i][j].bomb = true;
            }
        }
        bombOne();
    }
}


function isBombPositionTrue() {
    var arr = bombMatrix.reduce(function (a, b) {
        return a.concat(b);
    });
	var sumBombFlaf = arr.filter(function(a){
	return a.iThink;
	});
	if(bomb === sumBombFlaf.length){ 
		var bombArr = arr.filter(function (a) {
			return a.bomb;
		});
		return bombArr.every(function (a) {
			return a.bomb === a.iThink;
		});
	}
}

function getSurroundCells(i, j) {
    var arr = [];
    for (var a = i - 1; a <= i + 1; a++) {
        for (var b = j - 1; b <= j + 1; b++) {
            if (a >= 0 && a <= width && b >= 0 && b <= height) {
                if (a === i && b === j) {} else {
                    arr.push(bombMatrix[a][b]);
                }
            }
        }
    }
    return arr;
}

function bombAround(i, j) {
    return getSurroundCells(i, j).filter(function (elem) {
        return elem.bomb == true;
    }).length;
}

function reload() {
   // location.reload(false);
}

function info(){
alert("Левая кнопка мыши открывает ячейки, правая маркирует. Нужно поставить маркер на все бомбы. На больших полях может глючить. Максимальные значение не ограничивал. При маленьком разрешении экрана и большем поле может неправильно прорисовать поле итд итп бета версия");
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function matrixData(){
	height = +document.getElementById("matrixSize").value -1;
	width = +document.getElementById("matrixSize").value -1;
	bomb = +document.getElementById("matrixBomb").value;
		if(!isNumeric(height)||!isNumeric(bomb)){
		alert("Вы ввели не число");
		reload();
		}else{
	
		if((height+1)*(width+1) >= bomb){
			bombMatrix = matrix();	
			bombPosition();
		}else{
			alert("Бомб не может быть больше количества ячеек");
			reload();
}
			}
}


var height,
	width,
	bomb,
    bombMatrix;