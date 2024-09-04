import axios from "axios";
import fs from "fs";
import csvParser from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";

const METRO_CITIES = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Ahmedabad",
  "Kolkata",
  "Pune",
  "Hyderabad",
  "Bangalore",
];

const ZONE_E_STATES = [
  "Jammu Kashmir",
  "Himachal",
  "Leh Ladakh",
  "Andaman Nicobar",
  "Kerala",
  "Assam",
  "Meghalaya",
  "Manipur",
  "Mizoram",
  "Nagaland",
  "Tripura",
];

let pinCodeData = {};

console.log("PinCOde Data", pinCodeData);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getpinCodeData = () => {
  const csvFilePath = path.join(__dirname, "../../data/pincodes.csv");

  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on("data", (row) => {
      if (row.pincode && row.city && row.state) {
        const pincode = row.pincode.trim();
        pinCodeData[pincode] = {
          city: row.city.trim(),
          state: row.state.trim(),
        };
      } else {
        console.log("Invalid CSV file", row);
      }
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
      console.log("pinCodeData is Loaded", pinCodeData);
    })
    .on("error", (error) => {
      console.log("Error while reading CSV file", error);
    });
};

getpinCodeData();

const getPinCodeDetails = async (pincode) => {
  pincode = pincode.trim();

  if (pinCodeData[pincode]) {
    return pinCodeData[pincode];
  }

  try {
    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    console.log("This is the response of India post api", response.data);

    if (
      response.data &&
      response.data[0].Status === "Success" &&
      response.data[0].PostOffice.length > 0
    ) {
      const pinCodeDetails = response.data[0].PostOffice[0];
      return {
        city: pinCodeDetails.District,
        state: pinCodeDetails.State,
      };
    } else {
      console.log(`No Data found for pincode ${pincode}`);
      return null;
    }
  } catch (error) {
    console.log(
      "API request failed. Server Side Error. Please try after some time later!!",
      error
    );
    return null;
  }
};

const getZone = async (req, res) => {
  const { fromPinCode, toPinCode } = req.body;

  if (fromPinCode?.length > 6 && toPinCode?.length > 6) {
    return res.status(400).json({ message: "Please Enter valid Pincode" });
  }

  const fromPinCodeDetails = await getPinCodeDetails(fromPinCode);
  const toPinCodeDetails = await getPinCodeDetails(toPinCode);

  if (!fromPinCodeDetails || !toPinCodeDetails) {
    return res.status(400).json({
      message:
        "Pincode details is not found please enter valid pincode or try after some time",
    });
  }

  if (fromPinCodeDetails?.city === toPinCodeDetails?.city) {
    return res.status(200).json({
      zone: "Zone A",
      details: { fromPinCodeDetails, toPinCodeDetails },
    });
  }

  if (fromPinCodeDetails?.state === toPinCodeDetails?.state) {
    return res.status(200).json({
      zone: "Zone B",
      details: { fromPinCodeDetails, toPinCodeDetails },
    });
  }

  if (
    METRO_CITIES.includes(fromPinCodeDetails.city) &&
    METRO_CITIES.includes(toPinCodeDetails.city)
  ) {
    return res.status(200).json({
      zone: "Zone C",
      details: { fromPinCodeDetails, toPinCodeDetails },
    });
  }

  if (
    ZONE_E_STATES.includes(toPinCodeDetails.state) ||
    ZONE_E_STATES.includes(fromPinCodeDetails.state)
  ) {
    return res.status(200).json({
      zone: "Zone E",
      details: { fromPinCodeDetails, toPinCodeDetails },
    });
  }

  return res.status(200).json({
    zone: "Zone D",
    details: { fromPinCodeDetails, toPinCodeDetails },
  });
};

export { getZone };
