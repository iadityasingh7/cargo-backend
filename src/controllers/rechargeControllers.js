import formidable from "formidable";
import https from "https";
import PaytmChecksum from "../paytm/PaytmChecksum.js";
import { error } from "console";

// ---------------------------------> PAYTM PAYMENT AND CALLBACK <------------------------------------------

const payment = async (req, res) => {
  const { amount, name, email, custId, orderId } = req.body;

  const params = {
    MID: process.env.PAYTM_MID,
    WEBSITE: process.env.PAYTM_WEBSITE,
    CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
    INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE_ID,
    ORDER_ID: orderId,
    CUST_ID: custId,
    TXN_AMOUNT: amount,
    CALLBACK_URL: "http://localhost:5000/api/wallet/callback",
    EMAIL: email,
    MOBILE_NO: "9517126314",
  };

  const merchantKey = process.env.PAYTM_MERCHANT_KEY;

  try {
    const checksum = await PaytmChecksum.generateSignature(params, merchantKey);

    // here my checksum is generated successfully
    console.log("generateSignature Returns: ", checksum);

    const paytmParams = {
      ...params,
      CHECKSUMHASH: checksum,
    };

    res.status(200).json(paytmParams);
  } catch (error) {
    console.error("Checksum generation error:", error);
    res.status(500).json({ error: "Checksum generation failed" });
  }
};

const callback = (req, res) => {
  console.log("Callback is running and this is the proof ------------------->");
  console.log(
    "Callback for the payment gateway and this is the final response",
    req.body
  );

  const form = formidable({});

  form.parse(req, (err, fields) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    console.log("Fields:", fields);

    var paytmChecksum = fields.CHECKSUMHASH;
    console.log("PaytmChecksum", paytmChecksum);

    var isVerifySignature = PaytmChecksum.verifySignature(
      fields,
      process.env.PAYTM_MERCHANT_KEY,
      paytmChecksum
    );
    if (isVerifySignature) {
      console.log("Checksum Matched");

      const paytmParams = {
        MID: fields.MID,
        ORDER_ID: fields.ORDERID,
      };

      PaytmChecksum.generateSignature(
        paytmParams,
        process.env.PAYTM_MERCHANT_KEY
      )
        .then(function (checksum) {
          paytmParams["CHECKSUMHASH"] = checksum;

          // prepare JSON string for request
          var post_data = JSON.stringify(paytmParams);

          console.log("post_data", post_data);

          var options = {
            hostname: "securegw-stage.paytm.in",
            port: 443,
            path: "/v3/order/status",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": post_data.length,
            },
          };

          // Set up the request
          var response = "";
          var post_req = https.request(options, (post_res) => {
            post_res.on("data", (chunk) => {
              response += chunk;
            });

            post_res.on("end", () => {
              console.log("Response from Paytm: ", response);
              res
                .status(200)
                .json({ message: "Payment Successfull", response });
            });
          });

          // post the data
          post_req.write(post_data);
          post_req.end();
        })
        .catch((error) => {
          console.error("Error generating Signature:", error);
        });
    } else {
      console.log("Checksum Mismatched");
      return;
    }
  });
};

// ---------------------------------> UPDATE WALLET AND WALLET HISTORY <------------------------------------

const updateWallet = async (req, res) => {
  const { userID, trnsDetails } = req.body;
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

export { payment, callback, updateWallet };
