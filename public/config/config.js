const config = {
    logout() {
        localStorage.removeItem("token");
        window.location.href = "../index.html";
    }
}