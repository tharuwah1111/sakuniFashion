
function DeleteCustomers({ cid }) {
    const deleteCustomers = async () => {
        const response = await fetch(`http://localhost:5000/customers/${cid}`, {
            method: "DELETE"
        })
    }
    return (
        <button onClick={deleteCustomers}>delete</button>
    );
}
export default DeleteCustomers;