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

const phonePattern = /^(03\d{9}|\+923\d{9})$/;
const pincodePattern = /^\d{5}$/;

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [pincodeTouched, setPincodeTouched] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();
  const effectiveUserId = user?.id || getOrCreateGuestId();
  const currentSavedAddress = addressList?.[0] || null;
  const showAccountSummary = typeof selectedId === "undefined";

  function resetValidationState() {
    setPhoneError("");
    setPincodeError("");
    setPhoneTouched(false);
    setPincodeTouched(false);
    setFormSubmitted(false);
  }

  function validatePhone(phone) {
    const normalizedPhone = phone?.toString().trim() || "";
    return phonePattern.test(normalizedPhone);
  }

  function validatePincode(pincode) {
    const normalizedPincode = pincode?.toString().trim() || "";
    return pincodePattern.test(normalizedPincode);
  }

  function getPhoneValidationMessage(phone) {
    const normalizedPhone = phone?.toString().trim();

    if (!normalizedPhone) {
      return "Please enter a contact number.";
    }

    if (!/^\+?\d+$/.test(normalizedPhone) || normalizedPhone.slice(1).includes("+")) {
      return "Please enter a valid phone number.";
    }

    if (!validatePhone(normalizedPhone)) {
      return "Please enter a valid phone number.";
    }

    return "";
  }

  function getPincodeValidationMessage(pincode) {
    const normalizedPincode = pincode?.toString().trim();

    if (!normalizedPincode) {
      return "Please enter a pincode.";
    }

    if (!/^\d+$/.test(normalizedPincode)) {
      return "Pincode may contain numbers only.";
    }

    if (!validatePincode(normalizedPincode)) {
      return "Pincode must be exactly 5 digits long.";
    }

    return "";
  }

  function handleManageAddress(event) {
    event.preventDefault();
    setFormSubmitted(true);
    const normalizedPhone = formData.phone?.toString().trim() || "";
    const normalizedPincode = formData.pincode?.toString().trim() || "";
    const phoneValidationMessage = getPhoneValidationMessage(normalizedPhone);
    const pincodeValidationMessage = getPincodeValidationMessage(normalizedPincode);

    if (phoneValidationMessage) {
      setPhoneError(phoneValidationMessage);
      toast({
        title: phoneValidationMessage,
        variant: "destructive",
      });
      return;
    }

    if (pincodeValidationMessage) {
      setPincodeError(pincodeValidationMessage);
      toast({
        title: pincodeValidationMessage,
        variant: "destructive",
      });
      return;
    }

    const payload = {
      ...formData,
      address: formData.address.trim(),
      city: formData.city.trim(),
      pincode: normalizedPincode,
      notes: formData.notes.trim(),
      phone: normalizedPhone,
    };

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      resetValidationState();
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
            formData: payload,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(effectiveUserId));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            resetValidationState();
            toast({
              title: "Address updated successfully",
            });
          } else {
            toast({
              title: data?.payload?.message || "Could not update address",
              variant: "destructive",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...payload,
            userId: effectiveUserId,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(effectiveUserId));
            setFormData(initialAddressFormData);
            resetValidationState();
            toast({
              title: "Address added successfully",
            });
          } else {
            toast({
              title: data?.payload?.message || "Could not add address",
              variant: "destructive",
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
    resetValidationState();
    setFormData({
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
  }

  function isFormValid() {
    if (!formData.address || !formData.address.trim()) return false;
    if (!formData.city || !formData.city.trim()) return false;
    if (!formData.pincode || !validatePincode(formData.pincode)) return false;
    if (!formData.phone || !validatePhone(formData.phone)) return false;
    return true;
  }

  useEffect(() => {
    setPhoneError(getPhoneValidationMessage(formData.phone));
  }, [formData.phone]);

  useEffect(() => {
    setPincodeError(getPincodeValidationMessage(formData.pincode));
  }, [formData.pincode]);

  useEffect(() => {
    if (effectiveUserId) {
      dispatch(fetchAllAddresses(effectiveUserId));
    }
  }, [dispatch, effectiveUserId]);

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
      {showAccountSummary ? (
        <div className="space-y-4 border-b p-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Account Details</h3>
            <p className="text-sm text-muted-foreground">
              Logged in as {user?.userName || "Guest"}
              {user?.email ? ` • ${user.email}` : ""}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Account</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {user?.userName || "Guest User"}
              </p>
              <p className="text-sm text-gray-600">{user?.email || "No email available"}</p>
            </div>

            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Current Saved Address</p>
              {currentSavedAddress ? (
                <div className="mt-1 space-y-1 text-sm text-gray-700">
                  <p>{currentSavedAddress.address}</p>
                  <p>{currentSavedAddress.city}</p>
                  <p>Pincode: {currentSavedAddress.pincode}</p>
                  <p>Phone: {currentSavedAddress.phone}</p>
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-600">
                  No saved address yet. Add your first address below.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}

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
            if (Object.prototype.hasOwnProperty.call(next, "phone")) {
              setPhoneTouched(true);
            }
            if (Object.prototype.hasOwnProperty.call(next, "pincode")) {
              setPincodeTouched(true);
            }
          }}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
        {pincodeError && (pincodeTouched || formSubmitted) && (
          <div className="text-sm text-red-600 mt-1">{pincodeError}</div>
        )}
        {phoneError && (phoneTouched || formSubmitted) && (
          <div className="text-sm text-red-600 mt-1">{phoneError}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default Address;
