import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SelectInput from "../../components/SelectInput";
import { optionsToSelect } from "../../components/formFields";
import * as Yup from "yup";

const Form = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const fields = state.fields;
  const [submittedValues, setSubmittedValues] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const initialValues = fields.reduce((acc, field) => {
    switch (field.TOC) {
      case "TEXT":
      case "DATE":
      case "TEXTAREA":
      case "NUMBER":
      case "FILE":
      case "RADIO":
        acc[field.name] = "";
        break;
      case "SELECT":
        acc[field.name] = {};
        break;
      case "CHECKBOX":
        acc[field.name] = [];
    }
    return acc;
  }, {});

  const generateValidationSchema = () => {
    let schema = {};
    schema = fields.reduce((acc, field) => {
      if (field.required) {
        switch (field.TOC) {
          case "TEXT":
          case "DATE":
          case "TEXTAREA":
            acc[field.name] = Yup.string().required("This field is required!");
            break;
          case "NUMBER":
            acc[field.name] = Yup.number()
              .typeError("Invalid number format")
              .required("This field is required!");
            break;
          case "RADIO":
            acc[field.name] = Yup.string().required("Select option");
            break;
          case "CHECKBOX":
            acc[field.name] = Yup.array()
              .min(1, "At least one option must be selected")
              .required("Select option");
            break;
          case "FILE":
            acc[field.name] = Yup.string().required("No file selected");
            break;
          case "SELECT":
            acc[field.name] = Yup.mixed()
              .test(
                "isValidObject",
                "Please select an option",
                (value) => value && typeof value === "object" && value.value,
              )
              .required("Please select an option");
            break;
        }
      }
      return acc;
    }, {});
    return Yup.object().shape(schema);
  };

  const fileRef = useRef(null);
  const detailsRef = useRef(null);

  const formik = useFormik({
    initialValues,
    validationSchema: generateValidationSchema(),
    onSubmit: (values, { resetForm }) => {
      setSubmittedValues(values);
      setFormSubmitted(true);
      resetForm();
    },
  });

  const inputComponentHeader = (field) => (
    <div className="mb-2 flex justify-between">
      <label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-red-600"> *</span>}
      </label>
    </div>
  );

  const renderInputField = (field: any) => {
    switch (field.TOC) {
      case "TEXT":
      case "NUMBER":
      case "DATE":
        return (
          <div key={field.id}>
            {inputComponentHeader(field)}
            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
              <input
                id={field.id}
                name={field.name}
                type={field.type}
                value={formik.values[field.name]}
                placeholder={field.placeholder}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  "block min-w-0 grow py-1.5 pr-3 pl-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                }
                key={field.id}
              />
            </div>
          </div>
        );
      case "TEXTAREA":
        return (
          <div key={field.id}>
            {inputComponentHeader(field)}
            <textarea
              id={field.id}
              name={field.name}
              value={formik.values[field.name]}
              placeholder={field.placeholder}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              key={field.id}
              className="h-30 w-full rounded border-1 border-gray-400 bg-white p-2 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        );
      case "SELECT":
        return (
          <div key={field.id}>
            {inputComponentHeader(field)}
            <SelectInput
              label={field.label}
              name={field.name}
              selected={formik.values[field.name]}
              values={field.value}
              handleChange={(selectedOption) => {
                formik.setFieldValue(field.name, selectedOption);
              }}
              onBlur={formik.handleBlur}
              key={field.label}
            />
          </div>
        );
      case "RADIO":
        return (
          <div>
            {inputComponentHeader(field)}
            <div className="mt-1 flex-wrap sm:flex">
              {(field?.value?.length > 0 ? field.value : optionsToSelect).map(
                (item, index) => (
                  <div className="mr-3 mb-1 flex items-center" key={index}>
                    <input
                      type={"radio"}
                      name={field.name}
                      value={item.value}
                      className="mr-1 size-4"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values[field.name] === item.value}
                    />
                    <span>{item.label}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        );
      case "CHECKBOX":
        return (
          <div>
            {inputComponentHeader(field)}
            <div className="mt-1 grid grid-cols-3 gap-2">
              {(field?.value?.length > 0 ? field.value : optionsToSelect).map(
                (item, index) => {
                  const isChecked = formik.values[field.name]?.includes(
                    item.value,
                  );
                  return (
                    <div className="mr-3 flex items-center" key={index}>
                      <input
                        type={"checkbox"}
                        name={field.name}
                        value={item.value}
                        className="mr-1 size-4"
                        onChange={(e) => {
                          if (e.target.checked) {
                            formik.setFieldValue(field.name, [
                              ...(formik.values[field.name] || []),
                              item.value,
                            ]);
                          } else {
                            formik.setFieldValue(
                              field.name,
                              formik.values[field.name]?.filter(
                                (value) => value !== item.value,
                              ),
                            );
                          }
                        }}
                        onBlur={formik.handleBlur}
                        checked={isChecked}
                      />
                      <span>{item.label}</span>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        );
      case "FILE":
        return (
          <div key={field.id}>
            {inputComponentHeader(field)}
            <div className="relative my-4 overflow-hidden">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded bg-blue-400 px-4 py-2 font-bold text-white hover:bg-blue-300"
                onClick={() => {
                  if (!fileRef || !fileRef.current) return;
                  fileRef.current.click();
                }}
              >
                <svg
                  fill="#FFF"
                  height="18"
                  viewBox="0 0 24 24"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                </svg>
                <span className="ml-2">
                  {field.placeholder ? field.placeholder : "Upload Document"}
                </span>
              </button>
              <input
                ref={fileRef}
                id={field.id}
                name={field.name}
                type={field.type}
                value={formik.values[field.name]}
                placeholder={field.placeholder}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  "absolute block w-full cursor-pointer bg-blue-400 px-4 py-2 opacity-0"
                }
                key={field.id}
              />
            </div>
          </div>
        );
    }
  };

  useEffect(() => {
    if (formSubmitted && detailsRef.current) {
      detailsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setFormSubmitted(false);
    }
  }, [formSubmitted]);

  return (
    <>
      <div className="mt-3 flex justify-center">
        <div className="m-5 w-[70%] rounded border border-gray-300 pb-4">
          <div className="mt-5 mb-8 flex items-center justify-center text-2xl font-bold text-gray-600">
            Form
          </div>
          <form onSubmit={formik.handleSubmit} className="px-8">
            <div className={`grid grid-cols-3 gap-x-4`}>
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={`${field.TOC === "TEXTAREA" || field.TOC === "FILE" ? "col-span-3 w-[95%]" : ""} mb-5`}
                >
                  {renderInputField(field)}
                  {formik.errors[field.name] && formik.touched[field.name] && (
                    <p className="text-red-500">{formik.errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="size-sm mt-3 h-10 w-20 rounded bg-green-500 text-white hover:cursor-pointer hover:bg-green-700"
            >
              Submit
            </button>
            <button
              type="button"
              className="size-sm m-3 h-10 w-20 rounded bg-gray-400 text-white hover:cursor-pointer hover:bg-gray-600"
              onClick={() => {
                navigate("/", {
                  state: {
                    fields: state.fields,
                  },
                });
              }}
            >
              Edit
            </button>
          </form>
        </div>
      </div>
      {submittedValues && (
        <div className="flex justify-center">
          <div className="m-5 w-[70%]">
            <p className="mb-3 font-bold">Details Submitted: </p>
            <div className="">
              <table className="w-full" ref={detailsRef}>
                <tbody>
                  {fields.map((field) => (
                    <tr key={field.name} className="border">
                      <td className="border border-gray-300 p-2 font-bold">
                        {field.label}{" "}
                      </td>
                      <td className="border border-gray-300 p-2 pl-5">
                        {field.TOC === "SELECT"
                          ? submittedValues[field.name]?.label || "N/A"
                          : field.TOC === "CHECKBOX"
                            ? submittedValues[field.name].join(", ") || "N/A"
                            : submittedValues[field.name] || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Form;
