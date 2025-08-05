import React from "react";
import { useForm } from "react-hook-form";
import { Form, FloatingLabel, Button } from "react-bootstrap";

export default function AddPet() {

    const [added, setAdded] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        reset
    } = useForm();

    const addPet = (formData) => {

        const token = localStorage.getItem('token');

        console.log(formData)
        const API_URL = import.meta.env.VITE_API_URL;

        fetch(`${API_URL}/pets/add`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
            .then(async response => {
                if (response.ok) {
                    setAdded(true);
                    reset();
                    clearErrors();
                } else {
                    const data = await response.json();
                    const firstErrorsByField = {};

                    data.errors.forEach(({ field, message }) => {
                        if (!firstErrorsByField[field]) {
                            firstErrorsByField[field] = message;
                        }
                    });

                    Object.entries(firstErrorsByField).forEach(([field, message]) => {
                        console.error(`Error in field ${field}: ${message}`);

                        if(field === "global" && message === "User not authenticated") {
                            message = "You must be logged in to add a pet.";
                        }

                        setError(field, { type: "server", message });
                    });

                    throw new Error("Failed to add pet");
                }

            });
    }

    return (
        <Form onSubmit={handleSubmit(addPet)}>

            {
                added &&
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    New pet added successfully!
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                        onClick={() => setAdded(false)}
                    ></button>
                </div>
            }
            {
                errors.global &&
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {errors.global.message}
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                        onClick={() => clearErrors("global")}
                    ></button>
                </div>
            }
            <FloatingLabel controlId="name" label="Name" className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Name"
                    {...register("name"
                    //     , {
                    //     required: "Name is required.",
                    //     minLength: {
                    //         value: 2,
                    //         message: "Name must be at least 2 characters.",
                    //     },
                    //     maxLength: {
                    //         value: 30,
                    //         message: "Name must be at most 30 characters.",
                    //     },
                    //     pattern: {
                    //         value: /^[A-Z][a-zA-Z]*(?: [a-zA-Z]+)*$/,
                    //         message: "Name must start with uppercase and contain only letters and spaces",
                    //     }
                    // }
                )}
                    isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId="species" label="Species" className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Species"
                    {...register("species", {
                        required: "Species is required.",
                        minLength: {
                            value: 3,
                            message: "Species must be at least 3 characters.",
                        },
                        maxLength: {
                            value: 30,
                            message: "Species must be at most 30 characters.",
                        },
                        pattern: {
                            value: /^[A-Z][a-zA-Z]*(?: [a-zA-Z]+)*$/,
                            message: "Species must start with uppercase and contain only letters and spaces",
                        }
                    })}
                    isInvalid={!!errors.species}
                />
                <Form.Text muted>E.g. Cat, Dog</Form.Text>
                <Form.Control.Feedback type="invalid">
                    {errors.species?.message}
                </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId="breed" label="Breed" className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Breed"
                    {...register("breed", {
                        minLength: {
                            value: 3,
                            message: "Breed must be at least 3 characters.",
                        },
                        maxLength: {
                            value: 30,
                            message: "Breed must be at most 30 characters.",
                        },
                        pattern: {
                            value: /^[A-Z][a-zA-Z]*(?: [a-zA-Z]+)*$/,
                            message: "Breed must start with uppercase and contain only letters and spaces",
                        }
                    })}
                    isInvalid={!!errors.breed}
                />
                <Form.Text muted >E.g. Siamese, Mixed</Form.Text>
                <Form.Control.Feedback type="invalid">
                    {errors.breed?.message}
                </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId="furColour" label="Fur Colour" className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Fur Colour"
                    {...register("furColour", {
                        minLength: {
                            value: 3,
                            message: "Fur Colour must be at least 3 characters.",
                        },
                        maxLength: {
                            value: 30,
                            message: "Fur Colour must be at most 30 characters.",
                        },
                        pattern: {
                            value: /^[A-Z][a-zA-Z]*(?: [a-zA-Z]+)*$/,
                            message: "Fur Colour must start with uppercase and contain only letters and spaces",
                        }
                    })}
                    isInvalid={!!errors.furColour}
                />
                <Form.Text muted>E.g Calico, Tabby</Form.Text>
                <Form.Control.Feedback type="invalid">
                    {errors.furColour?.message}
                </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId="birthDate" label="Birthday" className="mb-3">
                <Form.Control
                    type="date"
                    placeholder="Birthday"
                    {...register("birthDate", {
                        required: "Birthday is required."
                    })}
                    isInvalid={!!errors.birthDate}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.birthDate?.message}
                </Form.Control.Feedback>
            </FloatingLabel>

            <Button type="submit" variant="primary" className="w-100 register-btn">
                Add
            </Button>
        </Form>
    );
}