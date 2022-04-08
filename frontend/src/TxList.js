export default function TxList({ txs }) {
    if (txs.length === 0) return null;

    return (
        <>
            {txs.map((item) => (
                <div key={item} className="alert alert-info mt-3">
                    <div className="flex-1">
                        Bought by: {item.from}
                    </div>
                </div>
            ))}
        </>
    );
}