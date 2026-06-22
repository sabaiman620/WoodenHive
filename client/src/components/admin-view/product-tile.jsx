import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  setUploadedImageUrl,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.images?.[0] || product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              Rs {product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">Rs {product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(product?._id);
                // normalize product data for form: colors as comma-separated string
                const normalized = {
                  ...product,
                  images: product?.images || (product?.image ? [product.image] : []),
                  colors: Array.isArray(product?.colors)
                    ? product.colors.join(",")
                    : product?.colors || "",
                  size: product?.size || "",
                };
                setFormData(normalized);
                if (setUploadedImageUrl) {
                  setUploadedImageUrl(normalized.images || []);
                }
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(product?._id)}>Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
