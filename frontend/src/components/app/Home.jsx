import React from "react";
import AddPet from "./AddPet";
import "../../css/home.css";

export default function Home() {

    const [showAddForm, setShowAddForm] = React.useState(false);
    const [addSuccess, setAddSuccess] = React.useState(false);
    const [globalErr, setGlobalErr] = React.useState("");

    function setError(errorMessage) {

        if (errorMessage === "User not authenticated") {
            setGlobalErr("You must be logged in to perform this action.");
        }
        else {
            setGlobalErr(errorMessage);
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
                        setErrorMessage={setError} 
                        closeForm={() => setShowAddForm(false)}/>
                </div>
            }

        </main >
    );
}