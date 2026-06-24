import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";
import { getOrCreateGuestId } from "@/lib/utils";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();
  const effectiveUserId = user?.id || getOrCreateGuestId();

  function handleManageAddress(event) {
    event.preventDefault();
    setFormSubmitted(true);

    // ensure phone valid before submitting
    if (!validatePhone(formData.phone)) {
      setPhoneError("Enter a valid contact number");
      toast({ title: "Please enter a valid contact number", variant: "destructive" });
      return;
    }

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });

      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: effectiveUserId,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(effectiveUserId));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({
              title: "Address updated successfully",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: effectiveUserId,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(effectiveUserId));
            setFormData(initialAddressFormData);
            toast({
              title: "Address added successfully",
            });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({
        userId: effectiveUserId,
        addressId: getCurrentAddress._id,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(effectiveUserId));
        toast({
          title: "Address deleted successfully",
        });
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
  }

  function isFormValid() {
    // require address, city and a valid phone. pincode and notes are optional
    if (!formData.address || !formData.address.trim()) return false;
    if (!formData.city || !formData.city.trim()) return false;
    if (!formData.phone || !validatePhone(formData.phone)) return false;
    return true;
  }

  function validatePhone(phone) {
    if (!phone || !phone.toString().trim()) return false;
    const digits = phone.toString().replace(/\D/g, "");
    return digits.length >= 9 && digits.length <= 15;
  }

  useEffect(() => {
    if (!formData.phone || formData.phone.trim() === "") {
      setPhoneError("Contact number is required");
    } else if (!validatePhone(formData.phone)) {
      setPhoneError("Enter a valid contact number");
    } else {
      setPhoneError("");
    }
  }, [formData.phone]);

  useEffect(() => {
    if (effectiveUserId) {
      dispatch(fetchAllAddresses(effectiveUserId));
    }
  }, [dispatch, effectiveUserId]);

  console.log(addressList, "addressList");

   // Auto-select first address if none is selected
  useEffect(() => {
    if (
      addressList &&
      addressList.length > 0 &&
      !selectedId &&
      typeof setCurrentSelectedAddress === "function"
    ) {
      setCurrentSelectedAddress(addressList[0]);
    }
  }, [addressList, selectedId, setCurrentSelectedAddress]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem?._id}
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={(next) => {
            setFormData(next);
            if (Object.prototype.hasOwnProperty.call(next, 'phone')) setPhoneTouched(true);
          }}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
        {phoneError && (phoneTouched || formSubmitted) && (
          <div className="text-sm text-red-600 mt-1">{phoneError}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default Address;
