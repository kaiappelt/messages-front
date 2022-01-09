const html = {
    get(element) {
        return document.getElementById(element);
    }
}

const state = {
    userSession: {},
    welcome: html.get("welcome"),
    tbody: html.get("tbody"),
    descriptionMsg: html.get("descriptionMsg"),
    detailsMsg: html.get("detailsMsg"),
    
    dataMessageId: null 
}

init();

// encerra sessão
function logout() {
    config.logout();
}

function init() {
    let userSession = localStorage.userSession;
    let token = localStorage.token;

    if (! userSession || ! token) {
        logout();
    }

    state.userSession = JSON.parse(userSession);

    state.welcome.innerHTML = `Bem vindo(a) ${state.userSession.name}!`;

    getAll();
}

// recupera todos os dados da tabela
function getAll() {
    const userId = state.userSession.id;

    api.get(`/messages/user/${userId}`)
    .then(response => {
        populateTable(response.data);
    })
    .catch(error => {
        if(error.response.status === 401){
            logout();
        } else {
            swal.fire("Erro!", "Não foi possível realizar a sua solicitação.", "error");
        }
    }) 
}

// define a ação 
function core(){
    if(state.dataMessageId) {
        // editar
        update(state.dataMessageId);
    } else {
        // inserir
        insertNewMsg();
    }
}

// insere um novo registro
async function insertNewMsg() {
    config.loaderPage();

    formValidation.setRules(state.descriptionMsg.value, "descriptionMsg");
    formValidation.setRules(state.detailsMsg.value, "detailsMsg");

    if (formValidation.run()) {
        const userId = state.userSession.id;

        let newMessage = {
            user_id: userId,
            description: state.descriptionMsg.value,
            details: state.detailsMsg.value
        } 

    await api.post("/messages", newMessage)
        .then(response => {
            if(response.request.status === 200){
                swal.fire("Sucesso!", "Dados salvos com sucesso.", "success");
                clearAll();
                getAll();
            }
        }).catch(error => {
            if(error.response.status === 401){
                logout();
            } else {
                swal.fire("Erro!", "Não foi possível realizar a sua solicitação.", "error");
            }
        })

    } else {
        let errorDescription = formValidation.errorMessages.descriptionMsg;
        let errorDetails = formValidation.errorMessages.detailsMsg;

        if (errorDescription) {
            descriptionMsg.style.border = "1px solid #ff0000";
        } else {
            descriptionMsg.style.border = "1px solid #ced4da";
        }

        if (errorDetails) {
            detailsMsg.style.border = "1px solid #ff0000";
        } else {
            detailsMsg.style.border = "1px solid #ced4da";
        }

        swal.fire("Atenção!", "Preencha os campos obrigatórios", "warning");
    }
}

// recupera um registro pelo id
async function getMessageId(id){
    config.loaderPage();

    await api.get(`/messages/${id}`)
    .then(response => {
        state.descriptionMsg.value = response.data.description;
        state.detailsMsg.value = response.data.details;
        state.dataMessageId = response.data.id;
    }).catch(error => {
        if(error.response.status === 401){
            logout();
        } else {
            swal.fire("Erro!", "Não foi possível realizar a sua solicitação.", "error");
        }
    })

    swal.close();
}

// edita um registro existente
async function update() {
    config.loaderPage();

    formValidation.setRules(state.descriptionMsg.value, "descriptionMsg");
    formValidation.setRules(state.detailsMsg.value, "detailsMsg");

    if (formValidation.run()) {
        const chooseMessage = {
            description: state.descriptionMsg.value,
            details: state.detailsMsg.value,
        }

        await api.put(`/messages/${state.dataMessageId}`, chooseMessage)
        .then(response => { 
            if(response.request.status === 200) {
                swal.fire("Sucesso!", "Dados salvos com sucesso.", "success")
                clearAll();
                getAll();
            }
        }).catch(error => {
            if(error.response.status === 401){
                logout();
            } else {
                swal.fire("Erro!", "Não foi possível realizar a sua solicitação.", "error");
            }
        })
    } else {
        let errorDescription = formValidation.errorMessages.descriptionMsg;
        let errorDetails = formValidation.errorMessages.detailsMsg;

        if (errorDescription) {
            descriptionMsg.style.border = "1px solid #ff0000";
        } else {
            descriptionMsg.style.border = "1px solid #ced4da";
        }

        if (errorDetails) {
            detailsMsg.style.border = "1px solid #ff0000";
        } else {
            detailsMsg.style.border = "1px solid #ced4da";
        }

        swal.fire("Atenção!", "Preencha os campos obrigatórios", "warning");
    }
}

// exibi a modal com a pergunta de confirmação de exclusão
function openModalDelete(dataId){
    Swal.fire({
        title: "Deseja excluir este registro?",
        icon: "warning",
        showDenyButton: "Sim",
        denyButtonText: "Não",
    }).then((result) => {
        if(result.isConfirmed){
            deleteMessage(dataId);
        } else if (result.isDenied) {}
    })
}

// exclui o registro
async function deleteMessage(dataId){
    config.loaderPage();

    await api.delete(`/messages/${dataId}`)
    .then(response => {
        if(response.request.status === 200) {
            swal.fire("Sucesso!", "Registro excluído com sucesso.", "success");
            clearAll();
            getAll();
        }
    }).catch(error => {
        if(error.response.status === 401){
            logout();
        } else {
            swal.fire("Erro!", "Não foi possível realizar a sua solicitação.", "error");
        }

        swal.close();
    })
      
}

function populateTable(messages) {
    for (let i = 0; i < messages.length; i++) {
        let tr = (state.tbody).insertRow();
        
        let tdDescricao = tr.insertCell();
        let tdDetalhes = tr.insertCell();
        let tdAcoes = tr.insertCell();

        // Cria o botão de editar
        createButton(
            {
                action: "update",
                type: "button",
                class: "btn btn-primary me-1",
                attr: {
                    name: "onclick",
                    value: `getMessageId('${messages[i].id}')`,
                }
            },

            tdAcoes 
        );

        // Cria o botão de excluir
        createButton(
            {
                action: "delete",
                type: "button",
                class: "btn btn-danger",
                attr: {
                    name: "onclick",
                    value: `openModalDelete('${messages[i].id}')`,
                }
            },
            
            tdAcoes 
        );

        // insere os dados da tabela
        tdDescricao.innerText = messages[i].description;
        tdDetalhes.innerText = messages[i].details; 
        
        // tdId.className = "text-end";
        tdDescricao.className = "text-start";
        tdDetalhes.className = "text-start";
        tdAcoes.className = "text-center";
    }
}

//Cria um elemento button
function createButton(attributes, el) {
    let btn = document.createElement("button");

    btn.type = attributes.type;
    btn.className = attributes.class;
    btn.setAttribute(attributes.attr.name, attributes.attr.value);

    if (attributes.action === "update") {
        // cria um elemento ícone utilizando as classes do fontawesome
        let i = document.createElement("i");
        i.className = "fas fa-edit";
        
        btn.appendChild(i);
    }

    if (attributes.action === "delete") {
        // cria um elemento ícone utilizando as classes do fontawesome
        let i = document.createElement("i");
        i.className = "fas fa-trash-alt";
        
        btn.appendChild(i);
    }

    el.appendChild(btn);
}

// limpa tudo
function clearAll(){
    state.tbody.innerHTML = "";
    state.descriptionMsg.value = "";
    state.detailsMsg.value = "";

    state.descriptionMsg.style.border = "1px solid #ced4da";
    state.detailsMsg.style.border = "1px solid #ced4da";
    state.dataMessageId = null;
}