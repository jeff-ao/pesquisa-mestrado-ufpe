// Função para calcular raiz quadrada
function raizQuadrada(numero) {
  if (numero < 0) {
    throw new Error("Não é possível calcular raiz quadrada de número negativo");
  }
  return Math.sqrt(numero);
}

// Usando a função
const valores = [4, 9, 16, 25, 144];

console.log("Calculando raízes quadradas:");
valores.forEach((valor) => {
  const raiz = raizQuadrada(valor);
  console.log(`√${valor} = ${raiz}`);
});

// Exemplos adicionais
console.log("\nExemplos individuais:");
console.log(`√100 = ${raizQuadrada(100)}`);
console.log(`√2 = ${raizQuadrada(2)}`);
console.log(`√0.25 = ${raizQuadrada(0.25)}`);
