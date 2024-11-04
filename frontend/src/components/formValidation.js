const validation = (values, termsAccepted, formType) => {
    let error = {};

    // Regex pattern for validations
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@_#]{8,}$/;
    const mobileNumberPattern = /^\d{10}$/;

    // Email validation
    if (values.email === "") {
        error.email = "Please enter a valid email";
    } else if (values.email && !emailPattern.test(values.email)) {
        error.email = "Please enter a valid email";
    }

    if (formType === "donar") {
        // age validation 
        if (values.age === "") {
            error.age = "Please enter a age between 18 and 65";
        } else {
            const age = parseInt(values.age, 10);
            if (isNaN(age) || age < 18 || age > 65) {
                error.age = `Please enter a valid age between 18 and 65`;
            }
        }

        // blood validation
        if (values.selectedBlood === "") {
            error.selectedBlood = "Please select the blood group";
        }

        // gender validation
        if (values.selectedGender === "") {
            error.selectedGender = "Please select the gender";
        }
    }

    if (formType === "donar" || formType === "bloodBank") {
        // Mobile number validation
        if (values.mobileNumber === "") {
            error.mobileNumber = "Enter the 10 digit valid number";
        } else if (!mobileNumberPattern.test(values.mobileNumber)) {
            error.mobileNumber = "Enter 10 digit valid number";
        }

        // Password validation
        if (values.password === "") {
            error.password = "Password should not be empty";
        }// else if (!passwordPattern.test(values.password)) {
        //     error.email = "The pattern requires at least one uppercase letter, one digit, and a total of eight or more characters from letters, digits, and the symbols @, _, or #";
        // }

        //Name validation
        if (values.name === "") {
            error.name = "Name should not be empty";
        }

        //state validation 
        if (values.selectedState === "") {
            error.selectedState = "Please select the state";
        }

        //District validation 
        if (values.selectedDistrict === "") {
            error.selectedDistrict = "Please select the District";
        }

        //Taluq validation 
        if (values.selectedTaluq === "") {
            error.selectedTaluq = "Please select the Taluq";
        }

        //City validation
        if (values.selectedCity === "") {
            error.selectedCity = "Please select the City";
        }

        //Address validation
        if (values.address === "") {
            error.address = "address should not be empty"
        }

        // Password match validation
        if (values.password !== values.confirmPassword) {
            error.confirmPassword = "Passwords didn't match";
        }

        // Checkbox validation
        if (!termsAccepted) {
            error.checkbox = "You must accept the terms and conditions";
        }

    }
    return error;
};

export default validation;
