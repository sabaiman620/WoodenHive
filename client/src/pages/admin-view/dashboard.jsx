import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
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
  }, [dispatch]);

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
    </div>
  );
}

export default AdminDashboard;
