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
  
    // //Heuristica euclidiana
    // var d = dist(a.i, a.j, b.i, b.j)
    return d;
  }
  
  var allowDiagonal = true
  
  var cols = 90
  var rows = 45
  var wallspercentil = 0.30
  var grid = new Array(cols)
  
  var openSet = []
  var closedSet = []
  var start;
  var end;
  var w, h;
  var path = [];
  var noSolution = false;
  
  function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = []
    this.previus = undefined
    this.wall = false;
  
    // Cria paredes aleatoriamente
    if (random(1) < wallspercentil) {
      this.wall = true;
    }
  
    this.show = function (col) {
      if (this.wall) {
        col = color(0)
      }
      fill(col)
      noStroke()
      rect(this.i * w, this.j * h, w - 1, h - 1)
  
      // Desenha os valores de G
      if (!this.wall && this.g != 0) {
        fill(255);
        text(this.g, (this.i * w), (this.j * h) + 9);
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
  
    createCanvas(1200, 600)
  
    w = width / cols;
    h = height / rows;
  
    // Criando o grid 2d
    for (var i = 0; i < cols; i++) {
      grid[i] = new Array(rows);
    }
  
    // Criando um novo spot para cada parte do grid
    for (var i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = new Spot(i, j);
      }
    }
  
    // Adicionando os vizinhos aos spots
    for (var i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j].addNeighbors()
      }
    }
  
    // iniciando as localizacoes de start e end
    start = grid[0][0];
    start.wall = false
    end = grid[cols - 1][rows - 1]
    end.wall = false
  
    // adicionado o start ao openSet
    openSet.push(start)
  }
  
  function draw() {
  
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
        grid[i][j].show(color(255, 214, 153));
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
  
    end.show(color(255, 50, 150))
    start.show(color(255, 25, 50))
  
  }