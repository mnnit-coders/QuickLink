(function () {


	let sender_uid;

	function generateID() {
		return `${Math.floor(Math.random() * 899999 + 100000)}`;
	}

	document.querySelector("#receiver-start-con-btn").addEventListener("click", function () {
		sender_uid = document.querySelector("#join-id").value;
		console.log(sender_uid)
		if (sender_uid.length == 0) {
			return;
		}
		let joinID = generateID();

		document.querySelector(".fs-screen").classList.add("active");
	});


})();