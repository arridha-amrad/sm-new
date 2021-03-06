import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast, ToastOptions } from "react-toastify";
import { useAppDispatch } from "../../app/hooks";
import ImagePreview from "../../components/imagePreviewer/ImagePreview";
import MySpinner from "../../components/MySpinner";
import imagePicker from "../../utils/imagePicker";
import useFormHooks from "../../utils/useFormHooks";
import { createPostAction } from "./postSlice";
import "./style.css";

interface PostMakerValidator {
  body?: string;
}

const toastOptions: ToastOptions = {
  position: "bottom-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
};

const PostMaker = () => {
  const dispatch = useAppDispatch();
  const checkField = () => {
    let errors: PostMakerValidator = {};
    if (state.body.trim() === "") {
      errors.body = "Body field is required";
    }
    return {
      errors,
      isValid: Object.keys(errors).length <= 0,
    };
  };
  const createPost = async () => {
    const formData = new FormData();
    formData.append("body", state.body);
    if (!files) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append("images", file);
    }
    const res = await dispatch(createPostAction(formData));
    if (res.meta.requestStatus === "fulfilled") {
      notify("New post created successfully", "success");
      setState({
        ...state,
        body: "",
      });
      setPreviewImages([]);
    }
  };

  const [files, setFiles] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  const handleImagePicker = (e: ChangeEvent<HTMLInputElement>) => {
    const { error, fileToPreview, files } = imagePicker(e);
    if (error) {
      notify(error, "error");
    }
    if (!error) {
      setPreviewImages(fileToPreview);
      setFiles(files);
    }
  };

  const notify = (message: string, type: "success" | "error") => {
    if (type === "error") {
      toast.error(message, toastOptions);
    }
    if (type === "success") {
      toast.success(message, toastOptions);
    }
  };

  const {
    onChange,
    onSubmit,
    isLoading,
    state,
    fieldErrors,
    setFieldErrors,
    setState,
  } = useFormHooks<{
    body: string;
  }>(
    {
      body: "",
    },
    createPost,
    checkField
  );

  useEffect(() => {
    setFieldErrors(null);
    // eslint-disable-next-line
  }, [state.body]);

  return (
    <div className="border p-2 rounded">
      <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
        <div className=" d-flex gap-3">
          <div className="d-flex flex-column flex-grow-1">
            <textarea
              className="myTextArea d-block h-100"
              onChange={onChange}
              name="body"
              value={state.body}
              style={{ resize: "none" }}
              placeholder="write something ..."
            />
            {fieldErrors?.body && (
              <small className="text-danger">{fieldErrors.body}</small>
            )}
          </div>
          <ImagePreview previewImages={previewImages} />
        </div>
        <input
          ref={ref}
          multiple
          type="file"
          hidden
          name="images"
          onChange={handleImagePicker}
        />
        <div className="d-flex gap-2 justify-content-between align-items-center ">
          <div className="d-flex gap-2 align-items-center">
            <button
              disabled={isLoading || !state.body}
              type="submit"
              className="btn btn-primary"
            >
              {isLoading ? <MySpinner isFullHeight={false} /> : "Post"}
            </button>
            <div>{state.body.length}/200</div>|
            <div className="d-flex align-items-center">
              <span className="ms-1"> {previewImages.length} / 4</span>
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => ref.current?.click()}
            className="btn btn-outline-primary"
          >
            upload image
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostMaker;
