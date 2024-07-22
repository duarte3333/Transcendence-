document.addEventListener('DOMContentLoaded', function() {
	const button = document.getElementById("changeUsername");
	button.addEventListener('click', changeUsername);
})

function changeUsername() {
	const button = document.getElementById("changeUsername");
	button.style.display = "none";

	const col = document.getElementById('colUsername');

    const div = document.createElement('div');
	div.classList.add('input-group');
	div.classList.add('w-50');

    const span = document.createElement('span');
    span.className = 'input-group-text';
    span.id = 'basic-addon1';
    span.innerText = 'New Username';

	const input = document.createElement('input');
	input.type = 'text';
    input.className = 'form-control';
    input.placeholder = 'Username';
    input.setAttribute('aria-label', 'Username');
    input.setAttribute('aria-describedby', 'basic-addon1');

	//add finish button;

	div.appendChild(span);
	div.appendChild(input);
	col.appendChild(div);
}