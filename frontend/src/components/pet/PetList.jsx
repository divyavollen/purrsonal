import React from "react";
import "../../css/pet.css";
import { Image } from "react-bootstrap";
import Paw from "/src/images/paw.png";
import { MdOutlineMale, MdOutlineFemale } from 'react-icons/md';

export default function PetList({ pets }) {

    if (!pets || pets.length === 0)
        return null;

    const listItems = pets.map(pet => {

        const image = pet.imageURL ? pet.imageURL : Paw;

        return (
            <div key={pet.id} className="pet-card"
                role="button" tabIndex={0}
                onClick={() => console.log("pet " + pet.name + " clicked!")}
            ><Image
                    src={image}
                    alt="pet-photo"
                    roundedCircle
                    className="pet-photo"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImage;
                    }}
                /><span className="pet-name">{pet.name}</span>
                {pet.sex
                    && pet.sex === 'Male' &&
                    <MdOutlineMale color="#8dd5ea" s />
                }
                {pet.sex
                    && pet.sex === 'Female' &&
                    <MdOutlineFemale color="#f89ec9" />}
            </div>
        );
    }
    )

    return (
        <>
            <p>Your Pets</p>
            <div className="pet-list-container">{listItems}</div>
        </>
    )
}