import React from "react";
import AddPet from "../pet/AddPet"
import PetList from "../pet/PetList";
import "../../css/home.css";
import { handleApiFormErrors } from "../utils/error";
import { IoMdClose } from "react-icons/io";

export default function Home() {

    const [showAddForm, setShowAddForm] = React.useState(false);
    const [addSuccess, setAddSuccess] = React.useState(false);
    const [globalErr, setGlobalErr] = React.useState("");
    const [successMsg, setSuccessMsg] = React.useState("");
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
        const response = await fetch(`${API_URL}/pet/all`, {

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
                        onPetDeleted={getPets} />

                    {!showAddForm && (
                        <div className="add-pet-card" role="button"
                            tabIndex={0}
                            onClick={() => setShowAddForm(true)}
                        >
                            + Add Pet
                        </div>
                    )}
                </div>
                {showAddForm &&
                    <div className="add-pet-form-card">
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="btn btn-outline-secondary mb-3 close-add-pet"
                        >
                            <IoMdClose />
                        </button>
                        <AddPet
                            setAddSuccess={() => setAddSuccess(true)}
                            setSuccessMsg={setSuccessMsg}
                            setGlobalErrorMessage={setGlobalErrorMessage}
                            closeForm={() => setShowAddForm(false)}
                            onPetAdded={getPets} />
                    </div>
                }
            </div>

        </main >
    );
}