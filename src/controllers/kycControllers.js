import axios from "axios";
import crypto from "crypto";

// ----------------------------->function to handle Aadhaar KYC OTP request<-------------------------

const verifyAadhaar = async (req, res) => {
  const { aadhaarNumber } = req.body;
  try {
    async function getSignature() {
      const clientId = process.env.CLIENT_ID;
      const publicKey = await getPublicKey();
      const encodedData =
        clientId + "." + Math.floor(Date.now() / 1000).toString();
      return encryptRSA(encodedData, publicKey);
    }

    async function getPublicKey() {
      const publicKeyData = process.env.PUBLIC_KEY;

      return crypto.createPublicKey({ key: publicKeyData, format: "pem" });
    }

    function encryptRSA(plainData, publicKey) {
      const plainBuffer = Buffer.from(plainData, "utf-8");

      const encryptedBuffer = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        plainBuffer
      );
      return encryptedBuffer.toString("base64");
    }

    const signature = await getSignature();

    const options = {
      method: "POST",
      url: "https://sandbox.cashfree.com/verification/offline-aadhaar/otp",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-client-id": process.env.CLIENT_ID,
        "x-client-secret": process.env.CLIENT_SECRET,
        "x-cf-signature": signature,
        "x-api-version": "2022-10-26",
      },
      data: { aadhaar_number: aadhaarNumber },
    };
    const response = await axios.request(options);
    res.status(200).json({
      message: "OTP sent successfully to registered mobile number",
      data: response?.data,
      status: response?.status,
    });
  } catch (error) {
    console.log("Error sending Aadhaar OTP", error);
    res.status(500).json({
      message: "Error sending Aadhaar OTP. Please try again.",
      error: error,
    });
  }
};

// ------------------------------------->Verfity otp<--------------------------------------------

const aadhaarVarifictionOtp = async (req, res) => {
  const { otp, refId } = req.body;

  try {
    async function getSignature() {
      const clientId = process.env.CLIENT_ID;
      const publicKey = await getPublicKey();
      const encodedData =
        clientId + "." + Math.floor(Date.now() / 1000).toString();
      return encryptRSA(encodedData, publicKey);
    }

    async function getPublicKey() {
      const publicKeyData = process.env.PUBLIC_KEY;

      return crypto.createPublicKey({ key: publicKeyData, format: "pem" });
    }

    function encryptRSA(plainData, publicKey) {
      const plainBuffer = Buffer.from(plainData, "utf-8");

      const encryptedBuffer = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        plainBuffer
      );
      const encryptedData = encryptedBuffer.toString("base64");
      return encryptedData;
    }

    const signature = await getSignature();

    const options = {
      method: "POST",
      url: "https://sandbox.cashfree.com/verification/offline-aadhaar/verify",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-client-id": process.env.CLIENT_ID,
        "x-client-secret": process.env.CLIENT_SECRET,
        "x-cf-signature": signature,
        "x-api-version": "2022-10-26",
      },

      data: { otp: otp, ref_id: refId },
    };

    const response = await axios.request(options);
    res.status(200).json({
      message: "OTP verification successful",
      data: response?.data,
      status: response?.status,
    });
  } catch (error) {
    console.log("Error sending OTP verification request", error);
    res.status(500).json({
      message:
        "Error sending OTP verification request. Please try after some time",
      error: error,
    });
  }
};

//--------------------------------------->Verify Pan number<------------------------------------

const verifyPan = async (req, res) => {
  const { panNumber, name } = req.body;

  try {
    async function getSignature() {
      const clientId = process.env.CLIENT_ID;
      const publicKey = await getPublicKey();
      const encodedData =
        clientId + "." + Math.floor(Date.now() / 1000).toString();
      return encryptRSA(encodedData, publicKey);
    }

    async function getPublicKey() {
      const publicKeyData = process.env.PUBLIC_KEY;

      return crypto.createPublicKey({ key: publicKeyData, format: "pem" });
    }

    function encryptRSA(plainData, publicKey) {
      const plainBuffer = Buffer.from(plainData, "utf-8");

      const encryptedBuffer = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        plainBuffer
      );
      return encryptedBuffer.toString("base64");
    }

    const signature = await getSignature();

    const options = {
      method: "POST",
      url: "https://sandbox.cashfree.com/verification/pan",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-client-id": process.env.CLIENT_ID,
        "x-client-secret": process.env.CLIENT_SECRET,
        "x-cf-signature": signature,
        "x-api-version": "2022-10-26",
      },
      data: { pan: panNumber, name: name },
    };

    const response = await axios.request(options);
    res.status(200).json({
      message: "Pan Details are Valid",
      data: response?.data,
      status: response?.status,
    });
  } catch (error) {
    console.log("Pan varification failed", error);
    res.status(500).json({
      message: "Pan verifiation failed. Please try again.",
      error: error,
    });
  }
};

//--------------------------------------->Verify Bank Account<------------------------------------

const verifyBank = async (req, res) => {
  const { accountNumber, ifscCode, accountHolderName, phoneNumber } = req.body;
  try {
    async function getSignature() {
      const clientId = process.env.CLIENT_ID;
      const publicKey = await getPublicKey();
      const encodedData =
        clientId + "." + Math.floor(Date.now() / 1000).toString();
      return encryptRSA(encodedData, publicKey);
    }

    async function getPublicKey() {
      const publicKeyData = process.env.PUBLIC_KEY;
      return crypto.createPublicKey({ key: publicKeyData, format: "pem" });
    }

    function encryptRSA(plainData, publicKey) {
      const plainBuffer = Buffer.from(plainData, "utf-8");

      const encryptedBuffer = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        plainBuffer
      );
      const encryptedData = encryptedBuffer.toString("base64");
      return encryptedData;
    }

    const signature = await getSignature();

    const authUrl = "https://payout-gamma.cashfree.com/payout/v1/authorize";
    const bankVerificationUrl =
      "https://sandbox.cashfree.com/verification/bank-account/sync";

    const tokenOptions = {
      method: "POST",
      url: authUrl,
      headers: {
        "x-client-id": process.env.CLIENT_ID,
        "x-client-secret": process.env.CLIENT_SECRET,
        "x-cf-signature": signature,
        "x-api-version": "2022-10-26",
        "content-type": "application/json",
      },
    };

    const tokenRes = await axios.request(tokenOptions);
    const tokenData = tokenRes?.data;

    console.log("Token Data", tokenData);

    if (!tokenData || !tokenData.data || !tokenData.data.token) {
      throw new Error("Failed to obtain token from Cashfree");
    }

    const options = {
      method: "POST",
      url: bankVerificationUrl,
      headers: {
        "x-client-id": process.env.CLIENT_ID,
        "x-client-secret": process.env.CLIENT_SECRET,
        "x-cf-signature": signature,
        Authorization: `Bearer ${tokenData.data.token}`,
        accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        bank_account: accountNumber,
        ifsc: ifscCode,
        name: accountHolderName,
        phone: phoneNumber,
      },
    };

    const response = await axios.request(options);
    res.status(200).json({
      message: "Bank details",
      data: response?.data,
      status: response?.status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Transaction failed at the bank. Please verify your bank account information.",
      error: error,
    });
  }
};

//--------------------------------------->Verify GST Number<------------------------------------

const verifyGst = async (req, res) => {
  const { gstNumber, businessName } = req.body;
  console.log(gstNumber, businessName);
  try {
    async function getSignature() {
      const clientId = process.env.CLIENT_ID;
      const publicKey = await getPublicKey();
      const encodedData =
        clientId + "." + Math.floor(Date.now() / 1000).toString();
      return encryptRSA(encodedData, publicKey);
    }

    async function getPublicKey() {
      const publicKeyData = process.env.PUBLIC_KEY.split(String.raw`\n`).join(
        `\n`
      );
      console.log(publicKeyData);
      return crypto.createPublicKey({ key: publicKeyData, format: "pem" });
    }

    function encryptRSA(plainData, publicKey) {
      const plainBuffer = Buffer.from(plainData, "utf-8");

      const encryptedBuffer = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        plainBuffer
      );
      const encryptedData = encryptedBuffer.toString("base64");
      return encryptedData;
    }

    const signature = await getSignature();

    const options = {
      method: "POST",
      url: "https://sandbox.cashfree.com/verification/gstin",
      headers: {
        "x-client-id": process.env.CLIENT_ID,
        "x-client-secret": process.env.CLIENT_SECRET,
        "x-cf-signature": signature,
        "x-api-version": "2022-10-26",
        "content-type": "application/json",
      },
      data: {
        GSTIN: gstNumber,
        businessName: businessName,
      },
    };

    console.log(options);

    const response = await axios.request(options);
    res.status(200).json({
      message: "GST details are valid",
      data: response?.data,
      status: response?.status,
    });
  } catch (error) {
    console.error("GST verification failed", error);
    res.status(500).json({
      message: "GST verifiation failed. Please try again.",
      error: error,
    });
  }
};

export {
  verifyAadhaar,
  aadhaarVarifictionOtp,
  verifyPan,
  verifyBank,
  verifyGst,
};

// How I add the data in my database when the varification done --->

// In front end first check what is the response come in front-end

// and If the response is 200 or successful means the varifiction data is true

// useState Hook to store data and when the user click the button to save the data

// So we get the data from the useState and send that data in backend and your backend connect with datasbase and your data save in database
