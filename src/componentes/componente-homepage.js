var componenteHomepage = function() {

    // Template da homepage
    const template = `
        <h2>Bem-vindo ao planejador de Sistemas de Informação!</h2>
        <br/>
        <p>Este projeto tem como objetivo reunir uma modelagem simplificada dos requisitos de um sistema, 
           o método de pontos por função e uma estratégia de formação de cronogramas, com foco no
           planejamento de projetos de Sistemas de Informação.</p>

        <p>Entendemos um Sistema de Informação como um tipo de software que manipula um grande volume de
           dados relacionados entre si aplicando um conjunto de transações relativamente simples, focadas na
           inserção de dados dados ao conjunto, edição dos dados do conjunto, remoção e consulta dos dados.</p>

        <p>Partindo dessa definição, a modelagem simplificada dos requisitos busca descrever os dados que 
           são manipulados pelo sistema e as transações que os manipulam, agrupando estas transações em 
           funcionalidades de mais alto nível, que perfazem o escopo do sistema.</p>

        <p>Os dados e as transações são descritos em um nível que permita o cálculo do número de pontos por
           função do sistema e este número é utilizado para chegar a um cronograma para o seu desenvolvimento.</p>
        
        <p>Ficou interessado em modelar o seu sistema? Escolha uma das opções no menu ao lado para começar.</p>`

    // Prepara a página
    function apresenta() {
    }

    return { template, apresenta }
}()