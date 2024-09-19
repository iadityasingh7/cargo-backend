import RateCard from "../models/rateCards.js";

export const createRateCard = async (req, res) => {
  const {
    courierProviderId,
    courierProvider,
    courierServiceId,
    weightPriceBasic,
    weightPriceAdditional,
    codPercent,
    codCharge,
  } = req.body;

  const rateCard = new RateCard({
    courierProviderId,
    courierProvider,
    courierServiceId,
    weightPriceBasic,
    weightPriceAdditional,
    codPercent,
    codCharge,
  });

  try {
    const newRateCard = await rateCard.save();
    res
      .status(200)
      .json({ message: "New Rate Card is Created", rateCard: newRateCard });
  } catch (error) {
    res.status(400).json({
      message: "something went wrong while creating a rate card.",
      error: error.message,
    });
  }
};

export const updateRateCard = async (req, res) => {
  const {
    courierProviderId,
    courierProvider,
    courierServiceId,
    basicWeight,
    additionalWeight,
    codPercent,
    codCharge,
  } = req.body;

  try {
    const rateCard = await RateCard.findByIdAndUpdate(
      req.params.id,
      {
        courierProviderId,
        courierProvider,
        courierServiceId,
        basicWeight,
        additionalWeight,
        codPercent,
        codCharge,
      },
      { new: true }
    );

    if (!rateCard) {
      return res.status(404).json({ message: "Rate card is not found" });
    }

    res.json(rateCard);
  } catch (error) {
    res.status(400).json({
      message: "Somthing wend wrong while updating the Rate Card.",
      error: error.message,
    });
  }
};

export const deleteRateCard = async (req, res) => {
  try {
    const rateCard = await RateCard.findByIdAndDelete(req.params.id);

    if (!rateCard)
      return res.status(404).json({
        message: "Rate Card is not found.",
      });

    res.json({ message: "Rate Card is deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Rate card is not deleted please try again. Server-side error",
      error: error.message,
    });
  }
};

export const getAllExistingRateCard = async (req, res) => {
  try {
    const rateCards = await RateCard.find();
    res.status(200).json({
      message: "All existing rate cards fetched from the database successfully",
      rateCards: rateCards,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching the existing rate cards",
      error: error.message,
    });
  }
};
