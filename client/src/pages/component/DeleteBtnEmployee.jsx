
function DeleteBtnEmployee({ eid }) {
    const deleteEmployees = async () => {
        const response = await fetch(`http://localhost:5000/employee/${eid}`, {
            method: "DELETE"
        })
    }
    return (
        <button onClick={deleteEmployees}>delete</button>
    );
}
export default DeleteBtnEmployee;