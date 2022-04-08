export default function ErrorMessage({ message }) {
    if (!message) return null;

    return (
            <div className="alert alert-danger mt-5">
                <div className="flex-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 10"></svg>
                    <label>{message}</label>
                </div>
            </div>
        );
    }
