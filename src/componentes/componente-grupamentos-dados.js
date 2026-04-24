var componenteGrupamentosDados = function() {

    const template = `
        <div id="componente-editor-grupamentos-dados" class="page-wrap">

            <!-- Header -->
            <div class="page-header">
                <div>
                <div class="page-title">Grupamentos de Dados</div>
                <div class="page-subtitle">Cadastre, altere, remova e consulte os grupamentos de dados do sistema</div>
                </div>
                <button class="btn btn-dark" id="btn-novo-grupo">
                <i class="bi bi-plus-lg"></i> Novo grupamento
                </button>
            </div>

            <!-- Lista de grupamentos -->
            <div id="grupamentos-lista" class="mb-4"></div>

            <!-- Modal de edição de grupamento -->
            <div class="modal fade" id="modalGrupamento" tabindex="-1" aria-labelledby="modalGrupamentoLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalGrupamentoLabel">Novo Grupamento</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formGrupamento">
                                <div class="mb-3">
                                    <label for="inputNomeGrupamento" class="form-label">Nome</label>
                                    <input type="text" class="form-control" id="inputNomeGrupamento" maxlength="120" required>
                                </div>
                                <div class="mb-3">
                                    <label for="selectTipoGrupamento" class="form-label">Tipo</label>
                                    <select class="form-select" id="selectTipoGrupamento" required>
                                        <option value="ILF">ILF</option>
                                        <option value="EIF">EIF</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="btn-salvar-grupamento">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    let grupamentos = [];
    let grupoEditandoId = null;

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

    /* Carrega os grupamentos do servico de dados */
    function carregarGrupamentos() {
        const dados = servicoModelo.pegaDados();
        grupamentos = dados.grupamentos || [];
    }

    /* Salva os grupamentos do servico de dados */
    function salvarGrupamentos() {
        const dados = servicoModelo.pegaDados();
        dados.grupamentos = grupamentos;
        servicoModelo.salvaDados(dados);
    }

    /* ... */
    function render() {
        const $lista = $('#grupamentos-lista').empty();

        const total = grupamentos.length;
        $('#badge-total-grupamentos').text(`${total} cadastrados`);

        const resultados = grupamentos;

        if (resultados.length === 0) {
            $lista.html(`<div class="alert alert-info">Nenhum grupamento encontrado.</div>`);
            return;
        }

        resultados.forEach(function(grupo, index) {
            const groupIndex = grupamentos.indexOf(grupo);
            const retsCount = grupo.rets.length;
            const detsCount = grupo.dets.length;

            const referencias = grupo.dets.map(function(det) {
            if (det.referenciaId == null) return 'nenhuma';
            const referenciado = grupamentos.find(function(item) { return item.id === det.referenciaId; });
            return referenciado ? referenciado.nome : 'grupo removido';
            }).join(', ') || 'nenhuma';

            const card = $(
            `<div class="card mb-3">
                <div class="card-body">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
                    <div>
                    <p class="card-title mb-1 grupo-name">${encodeHtml(grupo.nome)} (${encodeHtml(grupo.tipo)}, ${retsCount} RET, ${detsCount} DET)</p>
                    </div>
                    <div class="text-md-end">
                    <button class="btn-icon btn-nov-ret-grupo" title="Novo RET" data-index="${index}">+RET</button>
                    <button class="btn-icon btn-nov-det-grupo" title="Novo DET" data-index="${index}">+DET</button>
                    <button class="btn-icon btn-subir-grupo" title="Subir" data-index="${index}">${ico.up}</button>
                    <button class="btn-icon btn-descer-grupo" title="Descer" data-index="${index}">${ico.down}</button>
                    <button class="btn-icon btn-editar-grupo" title="Editar" data-index="${index}">${ico.edit}</button>
                    <button class="btn-icon red btn-remover-grupo" title="Remover" data-index="${index}">${ico.trash}</button>
                    </div>
                </div>
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
                    <div class="pl-4">
                    <strong>RET</strong>: ${retsCount > 0 ? encodeHtml(grupo.rets.map(function(ret){ return ret.nome; }).join(', ')) : '<span class="text-muted">Nenhum RET</span>'}
                    </div>
                    <div class="text-md-end">
                    <button class="btn-icon btn-subir-ret" title="Subir" data-id="${index}">${ico.up}</button>
                    <button class="btn-icon btn-descer-ret" title="Descer" data-id="${index}">${ico.down}</button>
                    <button class="btn-icon btn-editar-ret" title="Editar" data-id="${index}">${ico.edit}</button>
                    <button class="btn-icon red btn-remover-ret" title="Remover" data-id="${index}">${ico.trash}</button>
                    </div>
                </div>
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
                    <div class="pl-4"><strong>DET</strong>: ${detsCount > 0 ? encodeHtml(grupo.dets.map(function(det){ return det.nome + ' (' + det.retNome + ')'; }).join(', ')) : '<span class="text-muted">Nenhum DET</span>'}</div>
                </div>
                </div>
            </div>`);

            $lista.append(card);
        });

        $('.btn-subir-grupo').click(function() {
            const index = $(this).data('index');
            subirGrupamentoDados(index);
        });

        $('.btn-descer-grupo').click(function() {
            const index = $(this).data('index');
            descerGrupamentoDados(index);
        });

        $('.btn-editar-grupo').click(function() {
            const index = $(this).data('index');
            editarGrupamentoDados(index);
        });

        $('.btn-remover-grupo').click(function() {
            const index = $(this).data('index');
            removerGrupamentoDados(index);
        });
    }

    /* Abre a modal para criar um novo grupamento de dados */
    function novoGrupamentoDados() {
        grupoEditandoId = null;
        $('#modalGrupamentoLabel').text('Novo Grupamento');
        $('#inputNomeGrupamento').val('');
        $('#selectTipoGrupamento').val('ILF');
        $('#modalGrupamento').modal('show');
    }

    /* Subir um grupamento de dados */
    function subirGrupamentoDados(index) {
        if (index > 0) {
            const temp = grupamentos[index - 1];
            grupamentos[index - 1] = grupamentos[index];
            grupamentos[index] = temp;
            salvarGrupamentos();
            render();
        }
    }

    /* Descer um grupamento de dados */
    function descerGrupamentoDados(index) {
        if (index < grupamentos.length-1) {
            const temp = grupamentos[index + 1];
            grupamentos[index + 1] = grupamentos[index];
            grupamentos[index] = temp;
            salvarGrupamentos();
            render();
        }
    }

    /* Edita um grupamento de dados */
    function editarGrupamentoDados(index) {
        const grupo = grupamentos[index];
        grupoEditandoId = index;
        $('#modalGrupamentoLabel').text('Editar Grupamento');
        $('#inputNomeGrupamento').val(grupo.nome);
        $('#selectTipoGrupamento').val(grupo.tipo);
        $('#modalGrupamento').modal('show');
    }

    /* Remove um grupamento de dados */
    function removerGrupamentoDados(index) {
        const grupo = grupamentos[index];
        
        if (confirm(`Remover o grupamento "${grupo.nome}"? Esta operação também remove as referências deste grupamento.`)) {
            grupamentos.splice(index, 1);
            salvarGrupamentos();
            render();
        }
    }

    /* Salva um grupamento de dados */
    function salvaGrupamentoDados() {
        const nome = $('#inputNomeGrupamento').val().trim();
        const tipo = $('#selectTipoGrupamento').val();

        if (!nome) {
            alert('Informe o nome do grupamento.');
            $('#inputNomeGrupamento').focus();
            return;
        }

        if (grupoEditandoId) {
            var grupo = grupamentos[grupoEditandoId];
            grupo.nome = nome;
            grupo.tipo = tipo;
        } else {
            const grupo = { nome: nome, tipo: tipo, rets: [nome], dets: [] };
            grupamentos.push(grupo);
        }

        salvarGrupamentos();
        render();
        $('#modalGrupamento').modal('hide');
    }









    /* ... */
    /*function mostraEditor() {
        $('#grupo-editor').show();
    }*/

    /* ... */
    /*function escondeEditor() {
        $('#grupo-editor').hide();
        $('#input-nome-grupo').val('');
        $('#select-tipo-grupo').val('ILF');
        $('#rets-container').empty();
        $('#dets-container').empty();
        grupoEditandoId = null;
    }*/

    /* ... */
    /*function montarRetRow(nome) {
        const id = Date.now() + Math.random();
        const row = $(
            `<div class="input-group mb-2 ret-row" data-row-id="${id}">
                <input type="text" class="form-control ret-nome" placeholder="Nome do RET" value="${encodeHtml(nome || '')}" />
                <button class="btn btn-outline-danger btn-remover-ret" type="button"><i class="bi bi-x-lg"></i></button>
            </div>`);
        row.find('.btn-remover-ret').click(function() {
            row.remove();
            atualizaDetRetOptions();
        });
        return row;
    }*/

    /* ... */
    /*function montarDetRow(det) {
        const id = Date.now() + Math.random();
        const row = $(
            `<div class="det-row border rounded p-3 mb-2" data-row-id="${id}">
                <div class="row g-2 align-items-end">
                <div class="col-md-4">
                    <label class="form-label mb-1">Nome do DET</label>
                    <input type="text" class="form-control det-nome" value="${encodeHtml(det ? det.nome : '')}" placeholder="Nome do DET" />
                </div>
                <div class="col-md-3">
                    <label class="form-label mb-1">Pertence ao RET</label>
                    <select class="form-select det-ret"></select>
                </div>
                <div class="col-md-4">
                    <label class="form-label mb-1">Referência para outro grupamento</label>
                    <select class="form-select det-referencia"></select>
                </div>
                <div class="col-md-1 text-end">
                    <button class="btn btn-outline-danger btn-remover-det" type="button" title="Remover DET"><i class="bi bi-x-lg"></i></button>
                </div>
                </div>
            </div>`);

        row.find('.btn-remover-det').click(function() { row.remove(); });
        preencherDetRetOptions(row, det);
        return row;
    }*/

    /* ... */
    /*function atualizarRetList() {
        const rets = [];
        $('#rets-container .ret-row').each(function() {
            const nome = $(this).find('.ret-nome').val().trim();
            if (nome) rets.push(nome);
        });
        return rets;
    }*/

    /* ... */
    /*function atualizarDetsList() {
        const dets = [];
        $('#dets-container .det-row').each(function() {
            const nome = $(this).find('.det-nome').val().trim();
            const retNome = $(this).find('.det-ret').val();
            const referenciaId = $(this).find('.det-referencia').val();
            if (!nome || !retNome) return;
            dets.push({
            nome: nome,
            retNome: retNome,
            referenciaId: referenciaId === '' ? null : referenciaId
            });
        });
        return dets;
    }*/

    /* ... */
    /*function preencherDetRetOptions($row, det) {
        const rets = atualizarRetList();
        const $retSelect = $row.find('.det-ret').empty();
        if (rets.length === 0) {
            $retSelect.append('<option value="">Nenhum RET cadastrado</option>');
        } else {
            $retSelect.append('<option value="">Selecione um RET</option>');
            
            rets.forEach(function(nome) {
                $retSelect.append(`<option value="${encodeHtml(nome)}">${encodeHtml(nome)}</option>`);
            });
        }

        const $refSelect = $row.find('.det-referencia').empty();
        $refSelect.append('<option value="">Nenhuma referência</option>');
        
        grupamentos.forEach(function(grupo) {
            if (grupo.id === grupoEditandoId) return;
            $refSelect.append(`<option value="${grupo.id}">${encodeHtml(grupo.nome)}</option>`);
        });

        if (det) {
            if (det.retNome) $retSelect.val(det.retNome);
            if (det.referenciaId) $refSelect.val(det.referenciaId);
        }
    }*/

    /*function atualizaDetRetOptions() {
        $('#dets-container .det-row').each(function() {
            preencherDetRetOptions($(this), {
                nome: $(this).find('.det-nome').val().trim(),
                retNome: $(this).find('.det-ret').val(),
                referenciaId: $(this).find('.det-referencia').val() || null
            });
        });
    }*/

    /*function abrirNovoGrupo() {
        grupoEditandoId = null;
        $('#input-nome-grupo').val('');
        $('#select-tipo-grupo').val('ILF');
        $('#rets-container').empty();
        $('#dets-container').empty();
        $('#rets-container').append(montarRetRow(''));
        $('#dets-container').append(montarDetRow(null));
        mostraEditor();
    }*/

    /*function salvarGrupo() {
        const nome = $('#input-nome-grupo').val().trim();
        const tipo = $('#select-tipo-grupo').val();
        if (!nome) {
            alert('Informe o nome do grupamento.');
            $('#input-nome-grupo').focus();
            return;
        }

        const rets = atualizarRetList();
        if (rets.length === 0) {
            alert('Informe pelo menos um RET.');
            return;
        }

        const dets = atualizarDetsList();
        if (dets.length === 0) {
            alert('Informe pelo menos um DET válido.');
            return;
        }

        const grupoExistente = { nome: nome, tipo: tipo, rets: rets.map(function(nome) { return { nome }; }), dets: dets };

        if (grupoEditandoId) {
            const index = grupamentos.findIndex(function(item) { return item.id === grupoEditandoId; });
            if (index >= 0) {
                grupoExistente.id = grupoEditandoId;
                grupamentos[index] = grupoExistente;
            }
        } else {
            grupoExistente.id = gerarIdUnico();
            grupamentos.push(grupoExistente);
        }

        salvarGrupamentos();
        escondeEditor();
        render();
    }*/

    /*function gerarIdUnico() {
        return 'grupo-' + Date.now() + '-' + Math.floor(Math.random() * 99999);
    }*/

    function encodeHtml(valor) {
        return $('<div>').text(valor || '').html();
    }

    function apresenta() {
        $('#btn-novo-grupo').click(novoGrupamentoDados);

        $('#btn-salvar-grupamento').click(salvaGrupamentoDados);

        $('#btn-adicionar-ret').off('click').on('click', function() {
            $('#rets-container').append(montarRetRow(''));
            atualizaDetRetOptions();
        });

        $('#btn-adicionar-det').off('click').on('click', function() {
            $('#dets-container').append(montarDetRow(null));
        });

        carregarGrupamentos();
        render();
    }

    /* TODO Modal para criação de RET */

    /* TODO tratamento de ENTER e ESC na modal de agrupamentos */

    return { template, apresenta }
}()