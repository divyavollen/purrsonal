import React from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "../../css/pet.css";
import { validateFile } from "../utils/validate";

export default function PetForm({
    mode,
    initialData,
    onSubmit,
    onSuccess,
    submitLabel
}) {

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        reset
    } = useForm({
        defaultValues: initialData,
    });

    const isView = mode === "view"

    const onFormSubmit = async (formData) => {

        const formDataObj = new FormData();

        formDataObj.append("name", formData.name);
        formDataObj.append("sex", formData.sex);
        formDataObj.append("birthDate", formData.birthDate);

        if (formData.photo && formData.photo.length > 0) {
            formDataObj.append("photo", formData.photo[0]);
        }

        try {
            await onSubmit(formDataObj);

            if (onSuccess) onSuccess();

            if (mode === "add") {
                reset();
                clearErrors();
            }
        }
        catch (error) {

            if (error.errors && Array.isArray(error.errors)) {
                const firstErrorsByField = {};
                error.errors.forEach(({ field, message }) => {
                    if (!firstErrorsByField[field]) firstErrorsByField[field] = message;
                });

                Object.entries(firstErrorsByField).forEach(([field, message]) => {

                    if (field === "global" && message === "User not authenticated") {
                        message = "You must be logged in to add a pet.";
                    }
                    setError(field, { type: "server", message });
                });
            } else {
                setError("global", { type: "server", message: error.message || "Unknown error occurred" });
            }
        }

    }

    return (
        <div className="pet-form-container">
            <Form className="pet-form" onSubmit={handleSubmit(onFormSubmit)}>

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
                        readOnly={isView}
                        {...register("name"
                            , {
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
                            }
                        )}
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
                        readOnly={isView}
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
                        readOnly={isView}
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

                {
                    isView && <Button type="submit" variant="primary" className="w-100 register-btn">
                        {submitLabel}
                    </Button>
                }
            </Form>
        </div>
    );
}