import { useState, useCallback } from "react";

export function useFormValidation(initialValues, validators = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = useCallback(
    (name, value) => {
      const validator = validators[name];
      if (!validator) return null;
      return validator(value, values);
    },
    [validators, values]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      if (touched[name]) {
        const error = validate(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validate]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validate(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validate]
  );

  const validateAll = useCallback(() => {
    const allErrors = {};
    const allTouched = {};

    for (const name of Object.keys(initialValues)) {
      allTouched[name] = true;
      const error = validate(name, values[name]);
      if (error) allErrors[name] = error;
    }

    setTouched(allTouched);
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [initialValues, values, validate]);

  const isValid = Object.values(errors).every((e) => !e);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return { values, errors, touched, handleChange, handleBlur, isValid, validateAll, reset };
}
