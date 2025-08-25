import React from "react";
import { Button, FloatingLabel, Form, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "../../css/pet.css";
import { handleApiFormErrors } from "../utils/error";
import Paw from "/src/images/paw.png"
import ReactFileReader from "react-file-reader";
import { FiCamera } from "react-icons/fi";

export default function PetForm({ formConfig, mode, selectedPet }) {

    const {
        setActionSuccess,
        setGlobalErrorMessage,
        closeForm,
        updatePetList,
        setSuccessMsg
    } = formConfig;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
        clearErrors,
        reset
    } = useForm();

    const [preview, setPreview] = React.useState(Paw);
    const [uploadedFile, setUploadedFile] = React.useState(null);
    const [isPhotoUpdated, setIsPhotoUpdated] = React.useState(false);

    React.useEffect(() => {

        if (selectedPet && mode === 'edit') {

            console.log("Pet edit mode " + selectedPet.name, + " id : " + selectedPet.id);

            if (selectedPet.imageURL) {
                setPreview(selectedPet.imageURL);
                setValue("photo", selectedPet.imageURL);
            }

            reset({
                name: selectedPet.name || "",
                sex: selectedPet.sex || "",
                birthDate: selectedPet.birthDate || "",
                photo: selectedPet.photo || "",
            });
        } else {
            reset();
        }
    }, [selectedPet, reset, setValue]);


    const handleFiles = (files) => {
        setPreview(files.base64);
        setUploadedFile(files.fileList[0]);
        setValue("photo", files.fileList[0]);
        setIsPhotoUpdated(true);
    };

    const addPet = (formData) => {

        const token = localStorage.getItem("token");

        console.log(formData)
        const API_URL = import.meta.env.VITE_API_URL;

        const formDataObj = new FormData();

        formDataObj.append("name", formData.name);
        formDataObj.append("sex", formData.sex);
        formDataObj.append("birthDate", formData.birthDate);

        if (uploadedFile) {
            formDataObj.append("photo", uploadedFile);
        }

        try {
            if (mode === 'add') {
                fetch(`${API_URL}/pet/add`, {

                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formDataObj
                })
                    .then(async response => {
                        if (response.ok) {
                            console.log("New pet " + formData.name + "added!")
                            setActionSuccess();
                            setSuccessMsg("New pet added succesfully!");
                            closeForm();
                            reset();
                            console.log("Calling update pet list");
                            updatePetList();
                            clearErrors();
                        } else {
                            const data = await response.json();
                            if (data.errors)
                                handleApiFormErrors(data.errors, { setGlobalErrorMessage, setError });
                        }
                    });
            }
            else if (mode === 'edit') {

                console.log("Updating pet " + selectedPet.id);

                formDataObj.append("id", selectedPet.id);
                formDataObj.append("isPhotoUpdated", isPhotoUpdated);

                fetch(`${API_URL}/pet/update`, {

                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formDataObj
                })
                    .then(async response => {
                        if (response.ok) {
                            console.log("Details for " + formData.name + " update!")
                            setActionSuccess();
                            setSuccessMsg("Pet details updated succesfully!");
                            closeForm();
                            reset();
                            updatePetList();
                            clearErrors();
                        } else {
                            const data = await response.json();
                            if (data.errors)
                                handleApiFormErrors(data.errors, { setGlobalErrorMessage, setError });
                        }

                    });
            }
        }
        catch (error) {
            setErrorMessage("Internal server error");
            throw new Error("Internal server error");
        }
    }

    return (

        <div className="add-pet-container">
            <Form className="add-pet-form" onSubmit={handleSubmit(addPet)}>

                <ReactFileReader
                    fileTypes={[".png", ".jpg"]}
                    multipleFiles={false}
                    base64={true}
                    handleFiles={handleFiles}
                >
                    <input type="hidden" {...register("photo")} />
                    <div className="pet-photo-container">
                        <h2>Add Pet</h2>
                        <div className="preview-container">
                            <Image
                                src={preview}
                                alt="pet-photo"
                                roundedCircle
                            />
                            <div className="camera-icon-wrapper">
                                <FiCamera size={30} />
                            </div>
                        </div>
                    </div>
                </ReactFileReader>
                <Form.Control.Feedback type="invalid" className={errors.photo ? "d-block" : ""}>
                    {errors.photo?.message}
                </Form.Control.Feedback>

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

                <Button type="submit" variant="primary" className="w-100 add-pet-btn">
                    {mode === 'edit' ? "Update" : "Add"}
                </Button>
            </Form>
        </div>

    );
}