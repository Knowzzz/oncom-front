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
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Demande à MetaMask de connecter le compte de l'utilisateur
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("L'utilisateur a refusé la connexion à MetaMask");
      }
    } else {
      console.log("Vous devez installer MetaMask !");
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSendClick = async () => {
    try {
      const transactionData = {
        senderAddress: JSON.parse(localStorage.getItem("user")).wallet_address,
        recipientAddress: recipientAddress,
        amount: amount,
      };

      const response = await axios.post(
        `${baseURL}/api/transaction/request/matic/pending`,
        {
          transactionData,
          userId: JSON.parse(localStorage.getItem("user")).id,
          daoId: daoId,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("accessToken"),
          },
        }
      );

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signedTx = await signer.signTransaction(response.data.unsignedTransaction);
        console.log(signedTx);
      } else {
        console.log("Vous devez installer MetaMask !");
        connectWallet();
      }
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  return (
    <CustomCard>
      <ToastContainer />
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
