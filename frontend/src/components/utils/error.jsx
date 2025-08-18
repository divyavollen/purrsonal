export async function handleApiFormErrors(errors, { setGlobalErrorMessage, setError } = {}) {

    const firstErrorsByField = {};

    if (errors) {
        errors.forEach(({ field, message }) => {
            if (!firstErrorsByField[field]) {
                firstErrorsByField[field] = message;
            }
        });

        Object.entries(firstErrorsByField).forEach(([field, message]) => {
            console.error(`Error in field ${field}: ${message}`);

            if (field === "global") {
                setGlobalErrorMessage?.(message);
            } else {
                setError?.(field, { type: "server", message });
            }
        });
    }

    throw new Error("API returned errors");
}
