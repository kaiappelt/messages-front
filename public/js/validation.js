const formValidation = {
    errorMessages: {},

    setRules: function(inputValue, field, displayField, count) {
        inputValue = inputValue.trim();

        field = field ? field : '';
        displayField = displayField ? displayField : '';
        count = count ? count : 0;

        if (! inputValue) {
            this.errorMessages[field] = `O campo ${displayField} é obrigatório.`;

            return false;
        } else {
            delete this.errorMessages[field];
        }

        if (count && count > 0) {
            if (inputValue.length < count) {
                this.errorMessages[field] = `O campo ${displayField} deve conter no mínimo ${count} caracteres.`;
            }
        }
    }, 

    confirmPasswords: function(passwordValue, confirmPasswordValue, field) {
        if (passwordValue !== confirmPasswordValue) {
            this.errorMessages[field] = `O campo confirmação de senha deve ser igual ao campo senha.`;

            return false;
        } else {
            delete this.errorMessages[field];
        }
    },

    run: function() {
        return ! Object.keys(this.errorMessages).length;
    }
} 