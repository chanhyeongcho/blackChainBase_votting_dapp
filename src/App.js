import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import CHCtokenData from "./CHCtoken.json"; // JSON 파일을 가져옴
const CHCtokenABI = CHCtokenData.abi; // `abi` 필드를 명시적으로 가져옴

function App() {
  const [account, setAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState("0");
  const [chcBalance, setChcBalance] = useState("0");

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          
          // 이더리움(ETH) 잔액 조회
          const ethBalance = await provider.getBalance(accounts[0]);
          setEthBalance(ethers.utils.formatUnits(ethBalance, 18));

          // CHC 토큰 잔액 조회
          const signer = provider.getSigner();
          const chcContract = new ethers.Contract("0xB90B5Bb543cdDd6fBF53EDeaDc631570699a911E", CHCtokenABI, signer);

          // balanceOf 함수 호출
          const chcBalance = await chcContract.balanceOf(accounts[0]);
          setChcBalance(ethers.utils.formatUnits(chcBalance, 18));
        } catch (error) {
          console.error("Failed to retrieve account or balances:", error);
        }
      } else {
        alert("Please install Metamask to use this feature!");
      }
    };

    if (!account) {
      connectWallet();
    }
  }, [account]);

  return (
    <div className="App">
      {account ? (
        <div>
          <p>Connected account: {account}</p>
          <p>ETH Balance: {ethBalance} ETH</p>
          <p>CHC Balance: {chcBalance} CHC</p>
        </div>
      ) : (
        <button onClick={() => window.ethereum.request({ method: "eth_requestAccounts" })}>Connect Wallet</button>
      )}
    </div>
  );
}

export default App;