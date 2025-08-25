import React from "react";
import "../../css/pet.css";
import { Image } from "react-bootstrap";
import Paw from "/src/images/paw.png";
import { MdOutlineMale, MdOutlineFemale, MdOutlineDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"

export default function PetList({ pets, setSuccessMsg, onPetDeleted, onPetSelected }) {

    if (!pets || pets.length === 0)
        return null;

    const MySwal = withReactContent(Swal)
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    async function handleDelete(e, id, name) {
        e.stopPropagation();

        const result = await MySwal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this pet?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6a9c89",
            cancelButtonColor: "#cd5c08",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            console.log("Deleting pet with ID:", id);

            const response = await fetch(`${API_URL}/pet/delete`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    name: name
                })
            });

            if (response.ok) {
                onPetDeleted();
                setSuccessMsg("Pet " + name + " deleted successfully");
            }
        }
    };

    const listItems = pets.map(pet => {

        const image = pet.imageURL ? pet.imageURL : Paw;

        return (
            <div key={pet.id} className="pet-card"
                role="button" tabIndex={0}
                onClick={() => onPetSelected(pet)}
            ><div><Image
                src={`${image}?t=${Date.now()}`}
                alt="pet-photo"
                roundedCircle
                className="pet-list-photo"
            /><span className="pet-name">{pet.name}</span>
                    {pet.sex
                        && pet.sex === "Male" &&
                        <MdOutlineMale color="#8dd5ea" />
                    }
                    {pet.sex
                        && pet.sex === "Female" &&
                        <MdOutlineFemale color="#f89ec9" />}
                </div>
                <MdOutlineDeleteForever size={20} className="dlt-pet-list-btn" onClick={(e) => handleDelete(e, pet.id, pet.name)} />
            </div>
        );
    }
    )

    return (
        <div className="pet-list-wrapper">
            <h2 className="pet-list-title">Your Pets</h2>
            <div className="pet-list-container">{listItems}</div>
        </div>
    )
}