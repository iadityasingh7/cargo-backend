import User from "../models/User.js";

export const createSellerRateCard = async (req, res) => {
  const {
    selectedUserId,
    rateCard: {
      courierProviderId,
      courierProvider,
      courierServiceId,
      weightPriceBasic,
      weightPriceAdditional,
      codPercent,
      codCharge,
    },
  } = req.body;

  try {
    const user = await User.findById(selectedUserId);

    if (!user) {
      res.status(400).json("User not found");
    }

    const existingSellerRateCard = user.sellerRateCards.find((rateCard) => {
      return (
        rateCard.courierProviderId === courierProviderId &&
        rateCard.courierServiceId === courierServiceId
      );
    });

    if (existingSellerRateCard) {
      existingSellerRateCard.weightPriceBasic = weightPriceBasic;
      existingSellerRateCard.weightPriceAdditional = weightPriceAdditional;
      existingSellerRateCard.codPercent = codPercent;
      existingSellerRateCard.codCharge = codCharge;
    } else {
      user.sellerRateCards.push({
        courierProviderId,
        courierProvider,
        courierServiceId,
        weightPriceBasic,
        weightPriceAdditional,
        codPercent,
        codCharge,
      });
    }

    await user.save();

    res
      .status(200)
      .json({ message: "Seller Rate Card Created Successfully", user });
  } catch (error) {
    console.log("Seller Rate Card Controller Error", error);
    res
      .status(500)
      .json({ message: "Server error please try after some time." });
  }
};

export const getAllExistingSellerRateCard = async (req, res) => {
  const { selectedUserId } = req.body;

  try {
    const user = await User.findById(selectedUserId);
    res.status(200).json({
      message: "Seller Rate card fetch from the database Successfully.",
      sellerRateCards: user.sellerRateCards,
    });
  } catch (error) {
    console.log(
      "Something went wrong to fetch the seller rate cards from the database. Server side error. Pleae try after some time.",
      error
    );
    res.status(500).json({
      message: "Server side error. Please try after some time later.",
    });
  }
};

export const updateSellerRateCard = async (req, res) => {
  const {selectedUserId, selectedSellerRateCardId} = req.body;
  try {
    const user = await User.findByIdAndUpdate(selectedUserId);
    const updatedSellerRateCard = user.sellerRateCards.map(() => {
      
    })
  } catch (error) {
    
  }
}
