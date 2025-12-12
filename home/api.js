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

editInfos("Felipe", 33, "Paraibano");

console.log(pessoa);
