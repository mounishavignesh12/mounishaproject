import { useFormik } from "formik";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";

const SelectComponent = ({ field, handleOpen, handleResponseObject }: any) => {
  const [value, setValue] = useState(undefined);
  const formik = useFormik({
    initialValues: { ...field, required: field?.required ? field.required : false },
    onSubmit: (values) => {
      const data = { ...values, value };
      handleResponseObject(data);
      setValue(undefined);
      handleOpen();
    },
    enableReinitialize: true,
  });

  const handleChange = (value) => {
    setValue(value);
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="label">Label</label>
        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
          <input
            id={"label"}
            name={"label"}
            type="text"
            placeholder={"Enter the value"}
            onChange={formik.handleChange}
            value={formik.values.label}
            onBlur={formik.handleBlur}
            className={
              "block min-w-0 grow py-1.5 pr-3 pl-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            }
            key={"label"}
          />
        </div>

        <label htmlFor="placeholder">Value</label>

        <CreatableSelect
          isClearable
          isMulti
          onChange={(value) => handleChange(value)}
          options={field.value ?  field.value : undefined}
          value={value}
        />

        <div className="my-2 flex items-center">
          <input
            type="checkbox"
            name={"required"}
            className="mt-[3px]"
            checked={formik.values.required}
            onChange={formik.handleChange}
          />{" "}
          <span className="ml-[5px]"> Required</span>
        </div>
        <button
          type="submit"
          className="mt-3 h-8 w-[30%] cursor-pointer rounded bg-green-700 text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SelectComponent;
