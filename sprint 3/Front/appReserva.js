document.addEventListener("DOMContentLoaded", getAllSalas);
document.addEventListener("DOMContentLoaded", getAllSalasTable);

// Função para listar as salas em uma lista (não uma tabela)
function getAllSalas() {
  fetch("http://10.89.240.77:5000/api/v2/salas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((err) => {
        throw new Error(err.Error);
      });
    })
    .then((data) => {
      const salasList = document.getElementById("user_list");
      salasList.innerHTML = ""; // Limpa a lista existente

      // Assume que 'data' contém as salas (não usuários)
      data.salas.forEach((sala) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Nome: ${sala.nome}, Descrição: ${sala.descricao}, Capacidade: ${sala.capacidade}`;
        salasList.appendChild(listItem);
      });
    })
    .catch((error) => {
      alert("Erro ao obter salas: " + error.message);
      console.error("Erro: ", error.message);
    });
}

// Função para listar as salas na tabela
function getAllSalasTable() {
  fetch("http://10.89.240.77:5000/api/v2/salas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((err) => {
        throw new Error(err.Error);
      });
    })
    .then((data) => {
      const tableBody = document.getElementById("sala_list_tabela");
      tableBody.innerHTML = ""; // Limpa a tabela antes de adicionar novos itens

      // Assume que 'data' contém as salas (não usuários)
      data.salas.forEach((sala) => {
        // Cria uma nova linha para a tabela
        const tr = document.createElement("tr");

        // Cria a célula para o nome da sala
        const tdNome = document.createElement("td");
        tdNome.textContent = sala.nome;
        tr.appendChild(tdNome);

        // Cria a célula para a descrição da sala
        const tdDescricao = document.createElement("td");
        tdDescricao.textContent = sala.descricao;
        tr.appendChild(tdDescricao);

        // Cria a célula para a capacidade da sala
        const tdCapacidade = document.createElement("td");
        tdCapacidade.textContent = sala.capacidade;
        tr.appendChild(tdCapacidade);

        // Adiciona a linha à tabela
        tableBody.appendChild(tr);
      });
    })
    .catch((error) => {
      alert("Erro ao obter salas: " + error.message);
      console.error("Erro: ", error.message);
    });
}
