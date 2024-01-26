
const spreadsheetID = '1dDoSnoE6p2ewQyvTqO5l7X7GnqPYncXKTi1Y5J6Lfic';
const dados = '&tq&gid=0';
const metadados = '&tq&gid=1424583042';
const urldados = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json${dados}`;

const urlmeta = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json${metadados}`;

const USUARIO = "avon";
const SENHA = "avon@2024";
const ATIVADO = true;

async function obterDados(link){

    let data = await fetch(link);
    let texto1 = await data.text()
    let texto2 = texto1.replaceAll(
        "/*O_o*/\ngoogle.visualization.Query.setResponse(",
        ""
    );    
    let texto3 = texto2.replace(
        ");",
        ""
    );

    return JSON.parse(texto3);
}



function pesquisar(pesquisaNome, pesquisaCodigo){
    let divResultados = document.getElementById("resultados");
    let carregando = document.getElementById("carregando");
    let acentos = document.getElementById("acento");
    divResultados.textContent = '';
    carregando.style = "display: block;";

    obterDados(urldados).then(
        value => {

            let n1 = pesquisaNome.toString().toLowerCase().trim()
            let nome = n1;
            if (acentos.checked){
                nome = n1.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            }

            let tabela = value.table.rows;

            let filtro = tabela.map((k) =>{
                return k['c'];
            });
            
            let filtro2 = filtro.filter((k) =>{
                let r1 = -1;
                let r2 = -1;
                if(pesquisaCodigo.trim().length > 0 ){
                    r1 = k['0'].v.toString().toLowerCase().search(pesquisaCodigo.toString().toLowerCase().trim())
                }
                if(nome.trim().length > 0 ){
                    r2 = k['1'].v.toString().toLowerCase().search(nome)
                }
            
                return ((r1 > -1) || (r2 > -1));
            });

           criarTabelaHTML(filtro2);
           carregando.style = "display: none;";
            
        }
    ).catch(
        value => {
            let divResultados = document.getElementById("resultados");
            divResultados.textContent = '';
            divResultados.textContent = "Erro";
            carregando.style = "display: none;";
        }
    )
}
function criarTabelaHTML(dados) {
    let divResultados = document.getElementById("resultados");
    divResultados.textContent = '';
    if (dados.length > 0){
        // Cria um elemento de tabela
        let tabela = document.createElement("table");
        tabela.setAttribute("id","tabela");

        // Loop através dos dados
        dados.forEach(function (linha) {
            // Cria uma linha (tr) para cada subarray
            var linhaTabela = tabela.insertRow();

            // Loop através dos elementos de cada subarray
            linha.forEach(function (celula) {
                // Cria uma célula (td) para cada elemento e adiciona à linha
                var celulaTabela = linhaTabela.insertCell();
                celulaTabela.textContent = celula.v;
            });
        });
        
        divResultados.appendChild(tabela);
    }else{
        divResultados.textContent = "Nenhum produto encontrado";
    }
    
}

function inserirAtualizacao(){
    let data = document.getElementById("data_atualizacao");

    obterDados(urlmeta).then(
        value => {
            let tabela = value.table.rows;
            data.innerHTML = (tabela['1']['c'][0].v);
        }
    ).catch(
        value => {
           
            data.innerHTML = "2024";
        }
    )
    }

function login() {

    let bloco_login = document.getElementById("id_bloco_login");
    let input_usuario = document.getElementById("usuario");
    let input_senha = document.getElementById("senha");
    let blocoPesquisa = document.getElementById("id_bloco_pesquisa");

    let u = sessionStorage.getItem("usuario");
    let s = sessionStorage.getItem("senha");

    if((u == USUARIO) && (s == SENHA)){
        input_usuario.value =  sessionStorage.getItem("usuario");
        input_senha.value = sessionStorage.getItem("senha");
    }
    
    if ((SENHA == input_senha.value.toString()) && (USUARIO == input_usuario.value.toString())){
        bloco_login.style = "display: none;";
        blocoPesquisa.style = "display: block;";

        sessionStorage.setItem("usuario", USUARIO);
        sessionStorage.setItem("senha", SENHA);
        inserirPesquisa();
        inserirAtualizacao();

    }else {
       let acesso = document.getElementById("acesso");
       acesso.style = " display: block;";
    }
    

}


function inserirPesquisa() {

    let pesquisaBotao = document.getElementById("pesquisa");
    let pesquisaCodigo = document.getElementById("codigo");
    let pesquisaNome = document.getElementById("produto");
    pesquisaBotao.addEventListener("click", function () {
        pesquisar(pesquisaNome.value,pesquisaCodigo.value);
    })
}

let botao_logar = document.getElementById("btn_logar");

if (ATIVADO){
    botao_logar.addEventListener("click",login);
    let u = sessionStorage.getItem("usuario");
    let s = sessionStorage.getItem("senha");

    if((u == USUARIO) && (s == SENHA)){
        login();
    }

}else{
    document.getElementById("fora").style.display = "block";

}
