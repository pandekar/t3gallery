'use client'

import { useRouter } from "next/navigation";
import { useUploadThing } from "~/utils/uploadthing";
import { toast } from "sonner"
import { usePostHog } from "posthog-js/react";

// infered input off useUploadThing
type Input = Parameters<typeof useUploadThing>;

const UploadSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  )
}

/* loading spinner SVG from github n3r4zzurr0 */
// separate the <style to global.css> <svg> is used here
const LoadingSpinnerSVG = () => {
  return (
    <svg
      width="24"
      height="24"
      stroke="#ffffff"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="spinner_V8m1">
        <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"></circle>
      </g>
    </svg>
  )
}

const useUploadThingInputProps = (...args: Input) => {
  const $ut = useUploadThing(...args);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const result = await $ut.startUpload(selectedFiles);

    console.log("uploaded files", result);
    // TODO: persist result in state maybe?
  }

  return {
    inputProps: {
      onChange,
      multiple: ($ut.permittedFileInfo?.config?.image?.maxFileCount ?? 1) > 1,
      accept: "image/*",
    },
    isUploading: $ut.isUploading,
  };
};

// // testing the spinner directly in browser
// function makeSpinner() {
//   return toast(
//     <div className="flex items-center gap-2">
//       <LoadingSpinnerSVG /><span className="text-lg text-white">Uploading...</span>
//     </div>, { duration: 10000, id: "upload-begin" }
//   )
// }
// // call in browser console, type "window.makeSpinner()"
// window.makeSpinner = makeSpinner;

export default function SimpleUploadButton() {
  const router = useRouter();
  const posthog = usePostHog();

  const {inputProps} = useUploadThingInputProps("imageUploader", {
    onUploadBegin() {
      posthog.capture("upload_begin")
      toast(
        <div className="flex items-center gap-2">
          <LoadingSpinnerSVG /><span className="text-lg text-white">Uploading...</span>
        </div>, { duration: 10000, id: "upload-begin" }
      )
    },
    onUploadError: (error) => {
      posthog.capture("upload_error", { error });
      toast.dismiss("upload-begin");
      toast.error("Upload failed");
    },
    onClientUploadComplete() {
      // dismiss toast
      toast.dismiss("upload-begin")
      toast("Upload complete!", {
        duration: 10000
      })

      // reload page after upload complete
      router.refresh();

    },
  });

  return (
    <div>
      <label htmlFor="upload-button">
        <div className="flex flex-row gap-2 cursor-pointer">
          <UploadSVG />
          <span>Upload</span>
        </div>
      </label>
      <input
        id="upload-button"
        type="file"
        className="sr-only"
        {...inputProps}
      />
    </div>
  );
}