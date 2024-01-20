
const spreadsheetID = '1dDoSnoE6p2ewQyvTqO5l7X7GnqPYncXKTi1Y5J6Lfic';
const urlpagina = '&tq&gid=1212912229';
const url = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json${urlpagina}`;


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

            console.log(filtro)
            
            let filtro2 = filtro.filter((k) =>{
                let r1 = -1;
                let r2 = -1;
                if(palavra.trim().length > 0 ){
                    r1 = k['0'].v.toString().toLowerCase().search(palavra);
                }
                if(cod.trim().length > 0 ){
                    r2 = k['1'].v.toString().toLowerCase().search(cod);
                }
            
                return ((r1 > -1) || (r2 > -1));
            });

           console.log(JSON.stringify(filtro2));

           criarTabelaHTML(filtro2);
      
            
        }
    )
}
function criarTabelaHTML(dados) {
    // Cria um elemento de tabela
    let tabela = document.createElement("table");

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

    // Adiciona a tabela ao corpo do documento
    let divResultados = document.getElementById("resultados");
    divResultados.textContent = '';
    divResultados.appendChild(tabela);
}



let pesquisaCodigo = document.getElementById("codigo");
let pesquisaNome = document.getElementById("produto");
let pesquisaBotao = document.getElementById("pesquisa");

pesquisaBotao.addEventListener("click", function () {
    pesquisar(pesquisaCodigo.value.toString(),pesquisaNome.value.toString());
})

