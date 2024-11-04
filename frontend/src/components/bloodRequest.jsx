import { useEffect, useState } from 'react';
import bloodRequestValidation from "./bloodRequestValidation";
import axios from 'axios';

const BloodRequest = () => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [errors, setErrors] = useState({});
    const [generatedIds, setGeneratedIds] = useState(new Set());
    const [sortedDonar, setSortedDonors] = useState(null);
    const [requestData, setRequestData] = useState({
        requestId: '',
        requestBloodBank: user?.bloodBankName || '',
        requestBlood: '',
        bloodQuantity: '',
        personNameToContact: '',
        personNumberToContact: user?.bloodBankMobileNumber || '',
        urgencyLevel: '',
        selectedState: user?.bloodBankState || '',
        selectedDistrict: user?.bloodBankDistrict || '',
        selectedTaluq: user?.bloodBankTaluq || '',
        selectedCity: user?.bloodBankCity || '',
        preferredDonorDistance: '',
        additionalNotes: ''
    });

    const generateUniqueRequestId = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let requestId = '';
        do {
            requestId = '';
            for (let i = 0; i < 6; i++) {
                requestId += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        } while (generatedIds.has(requestId));
        setGeneratedIds((prevIds) => new Set(prevIds).add(requestId));
        return requestId;
    };

    useEffect(() => {
        if (!user) {
            setUser(null);
        } else {
            setRequestData((prevData) => ({
                ...prevData,
                requestId: generateUniqueRequestId(),
            }));
        }
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRequestData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleVerify = (event) => {
        event.preventDefault();
        const validationErrors = bloodRequestValidation(requestData);
        setErrors(validationErrors);
        console.table(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            axios.post("http://127.0.0.1:8081/blood-request-verify", requestData)
                .then(response => {
                    setSortedDonors(response.data.donorCount);
                })
                .catch(error => {
                    const errorMessage = error.response
                        ? error.response.data.error || "An error occurred while verifying the request."
                        : "Network error. Please try again.";
                    alert(errorMessage); // Display error message
                });
        } else {
            alert("Please fix the validation errors before proceeding."); // Alert for validation errors
        }
    }

    const resetForm = () => {
        setRequestData({
            requestId: generateUniqueRequestId(),
            requestBloodBank: user?.bloodBankName || '',
            requestBlood: '',
            bloodQuantity: '',
            personNameToContact: '',
            personNumberToContact: user?.bloodBankMobileNumber || '',
            urgencyLevel: '',
            selectedState: user?.bloodBankState || '',
            selectedDistrict: user?.bloodBankDistrict || '',
            selectedTaluq: user?.bloodBankTaluq || '',
            selectedCity: user?.bloodBankCity || '',
            preferredDonorDistance: '',
            additionalNotes: ''
        });
        setSortedDonors(null);
        setErrors({});
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const messageContent = `
            Dear Donor,
            We urgently require ${requestData.bloodQuantity} units of ${requestData.requestBlood} blood for ${requestData.requestBloodBank}.
            Please reach out to ${requestData.personNameToContact} at ${requestData.personNumberToContact} if you are able to assist. This request is marked as ${requestData.urgencyLevel}.
            Thank you for your support in saving lives!
            Additional notes: ${requestData.additionalNotes || 'None'}.`;

        axios.post("http://127.0.0.1:8081/send-blood-request", { ...requestData, message: messageContent })
            .then(response => {
                alert(response.data.message);
                resetForm();
            })
            .catch(error => {
                const errorMessage = error.response
                    ? error.response.data.message || "An error occurred while sending the blood request."
                    : "Network error. Please try again.";
                alert(errorMessage); // Display error message
            });
    }

    return (
        <>
            <div><h1><b><i><u><marquee>Request Blood</marquee></u></i></b></h1></div>

            <form action="" onSubmit={handleVerify}>
                <label htmlFor="requestId">Request Id: </label>
                <input type="text" name="requestId" id="requestId" placeholder="Request Id" value={requestData.requestId} readOnly />
                {errors.requestId && <span className='errorshow'>{errors.requestId}</span>}

                <label htmlFor="requestBloodBank">Bloodbank/Hospital Name: </label>
                <input type="text" name="requestBloodBank" id="requestBloodBank" placeholder="Blood bank name" value={requestData.requestBloodBank} onChange={handleChange} />
                {errors.requestBloodBank && <span className='errorshow'>{errors.requestBloodBank}</span>}

                <label htmlFor="requestBlood">Select Blood Group: </label>
                <select name="requestBlood" id="requestBlood" value={requestData.requestBlood} onChange={handleChange}>
                    <option value="" disabled>Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O+">O+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                    <option value="O-">O-</option>
                </select>
                {errors.requestBlood && <span className='errorshow'>{errors.requestBlood}</span>}

                <label htmlFor="bloodQuantity">Blood Quantity Needed (in units): </label>
                <input type="number" name="bloodQuantity" id="bloodQuantity" placeholder="Enter quantity" value={requestData.bloodQuantity} onChange={handleChange} min="1" />
                {errors.bloodQuantity && <span className='errorshow'>{errors.bloodQuantity}</span>}

                <label htmlFor="urgencyLevel">Urgency Level: </label>
                <select name="urgencyLevel" id="urgencyLevel" value={requestData.urgencyLevel} onChange={handleChange}>
                    <option value="" disabled>Select Urgency Level</option>
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical</option>
                </select>
                {errors.urgencyLevel && <span className='errorshow'>{errors.urgencyLevel}</span>}

                <label htmlFor="personNameToContact">Person Name to Contact: </label>
                <input type="text" name="personNameToContact" id="personNameToContact" placeholder="Person name to contact" value={requestData.personNameToContact} onChange={handleChange} />
                {errors.personNameToContact && <span className='errorshow'>{errors.personNameToContact}</span>}

                <label htmlFor="personNumberToContact">Person Number to Contact: </label>
                <input type="tel" name="personNumberToContact" id="personNumberToContact" placeholder="Person number to contact" value={requestData.personNumberToContact} onChange={handleChange} />
                {errors.personNumberToContact && <span className='errorshow'>{errors.personNumberToContact}</span>}

                <label htmlFor="selectState">State: </label>
                <select name="selectedState" id="selectState" value={requestData.selectedState} onChange={handleChange}>
                    <option value="" disabled>Select State</option>
                    <option value="Karnataka">Karnataka</option>
                </select>
                {errors.selectedState && <span className='errorshow'>{errors.selectedState}</span>}

                <label htmlFor="selectDistrict">District: </label>
                <select name="selectedDistrict" id="selectDistrict" value={requestData.selectedDistrict} onChange={handleChange}>
                    <option value="" disabled>Select District</option>
                    <option value="Haveri">Haveri</option>
                </select>
                {errors.selectedDistrict && <span className='errorshow'>{errors.selectedDistrict}</span>}

                <label htmlFor="selectTaluq">Taluq: </label>
                <select name="selectedTaluq" id="selectTaluq" value={requestData.selectedTaluq} onChange={handleChange}>
                    <option value="" disabled>Select Taluq</option>
                    <option value="Haveri">Haveri</option>
                </select>
                {errors.selectedTaluq && <span className='errorshow'>{errors.selectedTaluq}</span>}

                <label htmlFor="selectCity">City: </label>
                <select name="selectedCity" id="selectCity" value={requestData.selectedCity} onChange={handleChange}>
                    <option value="" disabled>Select City</option>
                    <option value="Devihosur">Devihosur</option>
                    <option value="Haveri">Haveri</option>
                    <option value="Chikkabasur">Chikkabasur</option>
                </select>
                {errors.selectedCity && <span className='errorshow'>{errors.selectedCity}</span>}

                <label htmlFor="preferredDonorDistance">Preferred Donor Distance: </label>
                <select name="preferredDonorDistance" id="preferredDonorDistance" value={requestData.preferredDonorDistance} onChange={handleChange}>
                    <option value="" disabled>Select Distance</option>
                    <option value="withinCity">Within City</option>
                    <option value="withinTaluq">Within Taluq</option>
                    <option value="withinDistrict">Within District</option>
                    <option value="withinState">Within State</option>
                </select>
                {errors.preferredDonorDistance && <span className='errorshow'>{errors.preferredDonorDistance}</span>}

                <label htmlFor="additionalNotes">Additional Notes: </label>
                <textarea name="additionalNotes" id="additionalNotes" placeholder="Enter any additional information" value={requestData.additionalNotes} onChange={handleChange} />
                {errors.additionalNotes && <span className='errorshow'>{errors.additionalNotes}</span>}

                <button type='submit'>Verify</button>
            </form>

            {sortedDonar !== null && (
                <div>
                    {sortedDonar > 0 ? (
                        <div>
                            <h2>Donors Available</h2>
                            <p>We are pleased to inform you that there are currently <strong>{sortedDonar}</strong> donors available for the requested blood type, <strong>{requestData.requestBlood}</strong>.</p>
                            <p>To proceed, please review the request summary below and confirm if you would like to send out a notification to the available donors.</p>
                        </div>
                    ) : (
                        <p>We regret to inform you that there are currently no donors available for the requested blood type, {requestData.requestBlood}. Please feel free to check back later or consider requesting a different blood type. Thank you for your understanding.</p>
                    )}
                </div>
            )}


            {sortedDonar > 0 && (
                <>
                    <h2>Request Summary:</h2>
                    <p>
                        Dear Donor,<br /><br />
                        We urgently require <strong>{requestData.bloodQuantity} units</strong> of <strong>{requestData.requestBlood}</strong> blood for <strong>{requestData.requestBloodBank}</strong>.<br /><br />
                        Please reach out to <strong>{requestData.personNameToContact}</strong> at <strong>{requestData.personNumberToContact}</strong> if you are able to assist. This request is marked as <em>{requestData.urgencyLevel}</em>.<br /><br />
                        Thank you for your support in saving lives!<br /><br />
                        Additional notes: <em>{requestData.additionalNotes || 'None'}</em>.
                    </p>
                    <button type='submit' onClick={handleSubmit}>Send Request</button>
                </>
            )}
        </>
    );
};

export default BloodRequest;
