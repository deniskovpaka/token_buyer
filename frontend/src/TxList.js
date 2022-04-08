export default function TxList({ txs }) {
    if (txs.length === 0) return null;

    return (
        <>
            {txs.map((item) => (
                <div key={item} className="alert alert-info mt-5">
                    <div className="flex-1">
                        <h3>Was sold to:</h3>
                        <label>{item.from}</label>
                    </div>
                </div>
            ))}
        </>
    );
}