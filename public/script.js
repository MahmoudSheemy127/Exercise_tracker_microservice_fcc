const form = document.getElementById("ExerciseForm")

form.addEventListener("submit",(evt) => {
    let id = form.elements[0].value
    form.action = `/api/users/${id}/exercises`
})