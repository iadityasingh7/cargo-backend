import formidable from "formidable";
import https from "https";
import PaytmChecksum from "../paytm/PaytmChecksum.js";

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
    MOBILE_NO: "9876543210",
  };

  const merchantKey = process.env.PAYTM_MERCHANT_KEY;

  try {
    const checksum = await PaytmChecksum.generateSignature(params, merchantKey);
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
  console.log("Callback is running and this is prouf --------------->");

  const form = formidable({});

  form.parse(req, (err, fields, file) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    console.log("Fields:", fields);

    var paytmChecksum = fields.CHECKSUMHASH;

    var isVerifySignature = PaytmChecksum.verifySignature(
      fields,
      process.env.PAYTM_MERCHANT_KEY,
      paytmChecksum
    );
    if (isVerifySignature) {
      console.log("Checksum Matched");

      const paytmParams = {};

      paytmParams["MID"] = fiels.MID;
      paytmParams["ORDER_ID"] = fiels.ORDER_ID;

      PaytmChecksum.generateSignature(
        paytmParams,
        process.env.PAYTM_MERCHANT_KEY
      ).then(function (checksum) {
        paytmParams["CHECKSUMHASH"] = checksum;

        // prepare JSON string for request
        var post_data = JSON.stringify(paytmParams);

        var options = {
          hostname: "securegw-stage.paytm.in",

          // for Production
          // hostname: 'securegw.paytm.in',

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
        var post_req = https.request(options, function (post_res) {
          post_res.on("data", function (chunk) {
            response += chunk;
          });

          post_res.on("end", function () {
            console.log("Response: ", response);
            res.status(200).json({message: "Payment Successfull", response});
          });
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
      });
    } else {
      console.log("Checksum Mismatched");
      return res.status(500).json({ error: "Checksum Mismatch" });
    }

    // Add further processing of the fields if necessary
  });
};

// ---------------------------------> UPDATE WALLET AND WALLET HISTORY <------------------------------------

const updateWallet = (req, res) => {
  console.log("Update Wllet Method run in backend", req.body);
};

export { payment, callback, updateWallet };

// import formidable from "formidable";
// import PaytmChecksum from "../paytm/PaytmChecksum.js";

// const payment = (req, res) => {
//   const { amount, name, email, custId, orderId } = req.body;

//   var params = {};
//   (params["MID"] = process.env.PAYTM_MID),
//     (params["WEBSITE"] = process.env.PAYTM_WEBSITE),
//     (params["CHANNEL_ID"] = process.env.PAYTM_CHANNEL_ID),
//     (params["INDUSTRY_TYPE_ID"] = process.env.PAYTM_INDUSTRY_TYPE_ID),
//     (params["ORDER_ID"] = orderId),
//     (params["CUST_ID"] = custId),
//     (params["TXN_AMOUNT"] = amount),
//     (params["CALLBACK_URL"] = "http://localhost:5000/api/payment/callback"),
//     (params["EMAIL"] = email),
//     (params["MOBILE_NO"] = "9876543210");

//   const merchantKey = process.env.PAYTM_MERCHANT_KEY;

//   var paytmChecksum = PaytmChecksum.generateSignature(params, merchantKey);
//   paytmChecksum
//     .then(function (checksum) {
//       console.log("generateSignature Returns: " + checksum);
//       let paytmParams = {
//         ...params,
//         CHECKSUMHASH: checksum,
//       };
//       res.status(200).json(paytmParams);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// };

// // We cant parse form data automatic So we use multer or formidable to parse and handle the form data we also write your custom code but for security essuses the best choice use the predefind packeages

// const callback = (req, res) => {
//   const form = new formidable.IncomingForm();

//   form.parse(req, (err, fields, file) => {
//     console.log("Fields", fields);
//   });
// };

// export { payment, callback };
