var componenteEditorFuncionalidades = function() {

  // Template do componente
  const template = `
    <div id="componente-editor-funcionalidades" class="page-wrap">
    
      <!-- Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Funcionalidades</div>
          <div class="page-subtitle">Gerencie as funcionalidades e suas transações</div>
        </div>
        <button class="btn-base btn-dark" id="btn-nova-func">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="8" x2="14" y2="8"/></svg>
          Nova funcionalidade
        </button>
      </div>
    
      <!-- Formulário de nova funcionalidade -->
      <div class="add-func-form mb-3" id="add-func-form">
        <input type="text" id="input-nova-func" placeholder="Nome da funcionalidade ..." maxlength="120" />
        <div class="add-func-actions">
          <button class="btn-base btn-dark" id="btn-salvar-func">Salvar</button>
          <button class="btn-base btn-ghost" id="btn-cancelar-func">Cancelar</button>
        </div>
      </div>
    
      <!-- Lista de funcionalidades -->
      <div class="func-list" id="func-list">
      </div>
    
      <!-- Empty state -->
      <div class="empty-state" id="empty-state" style="display:none;">
        <p>Nenhuma funcionalidade cadastrada.<br><br>Clique em <strong>Nova funcionalidade</strong> para começar.</p>
      </div>
    </div>`

  /* Estado */
  let funcionalidades = [];
 
  /* Ícones SVG inline */
  const ico = {
    chevron: `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 3 11 8 6 13"/></svg>`,
    edit:    `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 2l3 3-9 9H2v-3L11 2z"/></svg>`,
    trash:   `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="2 4 14 4"/><path d="M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"/></svg>`,
    plus:    `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="8" x2="14" y2="8"/></svg>`,
    check:   `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 8 6.5 12 13 4"/></svg>`,
    close:   `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`,
    up:      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="13" x2="8" y2="3"/><polyline points="4 7 8 3 12 7"/></svg>`,
    down:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="3" x2="8" y2="13"/><polyline points="4 9 8 13 12 9"/></svg>`,
  };
 
  /* Renderiza a lista de funcionalidades */
  function render() {
    const $list = $('#func-list').empty();
    const $empty = $('#empty-state');
    const funcCount = funcionalidades.length;
    
    if (funcCount === 0) {
      $empty.show();
      return;
    }

    $empty.hide();

    for (var i = 0; i < funcCount; i++) {
      const func = funcionalidades[i];
      const isOpen = func.open;
      
      const $card = $(`
        <div class="func-card${isOpen ? ' open' : ''}" data-func-id="${i}">
          <div class="func-header">
            <span class="func-toggle">${ico.chevron}</span>
            <span class="func-name">${encodeForHtml(func.nome)}</span>
            <span class="func-count">${func.transacoes.length} transa${func.transacoes.length !== 1 ? 'ções' : 'ção'}</span>
            <span class="func-actions" onclick="event.stopPropagation()">
              <button class="btn-icon" title="Sobe" data-action="up-func" data-func-id="${i}">${ico.up}</button>
              <button class="btn-icon" title="Desce" data-action="down-func" data-func-id="${i}">${ico.down}</button>
              <button class="btn-icon" title="Editar" data-action="edit-func" data-func-id="${i}">${ico.edit}</button>
              <button class="btn-icon red" title="Remover" data-action="remove-func" data-func-id="${i}">${ico.trash}</button>
            </span>
          </div>
          <div class="func-body">
            <div class="trans-list" data-func-id="${i}">
              ${renderTransacoes(func, i)}
              <div class="trans-add-row">
                <button class="btn-icon green" title="Adicionar transação" data-action="add-trans" data-func-id="${i}">${ico.plus}</button>
                <span style="font-size:12px;color:var(--muted);">Adicionar transação</span>
              </div>
            </div>
          </div>
        </div>`);

      $list.append($card);
    }

    $("#componente-editor-funcionalidades .func-header").click(toggleTransacoesFuncionalidade);
    $("#componente-editor-funcionalidades .func-actions button[data-action='edit-func']").click(editaFuncionalidade);
    $("#componente-editor-funcionalidades .func-actions button[data-action='remove-func']").click(removeFuncionalidade);
    $("#componente-editor-funcionalidades .func-actions button[data-action='up-func']").click(sobeFuncionalidade);
    $("#componente-editor-funcionalidades .func-actions button[data-action='down-func']").click(desceFuncionalidade);

    $("#componente-editor-funcionalidades .trans-add-row button[data-action='add-trans']").click(adicionaTransacao);
    $("#componente-editor-funcionalidades .trans-item button[data-action='edit-trans']").click(editaTransacao);
    $("#componente-editor-funcionalidades .trans-item button[data-action='remove-trans']").click(removeTransacao);
    $("#componente-editor-funcionalidades .trans-item button[data-action='up-trans']").click(sobeTransacao);
    $("#componente-editor-funcionalidades .trans-item button[data-action='down-trans']").click(desceTransacao);
  }
 
  /* Renderiza as transações de uma funcionalidade */
  function renderTransacoes(func, funcId) {
    const transactionCount = func.transacoes.length;

    if (transactionCount === 0) 
      return '';

    var transactionDescriptors = "";

    for (var i = 0; i < transactionCount; i++) {
      const t = func.transacoes[i];

      const transactionDescriptor = `
        <div class="trans-item" data-func-id="${funcId}" data-trans-id="${i}">
          <span class="trans-name">${encodeForHtml(t.nome)}</span>
          <span class="trans-actions" onclick="event.stopPropagation()">
            <button class="btn-icon" title="Subir" data-action="up-trans" data-func-id="${funcId}" data-trans-id="${i}">${ico.up}</button>
            <button class="btn-icon" title="Descer" data-action="down-trans" data-func-id="${funcId}" data-trans-id="${i}">${ico.down}</button>
            <button class="btn-icon" title="Editar" data-action="edit-trans" data-func-id="${funcId}" data-trans-id="${i}">${ico.edit}</button>
            <button class="btn-icon red" title="Remover" data-action="remove-trans" data-func-id="${funcId}" data-trans-id="${i}">${ico.trash}</button>
          </span>
        </div>`;

        if (transactionDescriptors.length > 0) {
          transactionDescriptors += `<div class="trans-divider"></div>`;
        }

        transactionDescriptors += transactionDescriptor;
    }

    return transactionDescriptors;
  }
 
  /* Codifica uma string para ser apresentada em HTML */
  function encodeForHtml(str) {
    return $('<div>').text(str).html();
  }

  /* Salva uma nova funcionalidade */
  function salvaNovaFuncionalidade() {
    const nome = $('#input-nova-func').val().trim();
    if (!nome) { $('#input-nova-func').focus(); return; }

    funcionalidades.push({ nome, transacoes: [], open: true });
    salvaFuncionalidades();

    $('#add-func-form').removeClass('visible');
    render();
  }

  /* Salva as funcionalidades no modelo */
  function salvaFuncionalidades() {
    const dados = servicoModelo.pegaDados();
    dados.funcionalidades = funcionalidades;
    servicoModelo.salvaDados(dados);
  }
 
  /* Apresenta ou esconde as transações de uma funcionalidade */
  function toggleTransacoesFuncionalidade(e) {
    if ($(e.target).closest('.func-actions, button').length) return;
    const funcId = $(this).closest('.func-card').data('func-id');
    const func = funcionalidades[funcId];
    func.open = !func.open;
    salvaFuncionalidades();
    render();
  }
 
  /* Edita o nome de uma funcionalidade */
  function editaFuncionalidade(e) {
    e.stopPropagation();
    const funcId = $(this).data('func-id');
    const func = funcionalidades[funcId];
    const $card = $(`.func-card[data-func-id="${funcId}"]`);
    const $nameSpan = $card.find('.func-name');
 
    const $input = $(`<input class="func-name-input" value="${encodeForHtml(func.nome)}" maxlength="120" />`);
    const $confirm = $(`<button class="btn-icon green" title="Confirmar">${ico.check}</button>`);
    const $cancel  = $(`<button class="btn-icon red" title="Cancelar">${ico.close}</button>`);
    const $actions = $card.find('.func-actions');
 
    $nameSpan.replaceWith($input);
    $actions.hide();
    $input.after($confirm).after($cancel);
    $input.focus().select();
 
    function confirmar() {
      const novo = $input.val().trim();
      if (!novo) { $input.focus(); return; }
      func.nome = novo;
      func.open = $card.hasClass('open');
      salvaFuncionalidades();
      render();
    }
 
    $confirm.on('click', confirmar);
    $cancel.on('click', () => render());
  
    $input.on('keydown', function (e) {
      if (e.key === 'Enter') confirmar();
      if (e.key === 'Escape') render();
    });
  }
 
  /* Sobe uma funcionalidade */
  function sobeFuncionalidade(e) {
    e.stopPropagation();
    const funcId = $(this).data('func-id');
    if (funcId === 0) return; // já está no topo

    const func = funcionalidades[funcId];
    const formerFunc = funcionalidades[funcId-1];
    
    funcionalidades[funcId] = formerFunc;
    funcionalidades[funcId-1] = func;
    salvaFuncionalidades();

    render();
  }
 
  /* Desce uma funcionalidade */
  function desceFuncionalidade(e) {
    e.stopPropagation();
    const funcId = $(this).data('func-id');
    if (funcId === funcionalidades.length-1) return; // já está por ultimo

    const func = funcionalidades[funcId];
    const nextFunc = funcionalidades[funcId+1];
    
    funcionalidades[funcId] = nextFunc;
    funcionalidades[funcId+1] = func;
    salvaFuncionalidades();

    render();
  }

  /* Remove uma funcionalidade */
  function removeFuncionalidade(e) {
    e.stopPropagation();
    const funcId = $(this).data('func-id');
    const func = funcionalidades[funcId];
    if (!confirm(`Remover a funcionalidade "${func.nome}" e todas as suas transações?`)) return;

    funcionalidades = funcionalidades.splice(funcId, 1);
    salvaFuncionalidades();

    render();
  }
 
  /* Adiciona uma transação em uma funcionalidade */ 
  function adicionaTransacao(e) {
    e.stopPropagation();
    const funcId = $(this).data('func-id');
    const func = funcionalidades[funcId];
    const $addRow = $(this).closest('.trans-add-row');
 
    const $input   = $(`<input class="inline-input" placeholder="Nome da transação…" maxlength="120" style="flex:1" />`);
    const $confirm = $(`<button class="btn-icon green">${ico.check}</button>`);
    const $cancel  = $(`<button class="btn-icon red">${ico.close}</button>`);
 
    $addRow.empty().append($input, $confirm, $cancel);
    $input.focus();
 
    function salvar() {
      const nome = $input.val().trim();
      if (!nome) { $input.focus(); return; }
      func.transacoes.push({ nome });
      func.open = true;
      salvaFuncionalidades();
      render();
    }
 
    $confirm.on('click', salvar);
    $cancel.on('click', () => render());
    $input.on('keydown', function (ev) {
      if (ev.key === 'Enter') salvar();
      if (ev.key === 'Escape') render();
    });
  }
 
  /* Edita uma transação */
  function editaTransacao(e) {
    e.stopPropagation();

    const funcId   = $(this).data('func-id');
    const func = funcionalidades[funcId];

    const transIdx = $(this).data('trans-id');
    const trans = func.transacoes[transIdx];

    const $item = $(`.trans-item[data-func-id="${funcId}"][data-trans-id="${transIdx}"]`);
    const $nameSpan = $item.find('.trans-name');
    const $transActions = $item.find('.trans-actions');
 
    const $input   = $(`<input class="inline-input" value="${encodeForHtml(trans.nome)}" maxlength="120" />`);
    const $confirm = $(`<button class="btn-icon green">${ico.check}</button>`);
    const $cancel  = $(`<button class="btn-icon red">${ico.close}</button>`);
 
    $nameSpan.replaceWith($input);
    $transActions.html('').append($confirm, $cancel).css('opacity', 1);
    $input.focus().select();
 
    function confirmar() {
      const novo = $input.val().trim();
      if (!novo) { $input.focus(); return; }
      trans.nome = novo;
      func.open = true;
      salvaFuncionalidades();
      render();
    }
 
    $confirm.on('click', confirmar);
    $cancel.on('click', () => render());
    $input.on('keydown', function (ev) {
      if (ev.key === 'Enter') confirmar();
      if (ev.key === 'Escape') render();
    });
  }
 
  /* Sobe uma transação */
  function sobeTransacao(e) {
    e.stopPropagation();
    const funcId   = $(this).data('func-id');
    const func = funcionalidades[funcId];

    const transIdx = $(this).data('trans-id');
    if (transIdx === 0) return; // já está no topo
   
    const trans = func.transacoes[transIdx];
    const formerTransaction = func.transacoes[transIdx-1];
    
    func.transacoes[transIdx] = formerTransaction;
    func.transacoes[transIdx-1] = trans;
    salvaFuncionalidades();

    render();
  }
 
  /* Desce uma transação */
  function desceTransacao(e) {
    e.stopPropagation();
    const funcId = $(this).data('func-id');
    const func = funcionalidades[funcId];

    const transIdx = $(this).data('trans-id');
    if (transIdx === func.transacoes.length-1) return; // já está por ultimo
    
    const trans = func.transacoes[transIdx];
    const nextTransaction = func.transacoes[transIdx+1];
    
    func.transacoes[transIdx] = nextTransaction;
    func.transacoes[transIdx+1] = trans;
    salvaFuncionalidades();

    render();
  }
 
  /* Remove uma transação */
  function removeTransacao(e) {
    e.stopPropagation();
    
    const funcId = $(this).data('func-id');
    const func = funcionalidades[funcId];

    const transIdx = $(this).data('trans-id');
    func.transacoes.splice(transIdx, 1);

    func.open = true;
    salvaFuncionalidades();

    render();
  }
 
  /* Apresenta o componente */ 
  function apresenta() {
    funcionalidades = servicoModelo.pegaDados().funcionalidades || [];

    $('#btn-nova-func').on('click', function () {
      $('#add-func-form').addClass('visible');
      $('#input-nova-func').val('').focus();
    });
  
    $('#btn-cancelar-func').on('click', function () {
      $('#add-func-form').removeClass('visible');
    });
 
    $('#btn-salvar-func').on('click', salvaNovaFuncionalidade);

    $('#input-nova-func').on('keydown', function (e) {
      if (e.key === 'Enter') salvaNovaFuncionalidade();
      if (e.key === 'Escape') $('#btn-cancelar-func').trigger('click');
    });

    render();
  }

  return { template, apresenta }
}()