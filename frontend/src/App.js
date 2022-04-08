import { useState, useEffect } from "react";
import { BigNumber } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import ProgressBar from "react-bootstrap/ProgressBar";
import getBlockchain from "./Ethereum.js";
import "bootstrap/dist/css/bootstrap.css";

const startBuying = async ({ tokenBuyerContract, tokenBalance, ether,
    setError, setTxs, setLeftPercentage }) => {
    try {
        await tokenBuyerContract.deployed();
        const buyTx = await tokenBuyerContract.buy(ether);
        setTxs([buyTx]);
        let tokensSold = await tokenBuyerContract.tokensSold();
        setLeftPercentage(Math.round((tokenBalance - tokensSold) / tokenBalance * 100).toFixed(2));
    } catch (err) {
        setError(err.message);
    }
};

export default function App() {
    const [leftPercentage, setLeftPercentage] = useState(100);
    const [error, setError] = useState();
    const [txs, setTxs] = useState([]);
    const [tokenBuyerContract, setTokenBuyerContract] = useState(undefined);
    const [tokenBalance, setTokenBalance] = useState(0);

    useEffect(() => {
        const init = async () => {
            const { tokenBuyerContract } = await getBlockchain();
            setTokenBuyerContract(tokenBuyerContract);
            await tokenBuyerContract.deployed();
            setTokenBalance(await tokenBuyerContract.getERC20TokenBalance());
        };
        init();
        setError();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        setError();
        await startBuying({
            tokenBuyerContract,
            tokenBalance,
            ether: BigNumber.from(data.get("ether")),
            setError,
            setTxs,
            setLeftPercentage
        });
    };

    if (typeof tokenBuyerContract === "undefined") {
        return "Loading...";
    }

    return (
        <form className="m-4" onSubmit={handleSubmit}>
            <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
                <main className="mt-4 p-4">
                    <h1 className="text-xl font-semibold text-gray-700 text-center">
                        ETH20Token
                    </h1>
                    <div className="">
                        <div className="my-3">
                            <div className="input-group w-25">
                                <input name="ether" type="text" className="form-control" placeholder="Amount of ETH20Tokens" />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="submit">Buy</button>
                                </div>
                            </div>
                            <div className="my-3" >
                                <p class="text-center">Total balance: {tokenBalance.toString()}</p>
                            </div>
                            <div className="my-3">
                                <ProgressBar animated now={leftPercentage} label={`${leftPercentage}%`} />
                                <font color="#0D6EFD">Available ERC20Tokens</font>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="p-4 pt-1">
                    <ErrorMessage message={error} />
                    <TxList txs={txs} />
                </footer>
            </div>
        </form>
    );
}
