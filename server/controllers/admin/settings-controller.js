const Setting = require("../../models/Setting");

const getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await Setting.findOne({ key }).lean();
    return res.status(200).json({ success: true, data: setting || null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch setting" });
  }
};

const setSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const updated = await Setting.findOneAndUpdate(
      { key },
      { $set: { value } },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to save setting" });
  }
};

module.exports = { getSetting, setSetting };
