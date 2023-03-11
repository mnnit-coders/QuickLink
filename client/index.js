(function () {

    let receiverID;


    function generateID() {
        return `${Math.floor(Math.random() * 899999 + 100000)}`;
    }

    document.querySelector("#sender-start-con-btn").addEventListener("click", function () {
        document.querySelector(".receiver").classList.remove("active");
        let joinID = generateID();
        document.querySelector("#join-id").innerHTML = `
		<label>Joining Code</label>
		<span>${joinID}</span>
		`;
        
    });

})();