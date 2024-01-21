
const spreadsheetID = '1dDoSnoE6p2ewQyvTqO5l7X7GnqPYncXKTi1Y5J6Lfic';
const urlpagina = '&tq&gid=0';
const url = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json${urlpagina}`;

const USUARIO = "avon";
const SENHA = "avon@2024";
const ATIVADO = true;

async function obterDados(){

    let data = await fetch(url);
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



function pesquisar(palavra, cod){
    obterDados().then(
        value => {
            let tabela = value.table.rows;

            let filtro = tabela.map((k) =>{
                return k['c'];
            });
            
            let filtro2 = filtro.filter((k) =>{
                let r1 = -1;
                let r2 = -1;
                if(palavra.trim().length > 0 ){
                    r1 = k['0'].v.toString().toLowerCase().search(palavra.toLowerCase());
                }
                if(cod.trim().length > 0 ){
                    r2 = k['1'].v.toString().toLowerCase().search(cod.toLowerCase());
                }
            
                return ((r1 > -1) || (r2 > -1));
            });

    
           criarTabelaHTML(filtro2);
      
            
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

    }else {
       let acesso = document.getElementById("acesso");
       acesso.style = " display: block;";
    }
    

}

function inserirPesquisa() {

    let pesquisaCodigo = document.getElementById("codigo");
    let pesquisaNome = document.getElementById("produto");
    let pesquisaBotao = document.getElementById("pesquisa");
    pesquisaBotao.addEventListener("click", function () {
        pesquisar(pesquisaCodigo.value.toString(),pesquisaNome.value.toString());
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
