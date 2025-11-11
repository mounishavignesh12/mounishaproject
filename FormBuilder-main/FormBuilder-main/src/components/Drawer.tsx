import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";
import InputComponent from "./FormComponents/InputComponent";
import SelectComponent from "./FormComponents/SelectComponent";
import RadioComponent from "./FormComponents/RadioComponent";
import FileComponent from "./FormComponents/FileComponent";

export default function Drawer({ open, handleOpen, data, handleResponseObject }) {
  const [fieldData, setFieldData] = useState(null);

  useEffect(() => {
    setFieldData(data);
  }, [data]);

  const renderField = (field: { TOC: unknown } | null) => {

    switch (field?.TOC) {
      case "TEXT":
        return <InputComponent field={field} handleOpen={handleOpen} handleResponseObject={handleResponseObject}/>
      case "NUMBER":
        return <InputComponent field={field} handleOpen={handleOpen} handleResponseObject={handleResponseObject}/>
      case "TEXTAREA":
        return  <InputComponent field={field} handleOpen={handleOpen} handleResponseObject={handleResponseObject}/>
      case "SELECT":
        return <SelectComponent field={field} handleOpen={handleOpen} handleResponseObject={handleResponseObject}/>  
      case "RADIO":
        return <RadioComponent field={field} handleOpen={handleOpen} handleResponseObject={handleResponseObject}/>  
      case "CHECKBOX":
        return <RadioComponent field={field} handleOpen={handleOpen} handleResponseObject={handleResponseObject}/>  
      case "DATE":
        return <InputComponent field={field} handleOpen={handleOpen} handleResponseObject={handleResponseObject}/>
      case "FILE":
        return <FileComponent field={field} handleOpen={handleOpen} handleResponseObject={handleResponseObject}/>
    }
  };

  return createPortal(
    <Dialog open={open} onClose={handleOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4">
                  <button
                    type="button"
                    onClick={handleOpen}
                    className="relative rounded-md text-gray-300 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className="h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="text-base font-semibold text-gray-900">
                    <h3 className="text-center text-2xl font-bold text-purple-600">
                      Edit Here
                    </h3>
                  </div>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <div>{renderField(fieldData)}</div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>,
    document.body,
  );
}
