import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { getShippingCost, setShippingCost } from "@/store/admin/settings-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllReviewsForAdmin } from "@/store/admin/review-slice";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { reviewList } = useSelector((state) => state.adminReview);
  const { shippingCost } = useSelector((state) => state.adminSettings || { shippingCost: 0 });
  const [localShipping, setLocalShipping] = useState(String(shippingCost || "0"));

  console.log(uploadedImageUrl, "uploadedImageUrl");

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(getAllReviewsForAdmin());
    dispatch(getShippingCost()).then((res) => {
      setLocalShipping(String(res?.payload?.data?.value ?? "0"));
    });
  }, [dispatch]);

  function handleSaveShipping() {
    const numeric = parseFloat(localShipping || "0") || 0;
    dispatch(setShippingCost(numeric)).then((res) => {
      if (res?.payload?.success) {
        // updated
      }
    });
  }

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        // isEditMode={currentEditedId !== null}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div className="relative">
                <img
                  src={featureImgItem.image}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
              </div>
            ))
          : null}
      </div>
      <div className="grid gap-4 mt-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {reviewList ? reviewList.length : 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {reviewList
                ? reviewList.filter((item) => !item.isApproved).length
                : 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Approved Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {reviewList
                ? reviewList.filter((item) => item.isApproved).length
                : 0}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 bg-white border rounded-lg p-4 w-full">
        <h3 className="font-semibold mb-2">Shipping Cost</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min={0}
            step="0.01"
            value={localShipping}
            onChange={(e) => setLocalShipping(e.target.value)}
            className="p-2 border rounded w-40"
          />
          <button onClick={() => handleSaveShipping()} className="bg-[#3b2a25] text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
