function status(request, response) {
  response.status(200).json({ chave: "Eu sou fodão" });
}

export default status;
