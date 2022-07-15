async function handleSubmit(e: SubmitEvent) {
	e.preventDefault();
	const target = e.target as HTMLFormElement;
	const request = new Request("/api/contact", { 
		method: "POST",
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		body: new URLSearchParams(new FormData(target) as any),
	});
	
	const response = await fetch(request);
	
	if(!response.ok){
		console.error("Failed to submit form");
		if(failNotification) {
			if(failNotification.classList.contains("hidden")){
				failNotification.classList.remove("hidden");
			}
		}
	}
	else {
		console.info("Submitted form successfully");
		target.reset();
		if(successNotification) {
			if(successNotification.classList.contains("hidden")){
				successNotification.classList.remove("hidden");
			}
		}
	}
	notificationVisible = true;
	console.debug(await response.json());
}

function handleChange() {
	if(!notificationVisible) {
		return; //If the notification isn't visible we don't need to do anything
	}

	if(successNotification) {
		if(!successNotification.classList.contains("hidden")){
			//This is visible and the form is being changed so we need to hide it
			successNotification.classList.add("hidden");
		}
	}
	else {
		console.warn("Unable to bind to success notification elements");
	}

	if(failNotification) {
		if(!failNotification.classList.contains("hidden")){
			//This is visible and the form is being changed so we need to hide it
			failNotification.classList.add("hidden");
		}
	}
	else {
		console.warn("Unable to bind to fail notification elements");
	}

	notificationVisible = false;
}

let notificationVisible = false;
let successNotification: HTMLElement | null; 
let failNotification: HTMLElement | null; 

function setup(id: string, successId: string, failId: string) {
	const form = document.getElementById(id) as HTMLFormElement;
	form.addEventListener("submit", handleSubmit);
	form.addEventListener("change", handleChange);
	successNotification = document.getElementById(successId);
	failNotification = document.getElementById(failId);
	console.debug("Submission handler attached");
}

export default setup;
