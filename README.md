# WaveFront Search
O algoritmo WaveFront é um planejador de caminho de campo potencial especializado com busca em largura para evitar mínimos locais. Ele usa um círculo crescente ao redor do robô. Os vizinhos mais próximos são analisados ​​primeiro e, em seguida, o raio do círculo é estendido para regiões distantes.

![](https://github.com/VitorMarinheiro/WaveFront-Search/blob/main/readmegif.gif)

## Execução
Para iniciar a execução basta executar o seguinte comando:

```
node server.js
```


Em seguida basta acessar a porta 3000 do localhost:

> [localhost:3000](http:localhost:3000)

Caso você deseje ver com obstáculos aleatórios utilize o '/rand':

> [http://localhost:3000/rand](http:localhost:3000/rand)