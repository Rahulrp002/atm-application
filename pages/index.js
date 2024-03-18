import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [principle, setPrinciple] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [interestAmount, setInterestAmount] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const calculateInterest = () => {
    // Check if password is correct
    if (password !== "rahul") {
      setPasswordError(true);
      return;
    }

    const principleAmount = parseFloat(principle);
    const rate = parseFloat(interestRate);
    const time = parseFloat(timePeriod);

    const interest = (principleAmount * rate * time) / 100;
    setInterestAmount(interest.toFixed(2));
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>

        <h2>Interest Calculator</h2>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p style={{ color: "red" }}>Incorrect password. Please try again.</p>}
        <input
          type="number"
          placeholder="Enter Principle Amount"
          value={principle}
          onChange={(e) => setPrinciple(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Interest Rate (%)"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Time Period (years)"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
        />
        <button onClick={calculateInterest}>Calculate Interest</button>
        {interestAmount && <p>Interest Amount: {interestAmount} ETH</p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
