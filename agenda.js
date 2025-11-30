const fs = require("fs");
const readline = require("readline");

// Classe Contato
class Contato {
    constructor(nome, telefone, endereco, relacao) {
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.relacao = relacao;
    }

    toString() {
        return `Nome: ${this.nome} | Telefone: ${this.telefone} | Endereço: ${this.endereco} | Relação: ${this.relacao}`;
    }
}

// Classe Agenda
class Agenda {
    constructor() {
        this.contatos = [];
        this.arquivo = "agenda.json";
    }

    // (a) Buscar nome ou parte
    buscar(nome) {
        nome = nome.toLowerCase();
        for (let c of this.contatos) {
            if (c.nome.toLowerCase().includes(nome)) {
                return c;
            }
        }
        return null;
    }

    // (b) Inserção ou alteração
    inserirOuAlterar(nome, telefone, endereco, relacao) {
        let c = this.buscar(nome);

        if (c) {
            c.telefone = telefone;
            c.endereco = endereco;
            c.relacao = relacao;
            console.log("\nContato existente alterado com sucesso!");
        } else {
            this.contatos.push(new Contato(nome, telefone, endereco, relacao));
            console.log("\nNovo contato inserido com sucesso!");
        }
    }

    // (b) Remoçõao
    remover(nome) {
        let index = this.contatos.findIndex(c => c.nome.toLowerCase() === nome.toLowerCase());
        if (index !== -1) {
            this.contatos.splice(index, 1);
            console.log("\nContato removido!");
        } else {
            console.log("\nContato não encontrado!");
        }
    }

    // (c) Listar
    listar() {
        if (this.contatos.length === 0) {
            console.log("\nAgenda vazia!");
            return;
        }

        console.log("\n------ LISTA DE CONTATOS ------");
        for (let c of this.contatos) {
            console.log(c.toString());
        }
        console.log("--------------------------------");
    }

    // (d) Salvar no arquivo
    salvar() {
        fs.writeFileSync(this.arquivo, JSON.stringify(this.contatos, null, 2));
        console.log("\nAgenda salva no arquivo!");
    }

    // (d) Recuperar do arquivo
    recuperar() {
        if (!fs.existsSync(this.arquivo)) {
            console.log("\nNenhum arquivo encontrado.");
            return;
        }

        const data = JSON.parse(fs.readFileSync(this.arquivo, "utf8"));
        this.contatos = data.map(c => new Contato(c.nome, c.telefone, c.endereco, c.relacao));
        console.log("\nAgenda carregada do arquivo!");
    }
}

// Menu Interativo
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const agenda = new Agenda();

// Contatos iniciais (letra e)
agenda.inserirOuAlterar("Fulano", "99999999", "Rua A", "UFF");
agenda.inserirOuAlterar("Ciclano", "88888888", "Rua B", "Cederj");
agenda.inserirOuAlterar("Beltrano", "88889999", "Rua C", "Infância");

// Alteração e remoção (letra f)
agenda.inserirOuAlterar("Fulano", "77777777", "Rua D", "UFF");
agenda.remover("Ciclano");

// Função de menu
function mostrarMenu() {
    console.log(`
========= MENU DA AGENDA =========
1 - Inserir/Alterar contato
2 - Buscar contato
3 - Remover contato
4 - Listar contatos
5 - Salvar agenda em arquivo
6 - Carregar agenda do arquivo
0 - Sair
==================================
`);
}

function iniciarMenu() {
    mostrarMenu();

    rl.question("Escolha uma opção: ", opcao => {
        switch (opcao) {
            case "1":
                rl.question("Nome: ", nome => {
                    rl.question("Telefone: ", telefone => {
                        rl.question("Endereço: ", endereco => {
                            rl.question("Relação: ", relacao => {
                                agenda.inserirOuAlterar(nome, telefone, endereco, relacao);
                                iniciarMenu();
                            });
                        });
                    });
                });
                break;

            case "2":
                rl.question("Digite o nome para buscar: ", nome => {
                    const c = agenda.buscar(nome);
                    if (c) console.log("\nEncontrado: " + c.toString());
                    else console.log("\nNenhum contato encontrado.");
                    iniciarMenu();
                });
                break;

            case "3":
                rl.question("Digite o nome para remover: ", nome => {
                    agenda.remover(nome);
                    iniciarMenu();
                });
                break;

            case "4":
                agenda.listar();
                iniciarMenu();
                break;

            case "5":
                agenda.salvar();
                iniciarMenu();
                break;

            case "6":
                agenda.recuperar();
                iniciarMenu();
                break;

            case "0":
                console.log("\nEncerrando...");
                rl.close();
                break;

            default:
                console.log("\nOpção inválida!");
                iniciarMenu();
        }
    });
}

iniciarMenu();
