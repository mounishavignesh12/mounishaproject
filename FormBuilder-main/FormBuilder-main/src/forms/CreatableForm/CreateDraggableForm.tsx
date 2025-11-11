import React, { useRef, useState } from "react";
import DropContainer from "./DropContainer";
import SelectInput from "../../components/SelectInput";
import Drawer from "../../components/Drawer";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import { formFields, optionsToSelect } from "../../components/formFields";
import { v4 as uuidv4 } from "uuid";

const CreateDraggableForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [fields, setFields] = useState(
    state?.fields?.length > 0 ? state.fields : [],
  );
  const [firstTimeDragging, setFirstTimeDragging] = useState(true);
  const [activeField, setActiveField] = useState(null);
  const [activeFormComponent, setActiveFormComponent] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const fileRef = useRef<HTMLFormElement | null>(null);

  const randomUUID = () => {
    const uuid = uuidv4().toString().replaceAll("-", "");
    return `a${uuid}`;
  };

  const OpenDrawer = () => {
    setOpen(true);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  const onDrop = (position) => {
    if (firstTimeDragging) setFirstTimeDragging(false);

    setFields((prev) => {
      let updatedFields = [...prev];

      if (activeFormComponent) {
        const newComponent = {
          ...activeFormComponent,
          indexEl: randomUUID(),
          name: randomUUID(),
        };

        updatedFields.splice(position, 0, newComponent);
      } else if (activeField) {
        const currentIndex = updatedFields.findIndex(
          (field) => field.indexEl === activeField.indexEl,
        );
        if (currentIndex === position || currentIndex === position - 1) {
          return updatedFields;
        }
        const [moveField] = updatedFields.splice(currentIndex, 1);
        const adjustPosition =
          currentIndex < position ? position - 1 : position;
        updatedFields.splice(adjustPosition, 0, moveField);
      }
      return updatedFields;
    });
  };

  const handleResponseObject = (values) => {
    setFields((prev) => {
      const updatedFields = [...prev];
      const index = updatedFields.findIndex(
        (field) => field.indexEl === values.indexEl,
      );
      updatedFields.splice(index, 1, values);
      return updatedFields;
    });
  };

  const inputComponentHeader = (field) => (
    <div className="mb-2 flex justify-between">
      <label htmlFor={field.id}>
        {field.label}
        {field.required === true && <span className="text-red-600"> *</span>}
      </label>
      <div className="flex gap-2">
        <TrashIcon
          aria-hidden="true"
          className="size-5 text-red-600 hover:cursor-pointer"
          onClick={() => {
            setFields((prev) =>
              prev.filter((item) => {
                return item.indexEl !== field.indexEl;
              }),
            );
          }}
        />
        <PencilSquareIcon
          aria-hidden="true"
          className="size-5 text-gray-400 hover:cursor-pointer"
          onClick={() => {
            setData(field);
            OpenDrawer();
          }}
        />
      </div>
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
                placeholder={field.placeholder}
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
          <div className="col-span-3" key={field.id}>
            {inputComponentHeader(field)}
            <textarea
              id={field.id}
              name={field.name}
              placeholder={field.placeholder}
              key={field.id}
              className="h-20 w-full rounded border-1 border-gray-400 bg-white p-2 text-gray-900 placeholder:text-gray-400 focus:border-2 focus:border-indigo-600 focus:outline-none"
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
              selected={selectedOption}
              values={field.value}
              handleChange={setSelectedOption}
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
                      className="mr-1 size-4"
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
                (item, index) => (
                  <div className="mr-3 flex items-center" key={index}>
                    <input
                      type={"checkbox"}
                      name={field.name}
                      className="mr-1 size-4"
                    />
                    <span>{item.label}</span>
                  </div>
                ),
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
                placeholder={field.placeholder}
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/form", {
      state: {
        fields,
      },
    });
  };

  return (
    <div className="m-5">
      <div className="text-center">
        <p className="text-2xl font-bold">Form Builder</p>
      </div>
      <div className="flex">
        <div className="w-[55%]">
          <form onSubmit={(e) => handleFormSubmit(e)}>
            <div className="mx-9 mt-9 mb-3 h-[600px] overflow-y-auto rounded border-1 border-gray-400 p-4">
              {firstTimeDragging && fields.length === 0 && (
                <DropContainer isFirstDrop={true} onDrop={() => onDrop(0)} />
              )}
              {fields.length > 0 &&
                fields?.map((field, index) => {
                  return (
                    <div key={field.name}>
                      <div>
                        <DropContainer
                          isFirstDrop={false}
                          onDrop={() => onDrop(index)}
                        />
                        <div
                          draggable
                          onDragStart={() => setActiveField(field)}
                          onDragEnd={() => setActiveField(null)}
                          className="font-boldactive:opacity-50 cursor-grab rounded-xl px-3 text-black"
                        >
                          {renderInputField(field)}
                        </div>
                        <DropContainer
                          isFirstDrop={false}
                          onDrop={() => onDrop(index + 1)}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            {fields.length > 0 && (
              <div className="ml-6">
                <button
                  type="submit"
                  className="ml-3 max-w-100 rounded bg-green-500 p-2 text-white hover:cursor-pointer"
                >
                  Create Form
                </button>
                <button
                  type="button"
                  className="ml-3 max-w-100 rounded bg-gray-300 p-2 hover:cursor-pointer"
                  onClick={() => setFields([])}
                >
                  Reset Form
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="mt-8 h-[400px] w-[40%] overflow-y-auto rounded-2xl border-2 border-gray-300 p-3 shadow-xl">
          <p className="mb-2 ml-2 text-xl font-bold text-gray-500">Fields</p>
          <div className="grid grid-cols-2 gap-x-4">
            {formFields?.map((field, index) => {
              return (
                <div key={index}>
                  <div
                    draggable
                    onDragStart={() => setActiveFormComponent(field)}
                    onDragEnd={() => setActiveFormComponent(null)}
                    className="my-3 cursor-move rounded border-1 border-gray-400 p-3 pt-3 font-bold text-gray-500 hover:border-0 hover:bg-blue-400 hover:text-white active:opacity-50"
                  >
                    {field.TOC}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Drawer
        open={open}
        handleOpen={handleCloseDrawer}
        data={data}
        handleResponseObject={handleResponseObject}
      />
    </div>
  );
};

export default CreateDraggableForm;
