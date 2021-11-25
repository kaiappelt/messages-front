const state = {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
}

function login() {
    const auth = {
        email: state.email.value,
        password: state.password.value
    }
    
    api.post("/users/auth", auth)
    .then(response => {
        console.log(response)
    })
    .cath(error => {
        console.log(error)
    })

}

