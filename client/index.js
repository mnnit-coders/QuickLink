(function(){

	let receiverID;
	const socket = io();

	function generateID(){
		return `${Math.floor(Math.random() * 899999 + 100000)}`;
	}

	document.querySelector("#sender-start-con-btn").addEventListener("click",function(){
		document.querySelector(".receiver").classList.remove("active");
		let joinID = generateID();
		document.querySelector("#join-id").innerHTML = `
		<label>Joining Code</label>
		<span>${joinID}</span>
		`;
		socket.emit("sender-join", {
			uid:joinID
		});
	});

	socket.on("init",function(uid){
		receiverID = uid;
		
		document.querySelector(".fs-screen").classList.add("active");
	});

	document.querySelector("#file-input").addEventListener("change",function(e){
		let file = e.target.files[0];
		if(!file){
			return;		
		}
		let reader = new FileReader();
		reader.onload = function(e){
			let buffer = new Uint8Array(reader.result);
			let el = document.createElement("div");
			el.classList.add("item");
			el.innerHTML = `
					
					<div class="filename">${file.name}</div>
					<div class="progress">0%</div>
			`;
			document.querySelector(".files-list").appendChild(el);
			shareFile({
				filename: file.name,
				total_buffer_size:buffer.length,
				buffer_size:1024,
			}, buffer, el.querySelector(".progress"));
		}
		reader.readAsArrayBuffer(file);
	});


	function shareFile(metadata,buffer,progress_node){
		console.log(receiverID)
		socket.emit("file-meta", {
			uid:receiverID,
			metadata:metadata
		});
		
		socket.on("fs-share",function(){
			console.log('this is buffer',buffer)
			let chunk = buffer.slice(0,metadata.buffer_size);
			console.log(chunk)
			buffer = buffer.slice(metadata.buffer_size,buffer.length);
			progress_node.innerText = ` ${Math.trunc(((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100))}`+'%';
			if(chunk.length != 0){
				socket.emit("file-raw", {
					uid:receiverID,
					buffer:chunk
				});
			} else {
				console.log("Sent file successfully");
			}
		});
	}
})();