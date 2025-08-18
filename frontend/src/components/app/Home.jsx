import React from "react";
import AddPet from "../pet/AddPet"
import PetList from "../pet/PetList";
import "../../css/home.css";
import { handleApiFormErrors } from "../utils/error";

export default function Home() {

    const [showAddForm, setShowAddForm] = React.useState(false);
    const [addSuccess, setAddSuccess] = React.useState(false);
    const [globalErr, setGlobalErr] = React.useState("");
    const [pets, setPets] = React.useState([]);

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
        const response = await fetch(`${API_URL}/pets`, {

            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        const petList = await response.json();
        console.log(petList);

        if (response.ok) {
            setPets(petList);
        }
        else {
            if (petList.errors)
                handleApiFormErrors(petList.errors, { setGlobalErrorMessage });
        }
    }

    return (
        <main>
            {
                addSuccess &&
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    New pet added successfully!
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                        onClick={() => setAddSuccess(false)}
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
            <PetList pets={pets} />
            {!showAddForm && (
                <div className="add-pet-card" role="button"
                    tabIndex={0}
                    onClick={() => setShowAddForm(true)}
                >
                    + Add Pet
                </div>
            )}
            {showAddForm &&
                <div className="add-pet-form-card">
                    <button
                        onClick={() => setShowAddForm(false)}
                        className="btn btn-outline-secondary mb-3 close-add-pet"
                    >
                        ✕
                    </button>
                    <AddPet
                        setAddSuccess={() => setAddSuccess(true)}
                        setGlobalErrorMessage={setGlobalErrorMessage}
                        closeForm={() => setShowAddForm(false)}
                        onPetAdded={getPets} />
                </div>
            }

        </main >
    );
}