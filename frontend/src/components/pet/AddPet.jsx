import React from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "../../css/pet.css";
import { validateFile } from "../utils/validate";
import { handleApiFormErrors } from "../utils/error";

export default function AddPet({ setAddSuccess, setGlobalErrorMessage, closeForm, onPetAdded }) {

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        reset
    } = useForm();

    const addPet = (formData) => {

        const token = localStorage.getItem("token");

        console.log(formData)
        const API_URL = import.meta.env.VITE_API_URL;

        const formDataObj = new FormData();

        formDataObj.append("name", formData.name);
        formDataObj.append("sex", formData.sex);
        formDataObj.append("birthDate", formData.birthDate);

        if (formData.photo && formData.photo.length > 0) {
            formDataObj.append("photo", formData.photo[0]);
        }

        try {
            fetch(`${API_URL}/pets/add`, {

                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formDataObj
            })
                .then(async response => {
                    if (response.ok) {
                        console.log("New pet " + formData.name + "added!")
                        setAddSuccess();
                        closeForm();
                        reset();
                        onPetAdded();
                        clearErrors();
                    } else {
                        const data = await response.json();
                        if (data.errors)
                            handleApiFormErrors(data.errors, { setGlobalErrorMessage, setError });
                    }

                });
        }
        catch (error) {
            setErrorMessage("Internal server error");
            throw new Error("Internal server error");
        }
    }

    return (

        <div className="add-pet-container">
            <Form className="add-pet-form" onSubmit={handleSubmit(addPet)}>
                <FloatingLabel controlId="name" label="Name" className="mb-3" >
                    <Form.Control
                        type="text"
                        placeholder="Name"
                        {...register("name", {
                            required: "Name is required.",
                            minLength: {
                                value: 2,
                                message: "Name must be at least 2 characters.",
                            },
                            maxLength: {
                                value: 30,
                                message: "Name must be at most 30 characters.",
                            },
                            pattern: {
                                value: /^[A-Z][a-zA-Z]*(?: [a-zA-Z]+)*$/,
                                message: "Name must start with uppercase and contain only letters and spaces",
                            }
                        })}
                        isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.name?.message}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel controlId="sex" label="Sex" className="mb-3">
                    <Form.Select
                        {...register("sex", {
                            minLength: {
                                value: 3,
                                message: "Sex must be at least 4 characters.",
                            },
                            maxLength: {
                                value: 6,
                                message: "Sex must be at most 6 characters.",
                            },
                            pattern: {
                                value: /^[A-Z][a-zA-Z]*$/,
                                message: "Sex must start with uppercase and contain only letters",
                            }
                        })}
                        isInvalid={!!errors.sex}
                        defaultValue=""
                    >
                        <option value="" disabled>Select sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors.sex?.message}
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

                <FloatingLabel controlId="photo" label="Photo" className="mb-3">
                    <Form.Control
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        isInvalid={!!errors.photo}
                        className="photo-field"
                        {...register("photo", {
                            validate: {
                                fileValidation: (files) => {
                                    if (!files || files.length === 0) return true;
                                    const file = files[0];
                                    return validateFile(file);
                                },
                            },
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.photo?.message}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <Form.Control.Feedback type="invalid">
                    {errors.photo?.message}
                </Form.Control.Feedback>

                <Button type="submit" variant="primary" className="w-100 add-pet-btn">
                    Add
                </Button>
            </Form>
        </div>

    );
}