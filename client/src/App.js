import "./App.css";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import authAbi from "./contracts/Authentication.json";
import twitterAbi from "./contracts/Twitter.json";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

const AUTH_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const TWITTER_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

const App = () => {
  const [contractData, setContractData] = useState({
    provider: "",
    signer: "",
    authContract: "",
  });
  const projectId = "bae88779195748e5adc36a1a36f0ae3f";

  const mainnet = {
    chainId: 31337,
    name: "localhost",
    currency: "ETH",
    explorerUrl: "http://127.0.0.1:8545/",
    rpcUrl: "http://127.0.0.1:8545/",
  };

  const metadata = {
    name: "ErcWallet app",
    description: "AppKit Example",
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };

  const ethersConfig = defaultConfig({
    metadata,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    rpcUrl: "http://127.0.0.1:8545/",
    defaultChainId: 31337,
  });

  createWeb3Modal({
    ethersConfig,
    chains: [mainnet],
    projectId,
    enableAnalytics: true,
  });

  const authContractAbi = authAbi.abi;
  const twitterContractAbi = twitterAbi.abi;

  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const connectWallet = async () => {
    try {
      if (!isConnected) throw Error("User disconnected");

      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();

      const network = await ethersProvider.getNetwork();
      console.log(`Connected to network ${network.name} (${network.chainId})`);

      console.log(`Signer address: ${await signer.getAddress()}`);

      const authContract = new ethers.Contract(
        AUTH_ADDRESS,
        authContractAbi,
        signer
      );

      setContractData({ provider: ethersProvider, signer, authContract });
    } catch (error) {
      console.log(error);
    }
  };

  const signUser = async () => {
    try {
      await connectWallet();
      if (contractData.authContract) {
        console.log(contractData.authContract);
        console.log(`Contract address: ${AUTH_ADDRESS}`);
        console.log(`User address: ${address}`);
        const registerResponse = await contractData.authContract.register(
          "j",
          address
        );
        await registerResponse.wait();
        console.log(registerResponse);
      } else {
        alert("wait");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async () => {
    try {
      if (contractData.authContract) {
        const getUserInfo = await contractData.authContract.getUserInfo(
          address
        );
        console.log(getUserInfo);
      } else {
        alert("wait");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <w3m-button />
      <button onClick={signUser}>signUser</button>
      <button onClick={getUserData} style={{ marginLeft: "20px" }}>
        getUserData
      </button>
    </div>
  );
};

export default App;
