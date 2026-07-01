import { getShippingCost, setShippingCost } from "@/store/admin/settings-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllReviewsForAdmin } from "@/store/admin/review-slice";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { reviewList } = useSelector((state) => state.adminReview);
  const { shippingCost } = useSelector((state) => state.adminSettings || { shippingCost: 0 });
  const [localShipping, setLocalShipping] = useState(String(shippingCost || "0"));
  const { toast } = useToast();

  useEffect(() => {
    dispatch(getAllReviewsForAdmin());
    dispatch(getShippingCost()).then((res) => {
      setLocalShipping(String(res?.payload?.data?.value ?? "0"));
    });
  }, [dispatch]);

  function handleSaveShipping() {
    const numeric = parseFloat(localShipping || "0") || 0;
    dispatch(setShippingCost(numeric)).then((res) => {
      if (res?.payload?.success) {
        // updated - refresh from server and notify admin
        dispatch(getShippingCost());
        toast({ title: "Shipping cost saved" });
      } else {
        toast({ title: "Failed to save shipping cost", variant: "destructive" });
      }
    });
  }

  return (
    <div>
      <div className="mt-4 rounded-lg border bg-white p-4">
        <h3 className="mb-3 text-lg font-semibold">Dashboard Banner</h3>
        <div className="relative overflow-hidden rounded-lg border">
          <img
            src="/hero/slider2.jpg"
            alt="Wood products banner"
            className="h-[300px] w-full object-cover object-center"
          />
        </div>
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
