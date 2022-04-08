import { ethers, Contract } from "ethers";
import TokenBuyer from "./TokenBuyer.json";

const getBlockchain = () =>
    new Promise((resolve, reject) => {
        window.addEventListener("load", async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const tokenBuyerContract = new Contract(
                    TokenBuyer.address,
                    TokenBuyer.abi,
                    signer
                );
                resolve({ tokenBuyerContract });
            }
            resolve({ tokenBuyerContract: undefined });
        });
    });

export default getBlockchain;