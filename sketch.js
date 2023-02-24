function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  // // Heuristica normal que compara uma diagonal igual ao passo para os lados
  var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

var allowDiagonal = false

var cols = 64
var rows = 64
var wallspercentil = 0.30
var grid = new Array(cols)

var openSet = []
var closedSet = []
var start;
var end;
var w, h;
var path = [];
var noSolution = false;

function Spot(i, j, color) {
  this.color = color
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = []
  this.previus = undefined
  this.wall = false;

  // Parede
  if (this.color === 'rgb(0, 0, 0)') {
    this.wall = true
  }

  // Show
  this.show = function (color) {
    if (color == undefined) {
      fill(this.color)
    } else {
      fill(color)
    }
    noStroke()
    rect((this.j * 10), (this.i * 10), 10, 10)

    // Desenha os valores de G
    if (!this.wall && this.g != 0) {
      fill(255, 102, 255);
      textSize(8);
      text(this.g, (this.j * 10) , (this.i * 10) + 7);
    }
  }

  this.addNeighbors = function () {
    if (i < cols - 1)
      this.neighbors.push(grid[this.i + 1][j])
    if (i > 0)
      this.neighbors.push(grid[this.i - 1][j])
    if (j < rows - 1)
      this.neighbors.push(grid[i][this.j + 1])
    if (j > 0)
      this.neighbors.push(grid[i][this.j - 1])

    // Diagonais
    if (allowDiagonal) {
      if (i < cols - 1 && j < rows - 1)
        this.neighbors.push(grid[this.i + 1][this.j + 1])
      if (i < cols - 1 && j > 0)
        this.neighbors.push(grid[this.i + 1][this.j - 1])
      if (i > 0 && j < rows - 1)
        this.neighbors.push(grid[this.i - 1][this.j + 1])
      if (i > 0 && j > 0)
        this.neighbors.push(grid[this.i - 1][this.j - 1])
    }
  }
}

function setup() {

  createCanvas(1200, 700)

  w = width / cols;
  h = height / rows;

  // Criando o grid 2d
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  var image = new Image();
  image.src = '/mazes/maze.png';

  image.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    rows = canvas.width
    cols = canvas.height

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        var pixelData = context.getImageData(j, i, 1, 1).data;
        var color = 'rgb(' + pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ')';
        grid[i][j] = new Spot(i, j, color);
      }
    }
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Adicionando os vizinhos aos spots
    for (var i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j].addNeighbors()
      }
    }

    // adicionado o start ao openSet
    start = grid[1][1]
    end = grid[rows - 2][rows - 2]
    openSet.push(start)
  }
}

function draw() {


  if (grid[0][0] != undefined) {
    if (openSet.length > 0) {
      // continuar buscando

      // Captura o primeiro elemento do openSet
      var current = openSet.shift()

      // Caso o winner seja o final, finaliza a busca
      if (current === end) {

        // Para o Loop
        noLoop();
        console.log('Done!!')
      }

      // Remove current do openset e adiciona ao closedset
      removeFromArray(openSet, current)
      closedSet.push(current)

      // Varre os vizinhos para encontrar seu g (preço de caminho)
      var neighbors = current.neighbors;
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i]

        // Avalia se o vizinho atual já nao foi visitado
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          // Captura o G do atual e adiciona 1
          var tempG = current.g + 1;
          var newPath = false;

          // Avalia se o G atual é melhor que o já encontrado
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }

            // Caso o vizinho nao tenha sido visitado ainda, é salvo diretamente no openset
          } else {
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor)
          }

          if (newPath) {
            neighbor.h = heuristic(neighbor, end)
            neighbor.f = neighbor.g + neighbor.h
            neighbor.previus = current;
          }
        }

      }

    } else {
      // sem solucao
      console.log('Sem Solucao!')
      noSolution = true;
      noLoop();
      return;
    }

    // Pinta todos os campos de branco
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].show();
      }
    }

    // Mostra os vizinhos ja vistos (Vermelho)
    for (var i = 0; i < closedSet.length; i++) {
      closedSet[i].show(color(255, 0, 0))
    }

    // Mostra os proximos vizinhos a serem vistos (Verde)
    for (var i = 0; i < openSet.length; i++) {
      openSet[i].show(color(0, 255, 0))
    }

    // Captura o caminho
    path = []
    var temp = current;
    while (temp.previus) {
      path.push(temp.previus)
      temp = temp.previus
    }

    // Mostra o melhor caminho atual (Azul)
    for (var i = 0; i < path.length; i++) {
      path[i].show(color(0, 0, 255))
    }

    end.show()
    start.show()

  }
}