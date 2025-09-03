import React from "react";
import PetForm from "../pet/PetForm"
import PetList from "../pet/PetList";
import "../../css/home.css";
import { handleApiFormErrors } from "../utils/error";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";

export default function Home() {

    const {
        clearErrors,
    } = useForm();

    const [showPetForm, setShowPetForm] = React.useState(false);
    const [actionSuccess, setActionSuccess] = React.useState(false);
    const [globalErr, setGlobalErr] = React.useState("");
    const [successMsg, setSuccessMsg] = React.useState("");
    const [pets, setPets] = React.useState([]);
    const [selectedPet, setSelectedPet] = React.useState(null);

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    React.useEffect(() => {
        console.log("useEffect triggered");
        getPets();
    }, [])

    function setGlobalErrorMessage(errorMessage) {

        if (errorMessage === "User not authenticated") {
            setGlobalErr("Please log in to continue.");
        }
        else {
            setGlobalErr(errorMessage);
        }
    }

    async function getPets() {

        console.log("getPets triggered");
        console.log("old pets" + JSON.stringify(pets, null, 2));

        const response = await fetch(`${API_URL}/pet/all`, {

            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        const petList = await response.json();

        if (response.ok) {
            setPets(petList.map(pet => ({ ...pet })));
            console.log("new pets " + JSON.stringify(petList, null, 2));
        }
        else {
            if (petList.errors)
                handleApiFormErrors(petList.errors, { setGlobalErrorMessage });
        }
    }

    function handlePetSelect(pet) {
        console.log("Pet clicked for editing " + pet.name + " id : " + pet.id)
        console.log(pet);
        setSelectedPet(pet);
        setShowPetForm(true);
    }

    return (
        <main>
            {
                successMsg &&
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMsg}
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                        onClick={() => setSuccessMsg("")}
                    ></button>
                </div>
            }
            {
                globalErr &&
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {globalErr}
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                        onClick={() => clearErrors("global")}
                    ></button>
                </div>
            }
            <div className="pet-container">
                <div>
                    <PetList
                        pets={pets}
                        setSuccessMsg={setSuccessMsg}
                        onPetDeleted={() => {
                            setShowPetForm(false); 
                            setSelectedPet(null); 
                            getPets();
                        }}
                        onPetSelected={handlePetSelect} />

                    {!showPetForm && (
                        <div className="add-pet-card" role="button"
                            tabIndex={0}
                            onClick={() => setShowPetForm(true)}
                        >
                            + Add Pet
                        </div>
                    )}
                </div>
                {showPetForm &&
                    <div className="add-pet-form-card">
                        <button
                            onClick={() => setShowPetForm(false)}
                            className="btn btn-outline-secondary mb-3 close-add-form"
                        >
                            <IoMdClose />
                        </button>
                        <PetForm
                            selectedPet={selectedPet}
                            mode={selectedPet ? 'edit' : 'add'}
                            formConfig={{
                                setActionSuccess: () => setActionSuccess(true),
                                setSuccessMsg: setSuccessMsg,
                                setGlobalErrorMessage: setGlobalErrorMessage,
                                closeForm: () => { setShowPetForm(false), setSelectedPet(null) },
                                updatePetList: getPets,
                            }} />
                    </div>
                }
            </div>

        </main >
    );
}