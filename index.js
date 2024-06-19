const express = require('express');
const app = express();

app.use(express.json())

let phonebook = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }

];

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${phonebook.length} people</p>
        <p>${Date()}</p>`
    )
});

app.get('/api/persons', (request, response) => {
    response.json(phonebook);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.statusMessage = 'We have no page for that'
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    phonebook = phonebook.filter(person => person.id !== id);

    response.status(204).end();
})

const generateId = () => {
    const maxId = phonebook.length > 0
        ? Math.max(...phonebook.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    const contact = {
        id: generateId(),
        name: body.name,
        number: body.number
    };

    phonebook = phonebook.concat(contact);

    response.json(contact);
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${3001}`)
})