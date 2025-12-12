const pessoa = {
  nome: "João",
  idade: 30,
  cidade: "São Paulo",
};

const editInfos = (newNome, newIdade, newCidade) => {
  pessoa.nome = newNome;
  pessoa.idade = newIdade;
  pessoa.cidade = newCidade;
};

editInfos("Maria", 25, "Rio de Janeiro");

console.log(pessoa);
