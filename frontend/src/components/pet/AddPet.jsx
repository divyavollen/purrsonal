import React from "react";
import PetForm from "./PetForm";

export default function AddPet({ onSuccess }) {

    const [success, setSuccess] = useState(false);

    async function handleAddPet(formData) {

        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;

        const response = await fetch(`${API_URL}/pets/add`, {

            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        if (response.ok) {
        }
        else {

            if (data.errors) {
                throw { errors: data.errors };
            } else {
                throw new Error(data.message || "Failed to add pet.");
            }
        }
    }
}


return (
    <div>
        {
            success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    New pet added successfully!
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setSuccess(false)}
                    />
                </div>
            )}
        <PetForm
            mode="add"
            onSubmit={handleAddPet}
            onSuccess={() => setSuccess(true)}
            submitLabel="Add Pet" />
    </div>
);
}