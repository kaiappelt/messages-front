const config = {
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userSession");

        window.location.href = "../index.html";
    }, 

    loaderPage() {
        return Swal.fire({
            icon: 'info',
            title: 'Aguarde',
            html: '<i class="fa fa-spin fa-spinner"></i><br><h4>Processando...</h4>',
            allowOutsideClick: false,
            showConfirmButton: false,
        });
    }
}