const form = document.getElementById("form")
const networkIdInput = document.getElementById("network-id")
const list = document.getElementById("list")

const API_URL = "http://localhost:3001/api"

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    try {
        list.innerHTML="Loading..."
        const network = await getNetwork()
        // if(!network.name) throw new Error("Bad request")
        if(!network.name) throw new Error("Bad request")
        displayNetwork(network)
    } catch (error) {
        list.innerHTML="Failed to load network."
        console.error(error)
    }
})


async function getNetwork() {
    const response = await fetch(`${API_URL}/${networkIdInput.value}`)
    const data = await response.json()
    return data
}

function displayNetwork(network) {
    const personItems = network.people.map(createPersonListItemFactory(network.people))
    list.innerHTML = personItems.join("<hr/>")
}

function createPersonListItemFactory(people) {
    return (person) => {
        return `
            <div id=${person.id}>
                <h3>${person.name || "MISSING_NAME"} ${person.isGroup ? "[GROUP]" : ""}</h3>
                ${person.thumbnailUrl ? `<img src="${person.thumbnailUrl}" style="width:32px;height:32px"></img>` : ""}
                <pre>${person.content || ""}</pre>
                <ul>
                    ${getRelatedPersonLinks(person, people)}
                </ul>
            </div>
        `
    }
}

function getRelatedPersonLinks(person, people) {
    const relEntries = Object.entries(person.relationships)
    const relListItems = relEntries.map(getRelationshipListItemFactory(people))
    return relListItems.join("")
}

function getRelationshipListItemFactory(people) {
    return (relEntry)=> {
        const [relId, details] = relEntry
        const otherPerson = Object.values(people).find(p => p.id === relId);
        const relReason = details.reason

        const name = otherPerson ? otherPerson.name : "MISSING_NAME"
        const reason = relReason ? ` - ${relReason}` : ''

        return `
            <li><a href="#${relId}">${name}</a> ${reason}</li>
        `
    }
}