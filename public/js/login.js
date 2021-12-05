const state = {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
}

function login() {
    const auth = {
        email: state.email.value,
        password: state.password.value
    }

    if(!auth.email || !auth.password) {
        swal.fire("Atenção!", "Preencha E-mail e Senha.", "warning");

        return false;
    }
    
    api.post("/users/auth", auth)
    .then(response => {
        if(response.request.status === 200){
            localStorage.setItem("token", response.data.token);
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

