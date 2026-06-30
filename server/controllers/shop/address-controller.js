const Address = require("../../models/Address");

const phonePattern = /^(03\d{9}|\+923\d{9})$/;
const pincodePattern = /^\d{5}$/;

const normalizePhone = (phone) =>
  phone?.toString().trim() || "";

const normalizePincode = (pincode) =>
  pincode?.toString().trim() || "";

const isValidPhone = (phone) => phonePattern.test(normalizePhone(phone));
const isValidPincode = (pincode) => pincodePattern.test(normalizePincode(pincode));

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;
    const normalizedPhone = normalizePhone(phone);
    const normalizedPincode = normalizePincode(pincode);

    if (!userId || !address || !city || !normalizedPhone || !normalizedPincode) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    if (!/^\+?\d+$/.test(normalizedPhone) || normalizedPhone.slice(1).includes("+")) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    if (!isValidPhone(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    if (!/^\d+$/.test(normalizedPincode)) {
      return res.status(400).json({
        success: false,
        message: "Pincode may contain numbers only.",
      });
    }

    if (!isValidPincode(normalizedPincode)) {
      return res.status(400).json({
        success: false,
        message: "Pincode must be exactly 5 digits long.",
      });
    }

    const newlyCreatedAddress = new Address({
      userId,
      address: address.trim(),
      city: city.trim(),
      pincode: normalizedPincode,
      notes: notes?.trim() || "",
      phone: normalizedPhone,
    });

    await newlyCreatedAddress.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required!",
      });
    }

    const addressList = await Address.find({ userId });

    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;
    const normalizedPhone = normalizePhone(formData.phone);
    const normalizedPincode = normalizePincode(formData.pincode);

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    if (
      !formData.address?.trim() ||
      !formData.city?.trim() ||
      !normalizedPhone ||
      !normalizedPincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Address, city, pincode and contact number are required!",
      });
    }

    if (!/^\+?\d+$/.test(normalizedPhone) || normalizedPhone.slice(1).includes("+")) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    if (!isValidPhone(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    if (!/^\d+$/.test(normalizedPincode)) {
      return res.status(400).json({
        success: false,
        message: "Pincode may contain numbers only.",
      });
    }

    if (!isValidPincode(normalizedPincode)) {
      return res.status(400).json({
        success: false,
        message: "Pincode must be exactly 5 digits long.",
      });
    }

    const sanitizedFormData = {
      ...formData,
      address: formData.address.trim(),
      city: formData.city.trim(),
      pincode: normalizedPincode,
      notes: formData.notes?.trim() || "",
      phone: normalizedPhone,
    };

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      sanitizedFormData,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };
