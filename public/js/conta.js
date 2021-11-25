const html = {
    get(element) {
        return document.getElementById(element);
    }
}

const state = {
    emailForm: html.get("emailForm"),
    passwordForm: html.get("password"),
    confirmPasswordForm: html.get("confirmPassword"),

    emailError: html.get("emailError"),
    passwordError: html.get("passwordError"),
    confirmPasswordError: html.get("confirmPasswordError")
}

function insertUser() {
    const newUser = {
        email: state.emailForm.value,
        password: state.passwordForm.value,
        password_confirmation: state.confirmPasswordForm.value
    }
    
    api.post("/users", newUser)
    .then(response => {
        const status = response.request.status;

        if(status === 200){
            successMessage();
        } 
    })
    .catch((error) => {
        validationErrorServer(error.response);
    }) 
}

function successMessage() {
    Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        html: 'Cadastro realizado com sucesso.'
    }).then(() => window.location.href = '../index.html');
}

function errorMessage() {
    Swal.fire({
        icon: 'error',
        title: 'Erro!',
        html: 'Não foi possível realizar sua solicitação.'
    });
}

function validationErrorServer(response) {
    if(response.status === 400) {
        const field = response.data.validation.body.keys[0];

        switch(field) {
            case "email" :
                state.emailError.innerHTML = "Digite um E-mail válido.";
            break;
            case "password" :
                state.passwordError.innerHTML = "O campo senha é obrigatório.";
            break;
            case "password_confirmation" :
                state.passwordError.innerHTML = "O campo confirmação de senha deve ser igual ao campo senha.";
            break;    
        }
    }

    else if(response.status === 412) {
        state.emailError.innerHTML = "O E-mail digitado já existe.";
    } 
    else {
        errorMessage();
    }
}