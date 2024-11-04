// bloodRequestValidation.js

const bloodRequestValidation = (data) => {
    const errors = {};

    // Request Blood Bank Name
    if (!data.requestBloodBank.trim()) {
        errors.requestBloodBank = "Blood bank name is required";
    }

    // Blood Group Selection
    if (!data.requestBlood) {
        errors.requestBlood = "Blood group selection is required";
    }

    // Blood Quantity
    if (!data.bloodQuantity) {
        errors.bloodQuantity = "Blood quantity is required";
    } else if (data.bloodQuantity <= 0) {
        errors.bloodQuantity = "Blood quantity must be greater than 0";
    }

    // Urgency Level
    if (!data.urgencyLevel) {
        errors.urgencyLevel = "Urgency level selection is required";
    }

    // Person Name to Contact
    if (!data.personNameToContact.trim()) {
        errors.personNameToContact = "Contact person's name is required";
    } else if (data.personNameToContact.length < 3) {
        errors.personNameToContact = "Contact person's name must be at least 3 characters";
    }

    // Person Number to Contact
    if (!data.personNumberToContact) {
        errors.personNumberToContact = "Contact person's phone number is required";
    } else if (!/^\d{10}$/.test(data.personNumberToContact)) {
        errors.personNumberToContact = "Phone number must be 10 digits";
    }

    // State Selection
    if (!data.selectedState) {
        errors.selectedState = "State selection is required";
    }

    // District Selection
    if (!data.selectedDistrict) {
        errors.selectedDistrict = "District selection is required";
    }

    // Taluq Selection
    if (!data.selectedTaluq) {
        errors.selectedTaluq = "Taluq selection is required";
    }

    // City Selection
    if (!data.selectedCity) {
        errors.selectedCity = "City selection is required";
    }

    // Preferred Donor Distance
    if (!data.preferredDonorDistance) {
        errors.preferredDonorDistance = "Preferred donor distance selection is required";
    }

    // Additional Notes (optional, but adding a length limit)
    if (data.additionalNotes && data.additionalNotes.length > 200) {
        errors.additionalNotes = "Additional notes must be under 200 characters";
    }

    return errors;
};

export default bloodRequestValidation;
