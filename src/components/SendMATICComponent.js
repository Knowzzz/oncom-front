import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import { baseURL, JSON_RPC_URL } from "../components/const/index";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseEther } from "viem";
import {
  sendTransaction,
  prepareSendTransaction,
  waitForTransaction,
} from "@wagmi/core";

const CustomCard = styled(Card)({
  backgroundColor: "#1f1f1f",
  borderRadius: "15px",
  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .5)",
  color: "#fff",
  width: "40%",
  paddingY: "1%",
  marginTop: "1%",
  marginBottom: "1%",
});

const StyledText = styled(Typography)({
  "@keyframes colorWave": {
    "0%": { color: "darkgrey" },
    "50%": { color: "#f50057" },
    "100%": { color: "darkgrey" },
  },
  animation: "colorWave 2s infinite",
  background: "linear-gradient(90deg, darkgrey, #f50057, darkgrey)",
  backgroundSize: "200% auto",
  color: "white",
  backgroundClip: "text",
  textFillColor: "transparent",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

const SendMATICComponent = ({ recipientPseudo, recipientAddress, daoId }) => {
  const [amount, setAmount] = useState("");

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSendClick = async () => {
    try {
      if (!amount) {
        toast.error("Please set an amount");
        return;
      }
      const prepareReponse = await axios.post(
        `${baseURL}/api/transaction/request/matic/pending`,
        {
          transactionData: {
            senderAddress: JSON.parse(localStorage.getItem("user"))
              .wallet_address,
            recipientAddress: recipientAddress,
            amount,
            amount,
          },
          userId: JSON.parse(localStorage.getItem("user")).id,
          daoId: daoId,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("accessToken"),
          },
        }
      );
      const config = await prepareSendTransaction({
        to: recipientAddress,
        value: parseEther(amount),
      });
      const { hash } = await sendTransaction(config);

      const data = await waitForTransaction({
        chainId: 80001,
        hash: hash,
      });

      const response = await axios.post(
        `${baseURL}/api/transaction/request/matic/verify`,
        {
          txHash: hash,
          userId: JSON.parse(localStorage.getItem("user")).id,
          txId: prepareReponse.data.txId,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("accessToken"),
          },
        }
      );
      if (response.status !== 200) {
        toast.error("Transaction not save in our datas");
      }
      console.log(response);
      toast.success("Transaction has been send");
    } catch (err) {
      toast.error("Cannot send transaction");
      console.log(err);
    }
  };

  return (
    <CustomCard>
      <ToastContainer position="bottom-right" />
      <CardContent>
        <StyledText variant="subtitle2" component="div" gutterBottom>
          Send MATIC to {recipientPseudo}
        </StyledText>
        <Box marginTop={2} marginBottom={2}>
          <Typography variant="body2" color="gray">
            Recipient Address: {recipientAddress}
          </Typography>
        </Box>
        <TextField
          label="Amount"
          variant="outlined"
          value={amount}
          onChange={handleAmountChange}
          fullWidth
          InputProps={{
            style: { color: "gray", fontSize: "0.8rem" },
          }}
          InputLabelProps={{
            style: { color: "gray", fontSize: "0.8rem" },
          }}
        />
        <Box marginTop={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSendClick}
            fullWidth
          >
            Send MATIC
          </Button>
        </Box>
      </CardContent>
    </CustomCard>
  );
};

export default SendMATICComponent;
