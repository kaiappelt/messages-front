const state = {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
}

async function login() {
    config.loaderPage();

    const auth = {
        email: state.email.value,
        password: state.password.value
    }

    if(!auth.email || !auth.password) {
        swal.fire("Atenção!", "Preencha E-mail e Senha.", "warning");

        return false;
    }
    
    await api.post("/auth", auth)
    .then(response => {
        if(response.request.status === 200){
            populateSession(response.data);

            window.location.href = "../pages/recados.html";
        }
    })
    .catch(error => {
        if(error.response.status === 400) {
            swal.fire("Atenção!", "Digite um e-mail válido.", "warning");
        }
        else if(error.response.status === 401){
            swal.fire("Atenção!", "E-mail ou senha incorretos.", "warning");
        }
        else {
            swal.fire("Erro!", "Não foi possível realizar a sua solicitação.", "error");
        }
    })
}

function populateSession(response) {
    const userSession = JSON.stringify(response.user);

    localStorage.setItem("token", response.token);
    localStorage.setItem("userSession", userSession);
}

