import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { apiUrl } from "@/lib/api";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  console.log(isEditMode, "isEditMode");

  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      // when multiple files selected, setImageFile to the array
      setImageFile(selectedFiles);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files || []);
    if (droppedFiles.length > 0) setImageFile(droppedFiles);
  }

  function handleRemoveImage(index) {
    // remove a single uploaded image by index
    if (Array.isArray(uploadedImageUrl)) {
      const newArr = uploadedImageUrl.filter((_, i) => i !== index);
      setUploadedImageUrl(newArr);
    } else {
      setUploadedImageUrl([]);
    }
  }

  function handleClearAll() {
    setImageFile(null);
    setUploadedImageUrl([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function uploadFilesToCloudinary(filesArray) {
    setImageLoadingState(true);
    const uploaded = [];
    for (const file of filesArray) {
      const data = new FormData();
      data.append("my_file", file);
      try {
        const response = await axios.post(
          apiUrl("/api/admin/products/upload-image"),
          data
        );
        if (response?.data?.success) {
          uploaded.push(response.data.result.url);
        }
      } catch (e) {
        console.error("Image upload failed", e);
      }
    }
    setUploadedImageUrl((prev) => {
      const prevArr = Array.isArray(prev) ? prev : prev ? [prev] : [];
      return [...prevArr, ...uploaded];
    });
    setImageLoadingState(false);
  }

  useEffect(() => {
    if (imageFile !== null) {
      // imageFile can be a single file or an array
      const filesArray = Array.isArray(imageFile) ? imageFile : [imageFile];
      if (filesArray.length > 0) uploadFilesToCloudinary(filesArray);
    }
  }, [imageFile]);

  return (
    <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? "opacity-60" : ""} border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
          multiple
        />
        {!uploadedImageUrl || (Array.isArray(uploadedImageUrl) && uploadedImageUrl.length === 0) ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode ? "cursor-not-allowed" : ""} flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image(s)</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileIcon className="w-8 text-primary mr-2 h-8" />
              </div>
              <p className="text-sm font-medium">{Array.isArray(uploadedImageUrl) ? `${uploadedImageUrl.length} file(s) uploaded` : "1 file uploaded"}</p>
              {!isEditMode ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => inputRef.current && inputRef.current.click()}
                    className="inline-flex items-center rounded-md bg-white/90 px-3 py-1 text-sm font-medium text-black shadow-sm hover:bg-white"
                  >
                    Add more
                  </button>
                </div>
              ) : null}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={handleClearAll}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.isArray(uploadedImageUrl)
                ? uploadedImageUrl.map((imgUrl, idx) => (
                    <div key={idx} className="relative rounded overflow-hidden border">
                      <img src={imgUrl} className="h-20 w-full object-cover" alt={`upload-${idx}`} />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 rounded-full bg-white/80 p-1 text-xs"
                        aria-label={`Remove image ${idx + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))
                : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
